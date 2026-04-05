-- ========================================================================================
-- FLUXOO SOLAR — SUPER ADMIN INFRASTRUCTURE
-- 
-- PROPÓSITO: Dar ao Super Admin (dono do SaaS) acesso a MÉTRICAS AGREGADAS da plataforma.
-- 
-- REGRA DE OURO: Super Admin NUNCA vê dados individuais de tenants, projetos, usuários,
-- mensagens ou qualquer dado operacional de terceiros. Ele só vê NÚMEROS AGREGADOS.
--
-- Exemplo do que o Super Admin PODE ver:
--   ✅ "Existem 142 empresas na plataforma"
--   ✅ "O valor total dos projetos é R$ 2.500.000"
--   ✅ "30 empresas foram criadas nos últimos 30 dias"
--
-- Exemplo do que o Super Admin NUNCA pode ver:
--   ❌ "A empresa SolarTech Brasil tem o projeto X"
--   ❌ "O usuário João Silva pertence à integradora Y"
--   ❌ "A mensagem do projeto Z diz..."
-- ========================================================================================

-- ============================================================================
-- 1. FUNÇÕES SECURITY DEFINER PARA MÉTRICAS AGREGADAS
-- ============================================================================
-- Estas funções executam com permissões de serviço (bypass RLS de forma segura).
-- Elas retornam APENAS números agregados, nunca dados individuais.

