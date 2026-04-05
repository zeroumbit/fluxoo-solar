-- =====================================================
-- SCRIPT: Verificar políticas RLS nas tabelas
-- Rode no Supabase SQL Editor
-- =====================================================

-- 1. Verificar RLS na tabela tenant_user_memberships
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'tenant_user_memberships';

-- 2. Verificar RLS na tabela tenants
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'tenants';

-- 3. Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('tenant_user_memberships', 'tenants');
