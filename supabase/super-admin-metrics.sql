-- ========================================================================================
-- FLUXOO SOLAR — SUPER ADMIN METRICS (NOVAS FUNÇÕES RPC)
--
-- PROPÓSITO: Adicionar funções RPC para a página /super-admin/metrics
-- Estas funções fornecem dados reais para:
--   - Evolução de tenants no tempo
--   - Métricas de churn (cancelamentos)
--   - Top uso de armazenamento
--   - Faturas vencidas (inadimplência)
--
-- PARA APLICAR: Execute este arquivo no SQL Editor do Supabase Dashboard
-- OU via CLI: supabase db push
-- ========================================================================================

-- Função: Top tenants por uso de armazenamento (para alertas de capacidade)
CREATE OR REPLACE FUNCTION public.super_admin_top_storage_usage(
    p_limit int DEFAULT 5
)
RETURNS TABLE (
    tenant_id       uuid,
    tenant_name     text,
    fantasy_name    text,
    tenant_type     text,
    total_storage_mb numeric,
    plan_max_mb     integer,
    usage_percent   numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id as tenant_id,
        t.name as tenant_name,
        t.fantasy_name,
        t.type as tenant_type,
        COALESCE(storage_stats.total_storage_mb, 0) as total_storage_mb,
        p.max_storage_mb as plan_max_mb,
        CASE
            WHEN p.max_storage_mb > 0 THEN
                ROUND((COALESCE(storage_stats.total_storage_mb, 0) / p.max_storage_mb) * 100, 1)
            ELSE 0
        END as usage_percent
    FROM public.tenants t
    LEFT JOIN public.plans p ON p.id = t.plan_id
    LEFT JOIN (
        SELECT
            owner_tenant_id,
            COALESCE(sum(file_size_bytes), 0) / (1024.0 * 1024.0) as total_storage_mb
        FROM public.project_files
        GROUP BY owner_tenant_id
    ) storage_stats ON storage_stats.owner_tenant_id = t.id
    WHERE t.type != 'SUPER_ADMIN' AND t.is_active = true
    ORDER BY usage_percent DESC
    LIMIT p_limit;
END;
$$;

-- Função: Faturas vencidas não pagas (inadimplência)
CREATE OR REPLACE FUNCTION public.super_admin_overdue_invoices(
    p_limit int DEFAULT 10
)
RETURNS TABLE (
    tenant_name     text,
    fantasy_name    text,
    days_overdue    bigint,
    amount_cents    integer,
    due_date        date,
    plan_name       text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.name as tenant_name,
        t.fantasy_name,
        EXTRACT(DAY FROM NOW() - i.due_date)::bigint as days_overdue,
        i.total_cents as amount_cents,
        i.due_date,
        p.name as plan_name
    FROM public.invoices i
    JOIN public.tenants t ON t.id = i.tenant_id
    JOIN public.plans p ON p.id = i.plan_id
    WHERE i.status IN ('OVERDUE', 'PENDING')
      AND i.due_date < NOW()
      AND t.type != 'SUPER_ADMIN'
    ORDER BY i.due_date ASC
    LIMIT p_limit;
END;
$$;

-- Função: Métricas de churn (cancelamentos)
CREATE OR REPLACE FUNCTION public.super_admin_churn_metrics()
RETURNS TABLE (
    total_churned_tenants     bigint,
    churn_rate_percent        numeric,
    recovered_tenants         bigint,
    monthly_churn_rate        numeric,
    avg_lifetime_months       numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_tenants bigint;
    v_active_tenants bigint;
    v_inactive_tenants bigint;
BEGIN
    -- Contar tenants ativos e inativos
    SELECT
        count(*) FILTER (WHERE type != 'SUPER_ADMIN'),
        count(*) FILTER (WHERE type != 'SUPER_ADMIN' AND is_active = true),
        count(*) FILTER (WHERE type != 'SUPER_ADMIN' AND is_active = false)
    INTO v_total_tenants, v_active_tenants, v_inactive_tenants
    FROM public.tenants;

    -- Calcular churn rate
    -- Churn rate = (tenants inativos / total de tenants que já existiram) * 100
    -- Total que já existiram = ativos + inativos
    RETURN QUERY
    SELECT
        v_inactive_tenants as total_churned_tenants,
        CASE
            WHEN v_total_tenants > 0 THEN
                ROUND((v_inactive_tenants::numeric / v_total_tenants) * 100, 1)
            ELSE 0
        END as churn_rate_percent,
        -- Recuperados: tenants que foram reativados (is_active = true mas tiveram faturas canceladas)
        COALESCE((
            SELECT count(DISTINCT t.id)
            FROM public.tenants t
            WHERE t.is_active = true
              AND t.type != 'SUPER_ADMIN'
              AND EXISTS (
                  SELECT 1 FROM public.invoices i
                  WHERE i.tenant_id = t.id AND i.status = 'CANCELLED'
              )
        ), 0) as recovered_tenants,
        -- Monthly churn rate (simplificado: inativos nos últimos 30 dias / ativos no início do período)
        CASE
            WHEN v_active_tenants > 0 THEN
                ROUND((
                    (SELECT count(*) FROM public.tenants
                     WHERE type != 'SUPER_ADMIN' AND is_active = false
                     AND updated_at >= NOW() - INTERVAL '30 days')::numeric /
                    v_active_tenants
                ) * 100, 1)
            ELSE 0
        END as monthly_churn_rate,
        -- Average lifetime (tempo médio de vida dos tenants inativos)
        COALESCE((
            SELECT avg(EXTRACT(DAY FROM (updated_at - created_at)) / 30.0)
            FROM public.tenants
            WHERE type != 'SUPER_ADMIN' AND is_active = false AND updated_at IS NOT NULL
        ), 0) as avg_lifetime_months;
END;
$$;

-- Função: Atividade mensal de projetos e tenants (para gráfico de evolução)
CREATE OR REPLACE FUNCTION public.super_admin_tenant_evolution(
    p_months int DEFAULT 6
)
RETURNS TABLE (
    month           date,
    new_tenants     bigint,
    active_tenants  bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        month_series.month::date,
        COALESCE(new_counts.count, 0)::bigint as new_tenants,
        COALESCE(active_counts.count, 0)::bigint as active_tenants
    FROM generate_series(
        date_trunc('month', NOW()) - ((p_months - 1) || ' months')::interval,
        date_trunc('month', NOW()),
        '1 month'::interval
    ) month_series(month)
    LEFT JOIN (
        SELECT date_trunc('month', created_at)::date as month, count(*)::bigint as count
        FROM public.tenants WHERE type != 'SUPER_ADMIN'
        GROUP BY 1
    ) new_counts ON new_counts.month = month_series.month
    LEFT JOIN (
        SELECT date_trunc('month', created_at)::date as month, count(*) FILTER (WHERE is_active = true)::bigint as count
        FROM public.tenants WHERE type != 'SUPER_ADMIN'
        GROUP BY 1
    ) active_counts ON active_counts.month = month_series.month
    ORDER BY month_series.month ASC;
END;
$$;

-- ============================================================================
-- GRANTS — Todos os usuários autenticados podem chamar as funções
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.super_admin_top_storage_usage(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_top_storage_usage(int) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_overdue_invoices(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_overdue_invoices(int) TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_churn_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_churn_metrics() TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_tenant_evolution(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_tenant_evolution(int) TO service_role;
