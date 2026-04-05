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
  FileText, Clock, DollarSign, AlertTriangle, ArrowRight,
  ShieldAlert, Users, Star, TrendingUp
} from 'lucide-react'

const projectsFromIntegrators = [
  { id: '#2025-00123', integrator: 'SolarPrime', deadline: '5 dias', status: 'Pendente', type: 'Residencial' },
  { id: '#2025-00124', integrator: 'EcoSolar', deadline: '3 dias', status: 'Em andamento', type: 'Comercial' },
  { id: '#2025-00125', integrator: 'SunTech', deadline: '8 dias', status: 'Aguardando docs', type: 'Industrial' },
]

const ownProjects = [
  { client: 'João Silva', status: 'Em andamento', rating: null, type: 'Residencial' },
  { client: 'Maria Oliveira', status: 'Concluído', rating: 4.8, type: 'Comercial' },
  { client: 'Carlos Souza', status: 'Pendente avaliação', rating: null, type: 'Residencial' },
]

const alerts = [
  { text: 'Projeto #2025-00123 com prazo em 2 dias', type: 'warning' },
  { text: 'Documentos pendentes no projeto #2025-00125', type: 'info' },
  { text: 'Aprovação de ART necessária para projeto de Maria Oliveira', type: 'action' },
]

export default function EngineeringDashboard() {
  const [period, setPeriod] = useState('30')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-manrope)]">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos seus projetos e finanças</p>
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
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">8 recebidos + 7 próprios</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos em Atraso</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-xs text-muted-foreground">Prazo vencido ou próximo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber Este Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ 18.400</div>
            <p className="text-xs text-muted-foreground">+12% vs. mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Projetos Recebidos (de Integradoras) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Projetos Recebidos (de Integradoras)</h2>
          <Badge variant="secondary" className="text-[10px]">SIGILO</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {projectsFromIntegrators.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{p.type}</Badge>
                  <Badge className={
                    p.status === 'Pendente' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                    p.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                    'bg-slate-100 text-slate-700 hover:bg-slate-100'
                  }>{p.status}</Badge>
                </div>
                <div>
                  <p className="font-semibold text-sm">{p.integrator} {p.id}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Prazo: {p.deadline}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Cliente oculto
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Acessar <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meus Clientes (Projetos Próprios) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Meus Clientes (Projetos Próprios)</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {ownProjects.map((p, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{p.type}</Badge>
                  <Badge className={
                    p.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                    p.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                    'bg-amber-100 text-amber-700 hover:bg-amber-100'
                  }>{p.status}</Badge>
                </div>
                <div>
                  <p className="font-semibold text-sm">{p.client}</p>
                  {p.rating && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {p.rating}
                    </p>
                  )}
                  {!p.rating && (
                    <p className="text-xs text-muted-foreground mt-1">Avaliação pendente</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Acessar <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" /> Alertas
        </h2>
        <Card>
          <CardContent className="pt-4 divide-y">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  a.type === 'warning' ? 'bg-orange-500' :
                  a.type === 'info' ? 'bg-blue-500' : 'bg-primary'
                }`} />
                <p className="text-sm text-slate-700">{a.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
