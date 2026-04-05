-- =====================================================
-- FLUXOO SOLAR — POLÍTICAS RLS PARA TENANTS E MEMBERSHIPS
-- PROPÓSITO: Permitir que usuários leiam seus próprios
-- vínculos e dados dos tenants que pertencem
-- =====================================================

-- =====================================================
-- 1. TENANT_USER_MEMBERSHIPS
-- =====================================================

-- Remover políticas existentes (limpeza)
DROP POLICY IF EXISTS "users_can_view_own_memberships" ON public.tenant_user_memberships;
DROP POLICY IF EXISTS "users_can_select_own_memberships" ON public.tenant_user_memberships;

-- Política: Usuário pode VER seus próprios vínculos
CREATE POLICY "users_can_view_own_memberships"
ON public.tenant_user_memberships
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- =====================================================
-- 2. TENANTS
-- =====================================================

-- Remover políticas existentes (limpeza)
DROP POLICY IF EXISTS "users_can_view_their_tenants" ON public.tenants;
DROP POLICY IF EXISTS "users_can_select_their_tenants" ON public.tenants;

-- Política: Usuário pode VER tenants onde ele tem vínculo ativo
CREATE POLICY "users_can_view_their_tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT tenant_id
    FROM public.tenant_user_memberships
    WHERE user_id = auth.uid()
      AND is_active = true
  )
);

-- =====================================================
-- 3. GARANTIR PERMISSÕES
-- =====================================================

-- Garantir que authenticated possa fazer SELECT
GRANT SELECT ON public.tenant_user_memberships TO authenticated;
GRANT SELECT ON public.tenants TO authenticated;

-- =====================================================
-- 4. TESTE (descomente para rodar manualmente)
-- =====================================================

-- Simular consulta como usuário autenticado
-- SET request.jwt.claims = '{"sub": "949b2a03-a8ce-4b12-a284-25524e8f5de6"}';
-- SELECT * FROM public.tenant_user_memberships WHERE user_id = auth.uid();
-- SELECT t.* FROM public.tenants t INNER JOIN public.tenant_user_memberships tum ON t.id = tum.tenant_id WHERE tum.user_id = auth.uid();
