import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3, PieChart, TrendingDown, HardDrive,
  AlertTriangle, Download
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface PlanRevenue {
  plan_name: string
  plan_slug: string
  active_tenants: number
  mrr_cents: number | string
  total_revenue_cents: number | string
}

interface StorageUsage {
  tenant_id: string
  tenant_name: string
  fantasy_name: string | null
  tenant_type: string
  total_storage_mb: number | string
  plan_max_mb: number
  usage_percent: number | string
}

interface OverdueInvoice {
  tenant_name: string
  fantasy_name: string | null
  days_overdue: number
  amount_cents: number
  due_date: string
  plan_name: string
}

interface TenantEvolution {
  month: string
  new_tenants: number
  active_tenants: number
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

function formatStorage(mb: number | string) {
  const value = typeof mb === 'string' ? parseFloat(mb) : mb
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} TB`
  }
  return `${value.toFixed(1)} GB`
}

export default async function SuperAdminMetrics() {
  const supabase = await createClient()

  // Buscar todas as métricas em paralelo
  const [
    { data: platformMetrics },
    { data: churnMetrics },
    { data: revenueByPlan },
    { data: financeMetrics },
    { data: topStorageUsage },
    { data: overdueInvoices },
    { data: tenantEvolution },
  ] = await Promise.all([
    supabase.rpc('super_admin_platform_metrics'),
    supabase.rpc('super_admin_churn_metrics'),
    supabase.rpc('super_admin_revenue_by_plan'),
    supabase.rpc('super_admin_finance_metrics'),
    supabase.rpc('super_admin_top_storage_usage', { p_limit: 5 }),
    supabase.rpc('super_admin_overdue_invoices', { p_limit: 5 }),
    supabase.rpc('super_admin_tenant_evolution', { p_months: 6 }),
  ])

  // Tipar dados
  const plans = (revenueByPlan || []) as PlanRevenue[]
  const storageData = (topStorageUsage || []) as StorageUsage[]
  const overdueData = (overdueInvoices || []) as OverdueInvoice[]
  const evolutionData = (tenantEvolution || []) as TenantEvolution[]

  // Métricas de plataforma
  const totalTenants = platformMetrics?.total_tenants ?? 0
  const totalTenantsActive = platformMetrics?.total_tenants_active ?? 0
  const totalProjects = platformMetrics?.total_projects ?? 0
  const totalValueCents = platformMetrics?.total_value_cents ?? 0
  const avgProjectValue = platformMetrics?.avg_project_value_cents ?? 0

  // Métricas de churn
  const churnRate = churnMetrics?.churn_rate_percent ?? 0
  const totalChurned = churnMetrics?.total_churned_tenants ?? 0
  const recoveredTenants = churnMetrics?.recovered_tenants ?? 0
  const prevChurnRate = churnMetrics?.monthly_churn_rate ?? 0

  // Receita por plano
  const totalMRR = plans.reduce((sum: number, plan: PlanRevenue) => sum + (parseFloat(String(plan.mrr_cents)) || 0), 0)
  const avgTicket = totalTenantsActive > 0 ? totalMRR / totalTenantsActive : 0

  // Calcular distribuição por plano
  const totalTenantsByPlan = plans.reduce((sum: number, plan: PlanRevenue) => sum + (plan.active_tenants || 0), 0)
  const planDistribution = plans.map((plan: PlanRevenue) => ({
    ...plan,
    percentage: totalTenantsByPlan > 0
      ? Math.round(((plan.active_tenants || 0) / totalTenantsByPlan) * 100)
      : 0,
  }))

  // Storage top usage
  // Inadimplência
  const totalOverdueCents = overdueData.reduce((sum: number, inv: OverdueInvoice) => sum + (inv.amount_cents || 0), 0)
  const totalOverdueInvoices = financeMetrics?.overdue_invoices ?? 0
  const pendingInvoices = financeMetrics?.pending_invoices ?? 0

  // Evolução de tenants (últimos 6 meses)
  const maxTenants = Math.max(...evolutionData.map((e: TenantEvolution) => e.active_tenants || 0), 1)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Métricas Oficiais</h1>
          <p className="text-muted-foreground mt-1">Acompanhamento financeiro e de recursos em tempo real.</p>
        </div>
        <Button variant="outline" size="icon" title="Exportar relatório">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total de Empresas LTV */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Total de Empresas LTV
              <BarChart3 className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold text-slate-900">{formatNumber(totalTenantsActive)} Ativas</div>
            <div className="mt-4 h-[60px] flex items-end gap-1">
              {evolutionData.map((item: TenantEvolution, i: number) => {
                const activeCount = item.active_tenants || 0
                const heightPercent = maxTenants > 0 ? (activeCount / maxTenants) * 100 : 0
                return (
                  <div
                    key={i}
                    className="bg-primary/80 hover:bg-primary w-full rounded-t-sm transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.month}: ${activeCount} empresas`}
                  />
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Evolução (últimos 6 meses) · {totalTenants} total
            </p>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Churn Rate (Cancelamentos)
              <TrendingDown className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mt-2">{churnRate.toFixed(1)}%</div>
            {prevChurnRate > 0 && (
              <p className={`text-sm font-medium mt-1 ${churnRate < prevChurnRate ? 'text-emerald-600' : 'text-rose-600'}`}>
                {churnRate < prevChurnRate ? '-' : '+'}{Math.abs(churnRate - prevChurnRate).toFixed(1)}% em relação ao mês anterior
              </p>
            )}
            {prevChurnRate === 0 && (
              <p className="text-sm text-slate-500 mt-1">Taxa calculada com base em tenants inativos</p>
            )}
            <div className="mt-6 flex items-center gap-4 border-t pt-4">
              <div className="flex-1">
                <span className="text-xs text-slate-500 uppercase">Perdidas</span>
                <p className="font-semibold text-slate-900">{formatNumber(totalChurned)}</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex-1">
                <span className="text-xs text-slate-500 uppercase">Recuperadas</span>
                <p className="font-semibold text-slate-900">{formatNumber(recoveredTenants)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Médio por Plano (ARPU) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Ticket Médio por Plano (ARPU)
              <PieChart className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(avgTicket * 100)}</div>
            <p className="text-sm text-emerald-600 font-medium mt-1">
              MRR Total: {formatCurrency(totalMRR * 100)}
            </p>

            <div className="space-y-3 mt-6">
              {planDistribution.length > 0 ? planDistribution.map((plan: PlanRevenue & { percentage: number }, i: number) => (
                <div key={plan.plan_slug} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">
                      {plan.plan_name}
                      <span className="text-slate-400"> ({plan.percentage}%)</span>
                    </span>
                    <span className="text-slate-500">
                      {formatCurrency(plan.mrr_cents)} méd.
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${plan.percentage}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-500 text-center py-4">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Consumo de Armazenamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-500" />
              Consumo de Armazenamento
            </CardTitle>
            <CardDescription>Empresas próximas ao limite (Top 5)</CardDescription>
          </CardHeader>
          <CardContent>
            {storageData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Empresa</th>
                      <th className="px-4 py-3 font-medium">Uso atual</th>
                      <th className="px-4 py-3 font-medium text-right">Progresso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {storageData.map((item: StorageUsage, i: number) => {
                      const usagePercent = parseFloat(String(item.usage_percent)) || 0
                      const totalMB = parseFloat(String(item.total_storage_mb)) || 0
                      const maxMB = item.plan_max_mb || 0
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.fantasy_name || item.tenant_name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <span className="font-mono text-xs">{formatStorage(totalMB)}</span>
                            {' / '}
                            {formatStorage(maxMB)}
                          </td>
                          <td className="px-4 py-3 min-w-[120px]">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`text-xs font-semibold ${
                                usagePercent > 90 ? 'text-rose-500' :
                                usagePercent > 75 ? 'text-amber-500' :
                                'text-emerald-500'
                              }`}>
                                {usagePercent.toFixed(0)}%
                              </span>
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    usagePercent > 90 ? 'bg-rose-500' :
                                    usagePercent > 75 ? 'bg-amber-500' :
                                    'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Nenhum dado de armazenamento disponível.</p>
            )}
          </CardContent>
        </Card>

        {/* Relatório de Inadimplência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Relatório de Inadimplência
            </CardTitle>
            <CardDescription>
              Faturas vencidas não pagas ({totalOverdueInvoices + pendingInvoices} pendentes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overdueData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Empresa</th>
                        <th className="px-4 py-3 font-medium">Atraso</th>
                        <th className="px-4 py-3 font-medium text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {overdueData.map((item: OverdueInvoice, i: number) => {
                        const daysOverdue = item.days_overdue || 0
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {item.fantasy_name || item.tenant_name}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                daysOverdue > 30 ? 'bg-rose-100 text-rose-700' :
                                daysOverdue > 10 ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {daysOverdue} dias
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-rose-600">
                              {formatCurrency(item.amount_cents)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total exibido ({overdueData.length} faturas)
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(totalOverdueCents)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-4 bg-emerald-50 rounded-full mb-3">
                    <AlertTriangle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Nenhuma fatura vencida</p>
                  <p className="text-xs text-slate-500 mt-1">Todas as faturas estão em dia!</p>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Pendentes + Vencidas</span>
                  <span className="text-lg font-bold text-slate-900">{totalOverdueInvoices + pendingInvoices}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
