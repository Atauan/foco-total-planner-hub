/*
  # Criar sistema de usuários

  1. Nova Tabela
    - `usuarios`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key para auth.users)
      - `nome` (text)
      - `email` (text, unique)
      - `tipo` (text, 'aluno' ou 'admin')
      - `plano` (text, opcional)
      - `data_validade` (timestamptz, opcional)
      - `ativo` (boolean, default true)
      - `ultimo_acesso` (timestamptz, opcional)
      - `created_at` (timestamptz, default now)
      - `criado_por` (text)

  2. Tabela de Logs
    - `logs_acesso`
      - Para auditoria de acessos

  3. Segurança
    - Enable RLS na tabela usuarios
    - Políticas para usuários autenticados
    - Política especial para admins
*/

-- Criar tabela usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    nome text NOT NULL,
    email text NOT NULL UNIQUE,
    tipo text NOT NULL DEFAULT 'aluno' CHECK (tipo IN ('aluno', 'admin')),
    plano text,
    data_validade timestamptz,
    ativo boolean NOT NULL DEFAULT true,
    ultimo_acesso timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    criado_por text DEFAULT 'manual'
);

-- Criar tabela de logs de acesso
CREATE TABLE IF NOT EXISTS public.logs_acesso (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo_acao text NOT NULL,
    detalhes jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_acesso ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON public.usuarios
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Admins têm acesso total aos usuários"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin'
    )
  );

-- Políticas para logs_acesso
CREATE POLICY "Usuários podem ver seus próprios logs"
  ON public.logs_acesso
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE id = logs_acesso.usuario_id 
      AND auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem ver todos os logs"
  ON public.logs_acesso
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND tipo = 'admin'
    )
  );

-- Função para gerar senha aleatória
CREATE OR REPLACE FUNCTION generate_random_password(length integer DEFAULT 12)
RETURNS text AS $$
DECLARE
    chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result text := '';
    i integer;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se usuário está ativo
CREATE OR REPLACE FUNCTION is_user_active(user_id uuid)
RETURNS boolean AS $$
DECLARE
    user_record public.usuarios%ROWTYPE;
BEGIN
    SELECT * INTO user_record FROM public.usuarios WHERE auth_user_id = user_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Verificar se está ativo
    IF NOT user_record.ativo THEN
        RETURN false;
    END IF;
    
    -- Verificar validade (se não for admin)
    IF user_record.tipo != 'admin' AND user_record.data_validade IS NOT NULL THEN
        IF user_record.data_validade < now() THEN
            RETURN false;
        END IF;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir usuário admin padrão (será criado apenas se não existir)
DO $$
BEGIN
    -- Verificar se já existe um admin
    IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE tipo = 'admin') THEN
        -- Inserir admin padrão (você precisará criar este usuário no Supabase Auth também)
        INSERT INTO public.usuarios (
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
            'sistema'
        );
    END IF;
END $$;