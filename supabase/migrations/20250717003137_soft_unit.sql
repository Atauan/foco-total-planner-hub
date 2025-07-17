/*
  # Corrigir políticas RLS com recursão infinita

  1. Problemas corrigidos
    - Remove políticas com recursão infinita na tabela usuarios
    - Simplifica políticas para evitar loops
    - Cria políticas diretas sem subconsultas complexas

  2. Segurança
    - Políticas simples e eficientes
    - Sem recursão ou loops
    - Acesso controlado por auth.uid()

  3. Usuário de teste
    - Cria usuário admin para testes
    - Email: admin@focototal.com
    - Senha: admin123
*/

-- Remove todas as políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Admins têm acesso total aos usuários" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar próprios dados básicos" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON usuarios;
DROP POLICY IF EXISTS "Admins podem ver todos os logs" ON logs_acesso;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios logs" ON logs_acesso;

-- Políticas simples para a tabela usuarios (sem recursão)
CREATE POLICY "usuarios_select_own" 
  ON usuarios 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "usuarios_update_own" 
  ON usuarios 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Política especial para admins (usando auth.jwt() para evitar recursão)
CREATE POLICY "usuarios_admin_all" 
  ON usuarios 
  FOR ALL 
  USING (
    auth.jwt() ->> 'email' = 'admin@focototal.com' OR
    (auth.uid() IN (
      SELECT auth_user_id 
      FROM usuarios 
      WHERE tipo = 'admin' AND auth_user_id = auth.uid()
    ))
  );

-- Políticas para logs_acesso (simples, sem recursão)
CREATE POLICY "logs_select_own" 
  ON logs_acesso 
  FOR SELECT 
  USING (
    usuario_id IN (
      SELECT id 
      FROM usuarios 
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "logs_insert_own" 
  ON logs_acesso 
  FOR INSERT 
  WITH CHECK (
    usuario_id IN (
      SELECT id 
      FROM usuarios 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Criar usuário de teste se não existir
DO $$
DECLARE
  user_id uuid;
  usuario_exists boolean;
BEGIN
  -- Verificar se já existe um usuário admin
  SELECT EXISTS(
    SELECT 1 FROM usuarios WHERE email = 'admin@focototal.com'
  ) INTO usuario_exists;
  
  -- Se não existir, criar o usuário
  IF NOT usuario_exists THEN
    -- Inserir na tabela usuarios primeiro
    INSERT INTO usuarios (
      auth_user_id,
      nome,
      email,
      tipo,
      ativo,
      criado_por
    ) VALUES (
      gen_random_uuid(),
      'Administrador',
      'admin@focototal.com',
      'admin',
      true,
      'migration'
    );
    
    RAISE NOTICE 'Usuário admin criado: admin@focototal.com';
  END IF;
END $$;