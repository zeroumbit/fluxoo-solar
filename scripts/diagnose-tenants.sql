-- =====================================================
-- SCRIPT DE DIAGNÓSTICO - FLUXOO SOLAR
-- Verifica se os tenants e memberships existem
-- =====================================================

-- 1. Verificar se os TENANTS existem
SELECT 
  id,
  name,
  fantasy_name,
  type,
  is_active,
  created_at
FROM tenants
WHERE id IN (
  '949b2a03-a8ce-4b12-a284-25524e8f5de6',  -- Integradora
  'c489a979-bc56-453b-91bf-464e6908e38f'   -- Engenharia
);

-- 2. Verificar se os USUÁRIOS (auth.users) existem
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email IN (
  'commercedez@gmail.com',
  'jossergiod@gmail.com'
);

-- 3. Verificar os VÍNCULOS (tenant_user_memberships)
SELECT 
  tum.user_id,
  tum.tenant_id,
  tum.role,
  tum.is_active,
  t.name as tenant_name,
  t.type as tenant_type,
  u.email as user_email
FROM tenant_user_memberships tum
INNER JOIN tenants t ON tum.tenant_id = t.id
INNER JOIN auth.users u ON tum.user_id = u.id
WHERE tum.tenant_id IN (
  '949b2a03-a8ce-4b12-a284-25524e8f5de6',  -- Integradora
  'c489a979-bc56-453b-91bf-464e6908e38f'   -- Engenharia
)
OR tum.user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'commercedez@gmail.com',
    'jossergiod@gmail.com'
  )
);

-- =====================================================
-- SE OS TENANTS NÃO EXISTIREM, USE ESTE SCRIPT PARA CRIAR:
-- =====================================================

-- INSERT INTO tenants (id, name, fantasy_name, type, is_active)
-- VALUES 
--   ('949b2a03-a8ce-4b12-a284-25524e8f5de6', 'Commercedez Energia', 'Commercedez', 'INTEGRATOR', true),
--   ('c489a979-bc56-453b-91bf-464e6908e38f', 'Jossergio Engenharia', 'JS Engenharia', 'ENGINEERING_FIRM', true);

-- =====================================================
-- SE OS VÍNCULOS NÃO EXISTIREM, USE ESTE SCRIPT:
-- =====================================================

-- Primeiro, descubra os UIDs dos usuários:
-- SELECT id, email FROM auth.users WHERE email IN ('commercedez@gmail.com', 'jossergiod@gmail.com');

-- Depois crie os vínculos (substitua os UIDs corretos):
-- INSERT INTO tenant_user_memberships (user_id, tenant_id, role, is_active)
-- VALUES 
--   ('UID_DO_USUARIO_COMMERCEDEZ', '949b2a03-a8ce-4b12-a284-25524e8f5de6', 'OWNER', true),
--   ('UID_DO_USUARIO_JOSSERGIO', 'c489a979-bc56-453b-91bf-464e6908e38f', 'OWNER', true);
