'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  FileText, Clock, DollarSign, ArrowRight,
  TrendingUp, TrendingDown, Loader2, AlertCircle, Building2
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { financeApi } from '@/lib/api/finance'
import { FormattedDate } from '@/components/ui/formatted-date'
import Link from 'next/link'

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

export default function EngineeringDashboard() {
  const [period, setPeriod] = useState('30')

  // Buscar estatísticas do dashboard
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['engineering-stats'],
    queryFn: () => projectsApi.getStats()
  })

  // Buscar dados financeiros
  const { data: financeData, isLoading: financeLoading } = useQuery({
    queryKey: ['engineering-finance-stats'],
    queryFn: () => financeApi.getEngineeringStats()
  })

  // Buscar projetos recebidos
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['engineering-dashboard-projects'],
    queryFn: () => projectsApi.listReceived()
  })

  const isLoading = statsLoading || financeLoading || projectsLoading

  // Filtrar projetos ativos
  const activeProjects = projects.filter(
    p => !['COMPLETED', 'CANCELED', 'REJECTED'].includes(p.status)
  )

  // Projetos atrasados
  const delayedProjects = projects.filter(p => {
    if (!p.deadline) return false
    if (['COMPLETED', 'CANCELED', 'REJECTED'].includes(p.status)) return false
    return new Date(p.deadline) < new Date()
  })

  // Status colors
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-amber-100 text-amber-700',
      'DESIGNING': 'bg-blue-100 text-blue-700',
      'REVIEW': 'bg-purple-100 text-purple-700',
      'APPROVED': 'bg-green-100 text-green-700',
      'COMPLETED': 'bg-slate-100 text-slate-700',
      'REJECTED': 'bg-red-100 text-red-700',
      'CANCELED': 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos projetos de engenharia</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Cards Resumo */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.active_projects || 0}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats?.total_projects || 0} total
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos em Atraso</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.delayed_projects || delayedProjects.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Prazo vencido
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Aberto</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(stats?.open_billing_cents || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projetos em andamento
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                <TrendingUp className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {formatCurrency(stats?.total_receivable_cents || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa de engenharia (10%)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Projetos Recebidos Recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Projetos Recebidos Recentemente
              </h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/engineering/received-projects">
                  Ver todos <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <Card className="border-dashed bg-slate-50/50">
                <CardContent className="py-10 text-center text-muted-foreground italic text-sm">
                  Nenhum projeto recebido ainda. As integradoras delegarão projetos para sua equipe.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-3">
                {projects.slice(0, 6).map((p: any) => (
                  <Card key={p.id} className="hover:shadow-md transition-all border-none bg-slate-50/50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] bg-white uppercase font-bold text-slate-500">
                          {p.type || 'Solar'}
                        </Badge>
                        <Badge className={getStatusColor(p.status)}>
                          {p.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {p.integrator?.fantasy_name || p.integrator?.name || 'Integradora'} {p.code ? `- ${p.code}` : ''}
                        </p>
                        {p.title && (
                          <p className="text-xs text-muted-foreground mt-0.5">{p.title}</p>
                        )}
                        {p.deadline && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> Prazo: <FormattedDate date={p.deadline} fallback="Sem prazo" />
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-white" asChild>
                        <Link href={`/engineering/received-projects/${p.id}`}>
                          Acessar Projeto <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Grid: Status e Financeiro */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Distribuição por Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Projetos por Status</CardTitle>
                <CardDescription>Distribuição atual dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.status_counts && Object.keys(stats.status_counts).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.status_counts).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(status)} variant="secondary">
                            {status}
                          </Badge>
                        </div>
                        <span className="font-semibold text-sm">{count as number}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sem dados de status
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                <CardDescription>Valores estimados (10% taxa de engenharia)</CardDescription>
              </CardHeader>
              <CardContent>
                {financeData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="text-xs text-emerald-600 font-medium">Faturado (Completados)</p>
                        <p className="text-lg font-bold text-emerald-700">
                          {formatCurrency(financeData.total_billed_cents || 0)}
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-xs text-blue-600 font-medium">A Receber (Em andamento)</p>
                        <p className="text-lg font-bold text-blue-700">
                          {formatCurrency(financeData.total_receivable_cents || 0)}
                        </p>
                      </div>
                      <TrendingDown className="w-5 h-5 text-blue-500" />
                    </div>

                    {financeData.revenue_by_integrator && financeData.revenue_by_integrator.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Por Integradora</p>
                        <div className="space-y-2">
                          {financeData.revenue_by_integrator.slice(0, 3).map((item: any) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground truncate">{item.name}</span>
                              <span className="font-medium">{formatCurrency(item.total_cents)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Sem dados financeiros
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
