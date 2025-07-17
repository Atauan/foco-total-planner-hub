-- Criar usuário admin no sistema de autenticação
-- Primeiro, inserir na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@focototal.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"nome":"Administrador","tipo":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Depois, atualizar a tabela usuarios com o auth_user_id
UPDATE usuarios 
SET auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@focototal.com'
)
WHERE email = 'admin@focototal.com';