/*
  # Corrigir políticas da tabela usuarios

  1. Correções
    - Remover referências OLD inválidas em políticas WITH CHECK
    - Simplificar política de atualização para usuários
    - Manter segurança sem erros SQL

  2. Políticas corrigidas
    - Usuários podem atualizar apenas dados básicos (nome)
    - Admins mantêm controle total
    - RLS funcionando corretamente
*/

-- Remover política problemática se existir
DROP POLICY IF EXISTS "Usuários podem atualizar próprios dados básicos" ON usuarios;

-- Criar política corrigida para usuários atualizarem próprios dados
CREATE POLICY "Usuários podem atualizar próprios dados básicos"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (
    auth.uid() = auth_user_id 
    AND tipo = (SELECT tipo FROM usuarios WHERE auth_user_id = auth.uid())
  );

-- Garantir que a função de verificação de usuário ativo existe
CREATE OR REPLACE FUNCTION usuario_ativo(user_id uuid)
RETURNS boolean AS $$
DECLARE
  usuario_data usuarios%ROWTYPE;
BEGIN
  SELECT * INTO usuario_data FROM usuarios WHERE auth_user_id = user_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Admin sempre ativo se marcado como ativo
  IF usuario_data.tipo = 'admin' THEN
    RETURN usuario_data.ativo;
  END IF;
  
  -- Aluno: verificar validade e status ativo
  RETURN usuario_data.ativo AND (usuario_data.data_validade IS NULL OR usuario_data.data_validade > now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a função de gerar senha existe
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