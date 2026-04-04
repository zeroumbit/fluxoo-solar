-- ========================================================================================
-- FLUXOO SOLAR — HARDENING SQL (REGRA 1)
-- Implementação de RLS para SUPER_ADMIN e Isolamento de Dados Sensíveis
-- ========================================================================================

-- 1. Remover polices existentes de SELECT livre se houver
DROP POLICY IF EXISTS "super_admin_cannot_select_projects" ON public.projects;

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
CREATE OR REPLACE VIEW public.platform_metrics_view AS
SELECT 
    (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN') as total_tenants,
    (SELECT count(*) FROM public.projects) as total_projects,
    (SELECT sum(total_value_cents) FROM public.projects) as total_value_cents_global,
    (SELECT count(*) FROM public.global_users) as total_users;

-- 6. Grant de acesso à View
GRANT SELECT ON public.platform_metrics_view TO authenticated;
GRANT SELECT ON public.platform_metrics_view TO service_role;
