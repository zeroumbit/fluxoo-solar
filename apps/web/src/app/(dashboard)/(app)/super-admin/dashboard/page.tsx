import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Briefcase, DollarSign, TrendingUp, Users, AlertCircle, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

const severityColors: Record<string, string> = {
  rose: 'bg-rose-100 text-rose-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
}

const typeLabels: Record<string, string> = {
  'INTEGRATOR': 'Integradora',
  'ENGINEERING_FIRM': 'Engenharia',
  'RESELLER': 'Revenda',
}

function formatCurrency(cents: number | string) {
  const value = typeof cents === 'string' ? parseFloat(cents) : cents
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100)
}

function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  return num.toLocaleString('pt-BR')
}

export default async function SuperAdminDashboard() {
  const supabase = await createClient()

  // =====================================================
  // TODAS as consultas usam FUNÇÕES AGREGADAS (SECURITY DEFINER).
  // NUNCA acessamos tabelas diretamente — o Super Admin só
  // vê números totais, nunca dados individuais de tenants.
  // =====================================================

  // 1. Métricas gerais da plataforma
  const { data: platformMetrics } = await supabase
    .rpc('super_admin_platform_metrics')

  // 2. Distribuição por tipo de tenant
  const { data: tenantsByType } = await supabase
    .rpc('super_admin_tenants_by_type')

  // 3. Métricas financeiras
  const { data: financeMetrics } = await supabase
    .rpc('super_admin_finance_metrics')

  // 4. Receita por plano
  const { data: revenueByPlan } = await supabase
    .rpc('super_admin_revenue_by_plan')

  // 5. Alertas do sistema
  const { data: alerts } = await supabase
    .rpc('super_admin_system_alerts')

  // Valores derivados
  const totalTenants = platformMetrics?.total_tenants ?? 0
  const totalTenantsActive = platformMetrics?.total_tenants_active ?? 0
  const totalTenantsInactive = platformMetrics?.total_tenants_inactive ?? 0
  const totalProjects = platformMetrics?.total_projects ?? 0
  const totalValueCents = platformMetrics?.total_value_cents ?? 0
  const totalUsers = platformMetrics?.total_users ?? 0
  const newTenants30 = platformMetrics?.new_tenants_last_30_days ?? 0
  const newProjects30 = platformMetrics?.new_projects_last_30_days ?? 0
  const avgProjectValue = platformMetrics?.avg_project_value_cents ?? 0
  const pendingInvites = platformMetrics?.total_pending_invites ?? 0

  const mrrCents = financeMetrics?.total_mrr_cents ?? 0
  const arrCents = financeMetrics?.total_arr_cents ?? 0
  const paidInvoices = financeMetrics?.paid_invoices ?? 0
  const pendingInvoices = financeMetrics?.pending_invoices ?? 0
  const overdueInvoices = financeMetrics?.overdue_invoices ?? 0
  const totalRevenueCents = financeMetrics?.total_revenue_cents ?? 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Super Admin</h1>
        <p className="text-muted-foreground mt-1">Visão geral da plataforma Fluxoo Solar — métricas agregadas.</p>
      </div>

      {/* ===================================================== */}
      {/* STATS PRINCIPAIS */}
      {/* ===================================================== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Empresas Ativas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Empresas Ativas</CardTitle>
            <div className="p-2 bg-sky-100 rounded-full">
              <Building2 className="h-4 w-4 text-sky-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-900">{formatNumber(totalTenantsActive)}</div>
            <p className="text-xs text-sky-600 font-medium mt-1">
              {newTenants30 > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +{newTenants30} nos últimos 30 dias
                </span>
              )}
              {newTenants30 === 0 && 'Sem novas empresas recentemente'}
            </p>
          </CardContent>
        </Card>

        {/* Projetos Totais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Projetos Totais</CardTitle>
            <div className="p-2 bg-violet-100 rounded-full">
              <Briefcase className="h-4 w-4 text-violet-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-900">{formatNumber(totalProjects)}</div>
            <p className="text-xs text-violet-600 font-medium mt-1">
              {newProjects30 > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +{newProjects30} nos últimos 30 dias
                </span>
              )}
              {newProjects30 === 0 && 'Valor médio: ' + formatCurrency(avgProjectValue)}
            </p>
          </CardContent>
        </Card>

        {/* MRR */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">MRR</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(mrrCents)}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ARR: {formatCurrency(arrCents)}
            </p>
          </CardContent>
        </Card>

        {/* Usuários Totais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Usuários Totais</CardTitle>
            <div className="p-2 bg-amber-100 rounded-full">
              <Users className="h-4 w-4 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{formatNumber(totalUsers)}</div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {pendingInvites > 0 ? `${pendingInvites} convites pendentes` : 'Sem convites pendentes'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ===================================================== */}
      {/* LINHA 2: Distribuição por Tipo + Financeiro */}
      {/* ===================================================== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-600" /> Empresas por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenantsByType && tenantsByType.length > 0 ? (
              tenantsByType.map((item: any) => (
                <div key={item.tenant_type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.tenant_type === 'INTEGRATOR' ? 'bg-sky-500' :
                      item.tenant_type === 'ENGINEERING_FIRM' ? 'bg-violet-500' :
                      'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {typeLabels[item.tenant_type] || item.tenant_type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.active} ativas · {item.inactive} inativas
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.total}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhuma empresa cadastrada.</p>
            )}

            {/* Resumo */}
            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-semibold text-slate-900">{formatNumber(totalTenants)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">Inativas</span>
                <span className="font-medium text-rose-600">{formatNumber(totalTenantsInactive)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financeiro Resumido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Receita Total (pagas)</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenueCents)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50 rounded-lg p-2">
                <p className="text-lg font-bold text-emerald-700">{paidInvoices}</p>
                <p className="text-[10px] text-emerald-600 uppercase">Pagas</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2">
                <p className="text-lg font-bold text-amber-700">{pendingInvoices}</p>
                <p className="text-[10px] text-amber-600 uppercase">Pendentes</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-2">
                <p className="text-lg font-bold text-rose-700">{overdueInvoices}</p>
                <p className="text-[10px] text-rose-600 uppercase">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receita por Plano */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Receita por Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {revenueByPlan && revenueByPlan.length > 0 ? (
              revenueByPlan.map((plan: any) => (
                <div key={plan.plan_slug} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{plan.plan_name}</p>
                    <p className="text-xs text-slate-500">
                      {plan.active_tenants} empresa{plan.active_tenants !== 1 ? 's' : ''} ativa{plan.active_tenants !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(plan.mrr_cents)}</p>
                    <p className="text-[10px] text-slate-500">MRR</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum dado de receita disponível.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===================================================== */}
      {/* Alertas do Sistema */}
      {/* ===================================================== */}
      {(alerts && alerts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-slate-50/50"
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 bg-${alert.severity}-500`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
                    {alert.metric_value && (
                      <Badge className={`mt-2 ${severityColors[alert.severity] || 'bg-slate-100 text-slate-700'}`}>
                        {formatNumber(alert.metric_value)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================================================== */}
      {/* Footer: Valor total em projetos */}
      {/* ===================================================== */}
      <Card className="bg-gradient-to-br from-sky-50/30 to-violet-50/30 border-sky-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Visão Geral da Plataforma</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {formatNumber(totalProjects)} projetos somam {formatCurrency(totalValueCents)} em valor total.
                  Valor médio por projeto: {formatCurrency(avgProjectValue)}.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sky-900">{formatCurrency(totalValueCents)}</p>
              <p className="text-xs text-sky-600">Valor total em projetos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
