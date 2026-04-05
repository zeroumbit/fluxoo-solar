-- ========================================================================================
-- FLUXOO SOLAR — PLANS & INVOICES
-- 
-- Tabela `plans`: Planos de assinatura da plataforma (gerenciado pelo Super Admin)
-- Tabela `invoices`: Faturas dos tenants (gerado automaticamente, usado para métricas)
-- ========================================================================================

-- ============================================================================
-- 1. TABELA `plans`
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.plans (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                text NOT NULL,                    -- Nome do plano (ex: "Starter", "Pro", "Enterprise")
    slug                text UNIQUE NOT NULL,             -- Identificador URL-friendly (ex: "starter", "pro")
    description         text,                             -- Descrição do plano
    price_cents         integer NOT NULL DEFAULT 0,       -- Preço mensal em centavos
    setup_fee_cents     integer NOT NULL DEFAULT 0,       -- Taxa de setup (uma vez)
    currency            text NOT NULL DEFAULT 'BRL',
    
    -- Limites
    max_users           integer NOT NULL DEFAULT 5,       -- Máximo de usuários
    max_projects        integer NOT NULL DEFAULT 10,      -- Máximo de projetos
    max_storage_mb      integer NOT NULL DEFAULT 500,     -- Máximo de storage em MB
    
    -- Preços extras
    extra_user_price_cents   integer NOT NULL DEFAULT 0,  -- Preço por usuário extra
    extra_project_price_cents integer NOT NULL DEFAULT 0, -- Preço por projeto extra
    
    -- Público-alvo do plano
    target_type         text CHECK (target_type IN ('INTEGRATOR', 'ENGINEERING_FIRM', 'RESELLER', 'ANY')),
    
    -- Features (JSON array de strings)
    features            jsonb NOT NULL DEFAULT '[]'::jsonb,
    
    -- Status
    is_active           boolean NOT NULL DEFAULT true,
    is_featured         boolean NOT NULL DEFAULT false,   -- Destaque na página de preços
    
    -- Ordenação (para exibição)
    sort_order          integer NOT NULL DEFAULT 0,
    
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

-- Índice para busca rápida por slug
CREATE INDEX IF NOT EXISTS idx_plans_slug ON public.plans(slug);
CREATE INDEX IF NOT EXISTS idx_plans_active ON public.plans(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plans_target ON public.plans(target_type) WHERE target_type IS NOT NULL;

-- RLS na tabela plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Política: Plans são leitura pública (qualquer usuário autenticado pode ver planos ativos)
CREATE POLICY "plans_select_active"
ON public.plans
FOR SELECT
USING (is_active = true OR auth.role() = 'service_role');

-- Política: Apenas service_role pode INSERT/UPDATE/DELETE (via API com service key)
CREATE POLICY "plans_service_role_all"
ON public.plans
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 2. TABELA `invoices`
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           uuid NOT NULL REFERENCES public.tenants(id) ON DELETE RESTRICT,
    plan_id             uuid NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    billing_period_start date NOT NULL,                 -- Início do período cobrado
    billing_period_end   date NOT NULL,                 -- Fim do período cobrado
    
    -- Valores
    plan_price_cents        integer NOT NULL DEFAULT 0,
    extra_users_count       integer NOT NULL DEFAULT 0,
    extra_users_price_cents integer NOT NULL DEFAULT 0,
    extra_projects_count    integer NOT NULL DEFAULT 0,
    extra_projects_price_cents integer NOT NULL DEFAULT 0,
    discount_cents          integer NOT NULL DEFAULT 0,
    total_cents             integer NOT NULL DEFAULT 0,  -- Valor final
    
    -- Status
    status              text NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED')),
    
    -- Pagamento
    paid_at             timestamptz,
    due_date            date NOT NULL,
    payment_method      text,                           -- "pix", "boleto", "credit_card"
    payment_gateway_id  text,                           -- ID no gateway de pagamento (Stripe, etc)
    
    -- Metadados
    notes               text,
    metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
    
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_billing_period ON public.invoices(billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_invoices_overdue ON public.invoices(status, due_date) WHERE status = 'PENDING';

-- RLS na tabela invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Política: Tenants veem apenas suas próprias invoices
CREATE POLICY "invoices_select_own"
ON public.invoices
FOR SELECT
USING (
    tenant_id IN (
        SELECT tum.tenant_id
        FROM public.tenant_user_memberships tum
        WHERE tum.user_id = auth.uid()
          AND tum.is_active = true
    )
    OR auth.role() = 'service_role'
);

-- Política: service_role pode tudo
CREATE POLICY "invoices_service_role_all"
ON public.invoices
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Trigger updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. FUNÇÕES AGREGADAS ADICIONAIS PARA SUPER ADMIN
-- ============================================================================

-- Função: Métricas financeiras agregadas (Super Admin só vê totais)
CREATE OR REPLACE FUNCTION public.super_admin_finance_metrics()
RETURNS TABLE (
    total_mrr_cents           numeric,       -- Monthly Recurring Revenue
    total_arr_cents           numeric,       -- Annual Recurring Revenue
    total_invoices            bigint,
    paid_invoices             bigint,
    pending_invoices          bigint,
    overdue_invoices          bigint,
    total_revenue_cents       numeric,       -- Receita total (pagas)
    avg_invoice_cents         numeric,
    tenants_with_overdue      bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- MRR: soma dos preços dos planos ativos * tenants ativos com plano
        COALESCE((
            SELECT sum(p.price_cents)
            FROM public.plans p
            JOIN public.tenants t ON t.plan_id = p.id
            WHERE t.is_active = true AND p.is_active = true
        ), 0) as total_mrr_cents,
        
        -- ARR = MRR * 12
        COALESCE((
            SELECT sum(p.price_cents) * 12
            FROM public.plans p
            JOIN public.tenants t ON t.plan_id = p.id
            WHERE t.is_active = true AND p.is_active = true
        ), 0) as total_arr_cents,
        
        -- Invoice counts
        (SELECT count(*) FROM public.invoices)::bigint as total_invoices,
        (SELECT count(*) FROM public.invoices WHERE status = 'PAID')::bigint as paid_invoices,
        (SELECT count(*) FROM public.invoices WHERE status = 'PENDING')::bigint as pending_invoices,
        (SELECT count(*) FROM public.invoices WHERE status = 'OVERDUE')::bigint as overdue_invoices,
        
        -- Revenue (paid invoices only)
        COALESCE((SELECT sum(total_cents) FROM public.invoices WHERE status = 'PAID'), 0) as total_revenue_cents,
        
        -- Average invoice value
        COALESCE((SELECT avg(total_cents) FROM public.invoices WHERE status = 'PAID'), 0) as avg_invoice_cents,
        
        -- Tenants with overdue invoices
        (SELECT count(DISTINCT tenant_id) FROM public.invoices WHERE status = 'OVERDUE')::bigint as tenants_with_overdue;
END;
$$;

-- Função: Distribuição de receita por plano (apenas agregados)
CREATE OR REPLACE FUNCTION public.super_admin_revenue_by_plan()
RETURNS TABLE (
    plan_name       text,
    plan_slug       text,
    active_tenants  bigint,
    mrr_cents       numeric,
    total_revenue_cents numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.name::text as plan_name,
        p.slug::text as plan_slug,
        count(DISTINCT t.id) FILTER (WHERE t.is_active = true)::bigint as active_tenants,
        COALESCE(sum(p.price_cents) FILTER (WHERE t.is_active = true), 0) as mrr_cents,
        COALESCE((
            SELECT sum(i.total_cents)
            FROM public.invoices i
            WHERE i.plan_id = p.id AND i.status = 'PAID'
        ), 0) as total_revenue_cents
    FROM public.plans p
    LEFT JOIN public.tenants t ON t.plan_id = p.id
    WHERE p.is_active = true
    GROUP BY p.id, p.name, p.slug
    ORDER BY mrr_cents DESC;
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public.super_admin_finance_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_finance_metrics() TO service_role;

GRANT EXECUTE ON FUNCTION public.super_admin_revenue_by_plan() TO authenticated;
GRANT EXECUTE ON FUNCTION public.super_admin_revenue_by_plan() TO service_role;

-- ============================================================================
-- 4. SEED: Planos iniciais
-- ============================================================================
INSERT INTO public.plans (name, slug, description, price_cents, max_users, max_projects, max_storage_mb, target_type, features, sort_order, is_featured)
VALUES
    ('Starter', 'starter', 'Ideal para integradores iniciando no Fluxoo Solar.', 9900, 3, 5, 1000, 'INTEGRATOR', 
     '["Projeto ilimitado", "3 usuários", "1GB Storage", "Suporte por email"]'::jsonb, 1, true),
    ('Professional', 'professional', 'Para equipes em crescimento com demandas avançadas.', 29900, 10, 25, 5000, 'INTEGRATOR',
     '["Até 10 usuários", "25 projetos", "5GB Storage", "Suporte prioritário", "API access"]'::jsonb, 2, true),
    ('Enterprise', 'enterprise', 'Solução completa para grandes operações.', 79900, 50, 100, 20000, 'INTEGRATOR',
     '["50 usuários", "100 projetos", "20GB Storage", "Suporte 24/7", "API ilimitado", "White label"]'::jsonb, 3, true),
    ('Engineering Basic', 'engineering-basic', 'Para escritórios de engenharia.', 14900, 5, 20, 2000, 'ENGINEERING_FIRM',
     '["5 usuários", "20 projetos", "2GB Storage", "Suporte por email"]'::jsonb, 4, false),
    ('Engineering Pro', 'engineering-pro', 'Escritórios de engenharia com alto volume.', 39900, 15, 50, 10000, 'ENGINEERING_FIRM',
     '["15 usuários", "50 projetos", "10GB Storage", "Suporte prioritário", "API access"]'::jsonb, 5, false),
    ('Reseller Starter', 'reseller-starter', 'Comece a revender o Fluxoo Solar.', 4900, 2, 10, 500, 'RESELLER',
     '["2 usuários", "10 clientes", "500MB Storage", "Suporte por email"]'::jsonb, 6, false),
    ('Reseller Pro', 'reseller-pro', 'Revenda em escala.', 19900, 10, 50, 5000, 'RESELLER',
     '["10 usuários", "50 clientes", "5GB Storage", "Suporte prioritário", "Comissão especial"]'::jsonb, 7, false)
ON CONFLICT (slug) DO NOTHING;
