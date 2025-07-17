-- Remover a política problemática
DROP POLICY IF EXISTS "usuarios_admin_all" ON public.usuarios;

-- Criar função security definer para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o email é do admin principal
  IF (auth.jwt() ->> 'email') = 'admin@focototal.com' THEN
    RETURN true;
  END IF;
  
  -- Verificar se o usuário tem tipo admin na tabela usuarios
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE auth_user_id = auth.uid() 
    AND tipo = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar nova política usando a função
CREATE POLICY "usuarios_admin_all" 
ON public.usuarios 
FOR ALL 
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());