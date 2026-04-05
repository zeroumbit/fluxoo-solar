-- ========================================================================================
-- FLUXOO SOLAR — HARDENING SQL (REGRA 1)
-- 
-- PROPÓSITO: Impedir que o Super Admin acesse dados individuais de tenants.
-- 
-- O Super Admin (dono do SaaS) NUNCA deve ver:
--   ❌ Projetos individuais de tenants
--   ❌ Dados PII de usuários de tenants
--   ❌ Mensagens de timelines de projetos
--
-- O Super Admin SÓ vê métricas AGREGADAS via funções SECURITY DEFINER:
--   ✅ super_admin_platform_metrics()
--   ✅ super_admin_tenants_by_type()
--   ✅ super_admin_finance_metrics()
--   ✅ super_admin_revenue_by_plan()
--   ✅ super_admin_system_alerts()
--   ✅ super_admin_monthly_activity()
--   ✅ super_admin_value_by_type()
--
-- Veja: supabase/super-admin.sql (funções agregadas)
--       supabase/plans-and-invoices.sql (tabelas de planos e faturas)
-- ========================================================================================

-- 1. Remover polices existentes de SELECT livre se houver
DROP POLICY IF EXISTS "super_admin_cannot_select_projects" ON public.projects;
DROP POLICY IF EXISTS "super_admin_cannot_select_users" ON public.global_users;
DROP POLICY IF EXISTS "super_admin_cannot_select_messages" ON public.project_messages;

-- 2. Regra: Super Admin NUNCA vê dados individuais de projetos
-- Bloqueia SELECT se o usuário ativo pertencer ao tenant 'SUPER_ADMIN'
CREATE POLICY "super_admin_cannot_select_projects"
ON public.projects
FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1
    FROM public.tenant_user_memberships tum
    JOIN public.tenants t ON t.id = tum.tenant_id
    WHERE tum.user_id = auth.uid()
      AND t.type = 'SUPER_ADMIN'
  )
);

-- 3. Regra: Super Admin NUNCA vê PII de usuários (global_users)
CREATE POLICY "super_admin_cannot_select_users"
ON public.global_users
FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1
    FROM public.tenant_user_memberships tum
    JOIN public.tenants t ON t.id = tum.tenant_id
    WHERE tum.user_id = auth.uid()
      AND t.type = 'SUPER_ADMIN'
  )
);

-- 4. Regra: Super Admin NUNCA vê mensagens de timeline
CREATE POLICY "super_admin_cannot_select_messages"
ON public.project_messages
FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1
    FROM public.tenant_user_memberships tum
    JOIN public.tenants t ON t.id = tum.tenant_id
    WHERE tum.user_id = auth.uid()
      AND t.type = 'SUPER_ADMIN'
  )
);

-- 5. View Agregada para o Super Admin (Métricas de Plataforma)
-- Esta view deve ser acessível ao Super Admin via Grant
-- Nota: A definição completa foi movida para super-admin.sql (funções SECURITY DEFINER).
-- Esta definição mantém compatibilidade caso hardening.sql seja executado primeiro.
DROP VIEW IF EXISTS public.platform_metrics_view CASCADE;
CREATE VIEW public.platform_metrics_view AS
SELECT
    (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN') as total_tenants,
    (SELECT count(*) FROM public.projects) as total_projects,
    (SELECT sum(total_value_cents) FROM public.projects) as total_value_cents_global,
    (SELECT count(*) FROM public.global_users) as total_users;

-- 6. Grant de acesso à View
GRANT SELECT ON public.platform_metrics_view TO authenticated;
GRANT SELECT ON public.platform_metrics_view TO service_role;
