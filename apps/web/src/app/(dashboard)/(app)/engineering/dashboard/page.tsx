// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  FileText, Clock, DollarSign, ArrowRight,
  ShieldAlert, Loader2
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { FormattedDate } from '@/components/ui/formatted-date'
import Link from 'next/link'

export default function EngineeringDashboard() {
  const [period, setPeriod] = useState('30')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['engineering-dashboard-projects'],
    queryFn: () => projectsApi.listReceived()
  })

  // Simulação de projetos próprios (não implementado no backend ainda)
  const ownProjectsCount = 0
  const activeReceived = projects.filter(p => !['COMPLETED', 'CANCELED'].includes(p.status))
  const delayedCount = projects.filter(p => p.delayed).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos seus projetos e parcerias</p>
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

      {/* Cards Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : activeReceived.length + ownProjectsCount}</div>
            <p className="text-xs text-muted-foreground">{activeReceived.length} recebidos + {ownProjectsCount} próprios</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos em Atraso</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{isLoading ? '...' : delayedCount}</div>
            <p className="text-xs text-muted-foreground">Prazo vencido ou próximo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Aberto</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ 0</div>
            <p className="text-xs text-muted-foreground">Projetos em andamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Projetos Recebidos (de Integradoras) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Projetos Recebidos Recentemente</h2>
          <Badge variant="secondary" className="text-[10px] uppercase">Sigilo</Badge>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : projects.length === 0 ? (
            <Card className="border-dashed bg-slate-50/50">
                <CardContent className="py-10 text-center text-muted-foreground italic text-sm">
                    Nenhum projeto recebido nos últimos dias.
                </CardContent>
            </Card>
        ) : (
            <div className="grid gap-3 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
                <Card key={p.id} className="hover:shadow-md transition-all border-none bg-slate-50/50">
                <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] bg-white uppercase font-bold text-slate-500">{p.type || 'Solar'}</Badge>
                    <Badge className={
                        p.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        p.status === 'DESIGNING' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                        'bg-slate-100 text-slate-700 hover:bg-slate-100'
                    }>{p.status}</Badge>
                    </div>
                    <div>
                    <p className="font-bold text-sm">{p.integrator?.fantasy_name || 'Integradora'} {p.code}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Prazo: <FormattedDate date={p.deadline} fallback="Sem prazo" />
                    </p>
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

      {/* Projetos Próprios e Alertas (Seção Simplificada para o MVP) */}
      <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">Meus Clientes Diretos</h2>
              <Card className="border-dashed h-40 flex items-center justify-center text-muted-foreground text-sm italic py-4">
                  Em breve: Gestão de projetos sem integradoras.
              </Card>
          </div>
          <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">Avisos do Sistema</h2>
              <Card className="h-40 overflow-y-auto">
                  <CardContent className="py-4 space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Dica</Badge>
                          <p>Mantenha seu portfólio atualizado para receber mais convites.</p>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Aviso</Badge>
                          <p>Você tem 2 projetos com prazo vencendo em 48h.</p>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  )
}
