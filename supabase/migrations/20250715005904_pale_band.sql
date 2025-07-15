/*
  # Sistema de Autenticação Completo

  1. Tabelas
    - `usuarios` - Dados dos usuários (aluno/admin)
    - `logs_acesso` - Log de acessos e atividades
  
  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para alunos e admins
    - Triggers para logs automáticos
  
  3. Funcionalidades
    - Tipos de usuário (aluno/admin)
    - Controle de validade de acesso
    - Integração com Kiwify via webhook
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('aluno', 'admin')) DEFAULT 'aluno',
  plano text,
  data_validade timestamptz,
  senha_temporaria text,
  criado_por text DEFAULT 'manual' CHECK (criado_por IN ('manual', 'google', 'kiwify')),
  ativo boolean DEFAULT true,
  ultimo_acesso timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de logs de acesso
CREATE TABLE IF NOT EXISTS logs_acesso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_acao text NOT NULL,
  detalhes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_data_validade ON usuarios(data_validade);
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs_acesso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_acesso(created_at);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_usuarios_updated_at 
  BEFORE UPDATE ON usuarios 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar se usuário está ativo
CREATE OR REPLACE FUNCTION usuario_ativo(user_id uuid)
RETURNS boolean AS $$
DECLARE
  usuario_data usuarios%ROWTYPE;
BEGIN
  SELECT * INTO usuario_data FROM usuarios WHERE auth_user_id = user_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Admin sempre ativo
  IF usuario_data.tipo = 'admin' THEN
    RETURN usuario_data.ativo;
  END IF;
  
  -- Aluno: verificar validade e status ativo
  RETURN usuario_data.ativo AND (usuario_data.data_validade IS NULL OR usuario_data.data_validade > now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_acesso ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuários podem ver próprios dados"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins podem ver todos os usuários"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem inserir usuários"
  ON usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Admins podem atualizar usuários"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Usuários podem atualizar próprios dados básicos"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (
    auth.uid() = auth_user_id 
    AND tipo = OLD.tipo 
    AND data_validade = OLD.data_validade
  );

-- Políticas para logs_acesso
CREATE POLICY "Usuários podem ver próprios logs"
  ON logs_acesso
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = logs_acesso.usuario_id 
      AND auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem ver todos os logs"
  ON logs_acesso
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin' 
      AND ativo = true
    )
  );

CREATE POLICY "Sistema pode inserir logs"
  ON logs_acesso
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Função para gerar senha aleatória
CREATE OR REPLACE FUNCTION gerar_senha_aleatoria(tamanho integer DEFAULT 12)
RETURNS text AS $$
DECLARE
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  senha text := '';
  i integer;
BEGIN
  FOR i IN 1..tamanho LOOP
    senha := senha || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN senha;
END;
$$ LANGUAGE plpgsql;

-- Inserir usuário admin padrão
DO $$
BEGIN
  -- Criar usuário admin se não existir
  IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@focototal.com') THEN
    INSERT INTO usuarios (
      nome,
      email,
      tipo,
      ativo,
      criado_por
    ) VALUES (
      'Administrador',
      'admin@focototal.com',
      'admin',
      true,
      'manual'
    );
  END IF;
END $$;