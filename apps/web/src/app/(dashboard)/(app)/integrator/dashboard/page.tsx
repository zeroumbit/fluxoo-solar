// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  FileText, Clock, DollarSign, AlertTriangle,
  TrendingDown, CheckCircle, BarChart3, Loader2
} from 'lucide-react'
import { projectsApi } from '@/lib/api/projects'
import { useQuery } from '@tanstack/react-query'

const statusData = [
  { label: 'Prospecção', value: 8, color: 'bg-slate-400', pct: 20 },
  { label: 'Design', value: 12, color: 'bg-blue-500', pct: 30 },
  { label: 'Homologação', value: 7, color: 'bg-purple-500', pct: 17.5 },
  { label: 'Instalados', value: 9, color: 'bg-teal-500', pct: 22.5 },
  { label: 'Concluídos', value: 4, color: 'bg-emerald-500', pct: 10 },
]

const alerts = [
  { text: 'Projeto #2025-00131 parado há 5 dias sem atualização', type: 'warning' },
  { text: 'Documentos pendentes de João Silva no projeto #2025-00133', type: 'doc' },
  { text: 'Assinatura aguardando de Maria Oliveira — contrato comercial', type: 'sign' },
  { text: 'Engenharia Carla solicitou mais informações em #2025-00129', type: 'info' },
]

const alertIcons: Record<string, string> = {
  warning: 'bg-orange-500',
  doc: 'bg-blue-500',
  sign: 'bg-purple-500',
  info: 'bg-primary',
}

export default function IntegratorDashboard() {
  const [period, setPeriod] = useState('30')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects-dashboard'],
    queryFn: () => projectsApi.list()
  })

  // Cálculos simples para o MVP
  const activeCount = projects.filter(p => !['COMPLETED', 'CANCELED'].includes(p.status)).length
  const processingCount = projects.filter(p => ['DESIGNING', 'HOMOLOGATING'].includes(p.status)).length
  const delayedCount = projects.filter(p => p.delayed).length // Supondo que a API retorne flag delayed
  
  // Agrupar por status
  const countsByStatus = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = [
    { label: 'Prospecção', value: countsByStatus['PROSPECTING'] || 0, color: 'bg-slate-400', pct: 0 },
    { label: 'Design', value: countsByStatus['DESIGNING'] || 0, color: 'bg-blue-500', pct: 0 },
    { label: 'Homologação', value: countsByStatus['HOMOLOGATING'] || 0, color: 'bg-purple-500', pct: 0 },
    { label: 'Instalados', value: countsByStatus['INSTALLED'] || 0, color: 'bg-teal-500', pct: 0 },
    { label: 'Concluídos', value: countsByStatus['COMPLETED'] || 0, color: 'bg-emerald-500', pct: 0 },
  ].map(item => ({
      ...item,
      pct: projects.length > 0 ? (item.value / projects.length) * 100 : 0
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos seus projetos e operações</p>
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

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
            Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse bg-slate-100 h-24" />
            ))
        ) : (
            <>
            <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                    <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeCount}</div>
                    <p className="text-xs text-muted-foreground">Total em andamento</p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Em andamento</CardTitle>
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{processingCount}</div>
                    <p className="text-xs text-muted-foreground">Design + Homologação</p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{delayedCount}</div>
                    <p className="text-xs text-muted-foreground">Prazo vencido</p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">R$ 0</div>
                    <p className="text-xs text-muted-foreground">Em implementação</p>
                </CardContent>
            </Card>
            </>
        )}
      </div>

      {/* Gráfico de barras */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Projetos por Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : chartData.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.label}</span>
                <span className="text-muted-foreground">{s.value} projetos</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${s.color} rounded-full transition-all`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${alertIcons[a.type]}`} />
              <p className="text-sm text-slate-700">{a.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