-- Função: Listar tenants com paginação (Super Admin pode ver a lista de empresas)
CREATE OR REPLACE FUNCTION public.super_admin_list_tenants(
    p_page      int DEFAULT 1,
    p_limit     int DEFAULT 20,
    p_search    text DEFAULT NULL,
    p_type      text DEFAULT NULL,
    p_status    text DEFAULT NULL
)
RETURNS TABLE (
    id            uuid,
    name          text,
    fantasy_name  text,
    cnpj          text,
    phone         text,
    type          text,
    is_active     boolean,
    plan_id       uuid,
    plan_name     text,
    plan_slug     text,
    created_at    timestamptz,
    total_count   bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset int;
BEGIN
    v_offset := (p_page - 1) * p_limit;

    RETURN QUERY
    SELECT
        t.id,
        t.name,
        t.fantasy_name,
        t.cnpj,
        t.phone,
        t.type,
        t.is_active,
        t.plan_id,
        p.name as plan_name,
        p.slug as plan_slug,
        t.created_at,
        (SELECT count(*) FROM public.tenants t2
         WHERE t2.type != 'SUPER_ADMIN'
           AND (p_search IS NULL OR
                to_tsvector('simple', t2.name || ' ' || COALESCE(t2.fantasy_name, '') || ' ' || COALESCE(t2.cnpj, ''))
                @@ plainto_tsquery('simple', p_search)))::bigint as total_count
    FROM public.tenants t
    LEFT JOIN public.plans p ON p.id = t.plan_id
    WHERE t.type != 'SUPER_ADMIN'
      AND (p_search IS NULL OR
           to_tsvector('simple', t.name || ' ' || COALESCE(t.fantasy_name, '') || ' ' || COALESCE(t.cnpj, ''))
           @@ plainto_tsquery('simple', p_search))
      AND (p_type IS NULL OR t.type = p_type)
      AND (p_status IS NULL OR
           (p_status = 'active' AND t.is_active = true) OR
           (p_status = 'inactive' AND t.is_active = false) OR
           (p_status = 'suspended' AND t.is_active = false))
    ORDER BY t.created_at DESC
    LIMIT p_limit
    OFFSET v_offset;
END;
$$;

-- Função: Métricas de um tenant específico (para modal de detalhes)
CREATE OR REPLACE FUNCTION public.super_admin_tenant_details(p_tenant_id uuid)
RETURNS TABLE (
    id              uuid,
    name            text,
    fantasy_name    text,
    cnpj            text,
    phone           text,
    type            text,
    is_active       boolean,
    plan_name       text,
    plan_slug       text,
    created_at      timestamptz,
    total_projects  bigint,
    active_projects bigint,
    total_users     bigint,
    active_users    bigint,
    total_storage_mb numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.name,
        t.fantasy_name,
        t.cnpj,
        t.phone,
        t.type,
        t.is_active,
        p.name as plan_name,
        p.slug as plan_slug,
        t.created_at,
        COALESCE(proj_stats.total_projects, 0)::bigint as total_projects,
        COALESCE(proj_stats.active_projects, 0)::bigint as active_projects,
        COALESCE(user_stats.total_users, 0)::bigint as total_users,
        COALESCE(user_stats.active_users, 0)::bigint as active_users,
        COALESCE(storage_stats.total_storage_mb, 0)::numeric as total_storage_mb
    FROM public.tenants t
    LEFT JOIN public.plans p ON p.id = t.plan_id
    LEFT JOIN (
        SELECT
            owner_tenant_id,
            count(*) as total_projects,
            count(*) FILTER (WHERE status != 'ARCHIVED') as active_projects
        FROM public.projects
        WHERE owner_tenant_id = p_tenant_id
        GROUP BY owner_tenant_id
    ) proj_stats ON proj_stats.owner_tenant_id = t.id
    LEFT JOIN (
        SELECT
            tum.tenant_id,
            count(*) as total_users,
            count(*) FILTER (WHERE gu.last_sign_in_at >= NOW() - INTERVAL '30 days') as active_users
        FROM public.tenant_user_memberships tum
        JOIN public.global_users gu ON gu.id = tum.user_id
        WHERE tum.tenant_id = p_tenant_id AND tum.is_active = true
        GROUP BY tum.tenant_id
    ) user_stats ON user_stats.tenant_id = t.id
    LEFT JOIN (
        SELECT
            owner_tenant_id,
            COALESCE(sum(file_size_bytes), 0) / (1024.0 * 1024.0) as total_storage_mb
        FROM public.project_files
        WHERE owner_tenant_id = p_tenant_id
        GROUP BY owner_tenant_id
    ) storage_stats ON storage_stats.owner_tenant_id = t.id
    WHERE t.id = p_tenant_id;
END;
$$;

-- Função: Ativar/Desativar tenant (Super Admin gerencia acesso por pagamento)
CREATE OR REPLACE FUNCTION public.super_admin_toggle_tenant_status(
    p_tenant_id uuid,
    p_is_active boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result jsonb;
BEGIN
    UPDATE public.tenants
    SET is_active = p_is_active,
        updated_at = NOW()
    WHERE id = p_tenant_id AND type != 'SUPER_ADMIN';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Tenant não encontrado');
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'tenant_id', p_tenant_id,
        'is_active', p_is_active
    );
END;
$$;

-- Função: Métricas gerais da plataforma
CREATE OR REPLACE FUNCTION public.super_admin_platform_metrics()
RETURNS TABLE (
    total_tenants             bigint,
    total_tenants_active      bigint,
    total_tenants_inactive    bigint,
    total_projects            bigint,
    total_value_cents         numeric,
    total_users               bigint,
    new_tenants_last_7_days   bigint,
    new_tenants_last_30_days  bigint,
    new_tenants_last_90_days  bigint,
    new_projects_last_7_days  bigint,
    new_projects_last_30_days bigint,
    total_pending_invites     bigint,
    avg_project_value_cents   numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Tenant counts
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN')::bigint as total_tenants,
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN' AND is_active = true)::bigint as total_tenants_active,
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN' AND is_active = false)::bigint as total_tenants_inactive,
        
        -- Project counts
        (SELECT count(*) FROM public.projects)::bigint as total_projects,
        (SELECT COALESCE(sum(p.total_value_cents), 0) FROM public.projects p) as total_value_cents,
        
        -- User count
        (SELECT count(*) FROM public.global_users)::bigint as total_users,
        
        -- New tenants by period
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN' AND created_at >= NOW() - INTERVAL '7 days')::bigint as new_tenants_last_7_days,
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN' AND created_at >= NOW() - INTERVAL '30 days')::bigint as new_tenants_last_30_days,
        (SELECT count(*) FROM public.tenants WHERE type != 'SUPER_ADMIN' AND created_at >= NOW() - INTERVAL '90 days')::bigint as new_tenants_last_90_days,
        
        -- New projects by period
        (SELECT count(*) FROM public.projects WHERE created_at >= NOW() - INTERVAL '7 days')::bigint as new_projects_last_7_days,
        (SELECT count(*) FROM public.projects WHERE created_at >= NOW() - INTERVAL '30 days')::bigint as new_projects_last_30_days,
        
        -- Pending invites
        (SELECT count(*) FROM public.team_invites WHERE status = 'PENDING')::bigint as total_pending_invites,
        
        -- Average project value
        (SELECT COALESCE(avg(p.total_value_cents), 0) FROM public.projects p) as avg_project_value_cents;
END;
$$;

-- Função: Distribuição de tenants por tipo (apenas contagens)
CREATE OR REPLACE FUNCTION public.super_admin_tenants_by_type()
RETURNS TABLE (
    tenant_type text,
    total       bigint,
    active      bigint,
    inactive    bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.type::text as tenant_type,
        count(*)::bigint as total,
        count(*) FILTER (WHERE t.is_active = true)::bigint as active,
        count(*) FILTER (WHERE t.is_active = false)::bigint as inactive
    FROM public.tenants t
    WHERE t.type != 'SUPER_ADMIN'
    GROUP BY t.type
    ORDER BY total DESC;
END;
$$;

-- Função: Top N tenants por valor de projetos (sem expor nomes, só tipo e valor)
-- O Super Admin vê "Integradora: R$ 500.000 em projetos" sem saber QUAL integradora
CREATE OR REPLACE FUNCTION public.super_admin_value_by_type()
RETURNS TABLE (
    tenant_type      text,
    total_value      numeric,
    project_count    bigint,
    avg_value        numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.type::text as tenant_type,
        COALESCE(sum(p.total_value_cents), 0) as total_value,
        count(p.id)::bigint as project_count,
        CASE 
            WHEN count(p.id) > 0 THEN COALESCE(avg(p.total_value_cents), 0)
            ELSE 0
        END as avg_value
    FROM public.tenants t
    LEFT JOIN public.projects p ON p.owner_tenant_id = t.id
    WHERE t.type != 'SUPER_ADMIN'
    GROUP BY t.type
    ORDER BY total_value DESC;
END;
$$;

-- Função: Atividade da plataforma (tenants criados por mês)
CREATE OR REPLACE FUNCTION public.super_admin_monthly_activity(
    p_months int DEFAULT 12
)
RETURNS TABLE (
    month           date,
    new_tenants     bigint,
    active_tenants  bigint,
    new_projects    bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        month_series.month::date,
        COALESCE(tenant_counts.count, 0)::bigint as new_tenants,
        COALESCE(active_counts.count, 0)::bigint as active_tenants,
        COALESCE(project_counts.count, 0)::bigint as new_projects
    FROM generate_series(
        date_trunc('month', NOW()) - (p_months || ' months')::interval,
        date_trunc('month', NOW()),
        '1 month'::interval
    ) month_series(month)
    LEFT JOIN (
        SELECT date_trunc('month', created_at)::date as month, count(*)::bigint as count
        FROM public.tenants WHERE type != 'SUPER_ADMIN'
        GROUP BY 1
    ) tenant_counts ON tenant_counts.month = month_series.month
    LEFT JOIN (
        SELECT date_trunc('month', created_at)::date as month, count(*)::bigint as count
        FROM public.tenants WHERE type != 'SUPER_ADMIN' AND is_active = true
        GROUP BY 1
    ) active_counts ON active_counts.month = month_series.month
    LEFT JOIN (
        SELECT date_trunc('month', created_at)::date as month, count(*)::bigint as count
        FROM public.projects
        GROUP BY 1
    ) project_counts ON project_counts.month = month_series.month
    ORDER BY month_series.month DESC;
END;
$$;

-- Função: Alertas agregados do sistema
CREATE OR REPLACE FUNCTION public.super_admin_system_alerts()
RETURNS TABLE (
    severity    text,
    category    text,
    title       text,
    description text,
    metric_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- Inactive tenants
    SELECT 
        'rose'::text as severity,
        'tenants'::text as category,
        'Empresas Inativas'::text as title,
        format('%s empresas estão com status inativo', count(*))::text as description,
        count(*)::numeric as metric_value
    FROM public.tenants
    WHERE is_active = false AND type != 'SUPER_ADMIN'
    HAVING count(*) > 0

    UNION ALL

    -- Pending invites
    SELECT 
        'amber'::text as severity,
        'invites'::text as category,
        'Convites Pendentes'::text as title,
        format('%s convites de equipe aguardando resposta', count(*))::text as description,
        count(*)::numeric as metric_value
    FROM public.team_invites
    WHERE status = 'PENDING'
    HAVING count(*) > 0

    UNION ALL

    -- Projects without value
    SELECT 
        'amber'::text as severity,
        'projects'::text as category,
        'Projetos sem Valor'::text as title,
        format('%s projetos possuem valor total zerado', count(*))::text as description,
        count(*)::numeric as metric_value
    FROM public.projects
    WHERE total_value_cents = 0 OR total_value_cents IS NULL
    HAVING count(*) > 0;
END;
$$;

-- ============================================================================
-- 2. GRANTS — Todos os usuários autenticados podem chamar as funções
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.super_admin_toggle_tenant_status(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_toggle_tenant_status(uuid, boolean) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_list_tenants(int, int, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_list_tenants(int, int, text, text, text) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_tenant_details(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_tenant_details(uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_platform_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_platform_metrics() TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_tenants_by_type() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_tenants_by_type() TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_value_by_type() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_value_by_type() TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_monthly_activity(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_monthly_activity(int) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_system_alerts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_system_alerts() TO service_role;

-- ============================================================================
-- 3. VIEW AGREGADA (compatibilidade com código existente)
-- ============================================================================
-- DROP com CASCADE para remover qualquer dependência
DROP VIEW IF EXISTS public.platform_metrics_view CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.platform_metrics_view CASCADE;

-- Recria com as colunas da função agregada
CREATE VIEW public.platform_metrics_view AS
SELECT * FROM public.super_admin_platform_metrics();

GRANT SELECT ON public.platform_metrics_view TO authenticated;
GRANT SELECT ON public.platform_metrics_view TO service_role;
