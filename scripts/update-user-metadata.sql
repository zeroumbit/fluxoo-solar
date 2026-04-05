-- =====================================================
-- FLUXOO SOLAR — ATUALIZAR METADADOS DOS USUÁRIOS
-- PROPÓSITO: Garantir que os usuários tenham os
-- metadados corretos para redirecionamento automático
-- =====================================================

-- Atualizar metadados do usuário Integradora (commercedez@gmail.com)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_tenant_id}',
  '"abfde19a-cd72-4f56-86c0-da940a91db82"'::jsonb
)
WHERE email = 'commercedez@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_tenant_type}',
  '"INTEGRATOR"'::jsonb
)
WHERE email = 'commercedez@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_role}',
  '"OWNER"'::jsonb
)
WHERE email = 'commercedez@gmail.com';

-- Atualizar metadados do usuário Engenharia (jossergiod@gmail.com)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_tenant_id}',
  '"7e27a8d9-d02c-454d-828f-f7a1196e745b"'::jsonb
)
WHERE email = 'jossergiod@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_tenant_type}',
  '"ENGINEERING_FIRM"'::jsonb
)
WHERE email = 'jossergiod@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{active_role}',
  '"OWNER"'::jsonb
)
WHERE email = 'jossergiod@gmail.com';

-- Verificar se atualizou corretamente
SELECT 
  id,
  email,
  raw_user_meta_data->>'active_tenant_id' as active_tenant_id,
  raw_user_meta_data->>'active_tenant_type' as active_tenant_type,
  raw_user_meta_data->>'active_role' as active_role
FROM auth.users
WHERE email IN ('commercedez@gmail.com', 'jossergiod@gmail.com');
