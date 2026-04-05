'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, PieChart, TrendingDown, Users, HardDrive, 
  AlertTriangle, Calendar as CalendarIcon, Download 
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function SuperAdminMetrics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Métricas Oficiais</h1>
          <p className="text-muted-foreground mt-1">Acompanhamento financeiro e de recursos.</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>01 Jan, 2026 - 04 Abr, 2026</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
               {/* Simulação Picker */}
               <div className="p-4 flex flex-col gap-2">
                  <div className="text-sm font-medium">Selecione o período</div>
                  <div className="flex gap-2">
                    <Input type="date" className="w-[140px]" />
                    <span className="self-center text-slate-400">até</span>
                    <Input type="date" className="w-[140px]" />
                  </div>
                  <Button size="sm" className="mt-2 text-xs">Aplicar Filtro</Button>
               </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Total de Empresas LTV
              <BarChart3 className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-2xl font-bold text-slate-900">142 Ativas</div>
            <div className="mt-4 h-[60px] flex items-end gap-1">
              {[40, 55, 65, 80, 110, 142].map((val, i) => (
                <div key={i} className="bg-primary/80 hover:bg-primary w-full rounded-t-sm transition-all" style={{ height: `${(val/142)*100}%` }}></div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Evolução (últimos 6 meses)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Churn Rate (Cancelamentos)
              <TrendingDown className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mt-2">1.8%</div>
            <p className="text-sm text-emerald-600 font-medium mt-1">-0.4% em relação ao mês anterior</p>
            <div className="mt-6 flex items-center gap-4 border-t pt-4">
              <div className="flex-1">
                <span className="text-xs text-slate-500 uppercase">Perdidas</span>
                <p className="font-semibold text-slate-900">3</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex-1">
                <span className="text-xs text-slate-500 uppercase">Recuperadas</span>
                <p className="font-semibold text-slate-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center justify-between">
              Ticket Médio por Plano (ARPU)
              <PieChart className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mt-2">R$ 512,40</div>
            <p className="text-sm text-emerald-600 font-medium mt-1">+R$ 12,00 em relação ao mês anterior</p>
            
            <div className="space-y-3 mt-6">
              {[
                { label: 'Starter', percent: 45, val: 'R$ 199' },
                { label: 'Pro', percent: 35, val: 'R$ 499' },
                { label: 'Enterprise', percent: 20, val: 'R$ 899' },
              ].map(plan => (
                <div key={plan.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{plan.label} <span className="text-slate-400">({plan.percent}%)</span></span>
                    <span className="text-slate-500">{plan.val} méd.</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${plan.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-500" />
              Consumo de Armazenamento
            </CardTitle>
            <CardDescription>Empresas próximas ao limite (Top 5)</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {[
                    { nome: "Engineering Beta", uso: "4.8 GB", lim: "5 GB", per: 96 },
                    { nome: "Solar Master", uso: "9.2 GB", lim: "10 GB", per: 92 },
                    { nome: "Luz Forte Sul", uso: "4.5 GB", lim: "5 GB", per: 90 },
                    { nome: "Projetos Alfa", uso: "8.5 GB", lim: "10 GB", per: 85 },
                    { nome: "Nova Era Solar", uso: "4.1 GB", lim: "5 GB", per: 82 },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.nome}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="font-mono text-xs">{item.uso}</span> / {item.lim}
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                         <div className="flex items-center justify-end gap-2">
                           <span className={`text-xs font-semibold ${item.per > 90 ? 'text-rose-500' : 'text-amber-500'}`}>{item.per}%</span>
                           <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${item.per > 90 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${item.per}%` }}></div>
                           </div>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Relatório de Inadimplência
            </CardTitle>
            <CardDescription>Faturas vencidas não pagas</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {[
                    { nome: "Soluções XYZ", atraso: "45 dias", valor: "R$ 499,90" },
                    { nome: "RenovEnergia", atraso: "20 dias", valor: "R$ 1.399,70" },
                    { nome: "TechBrasil Instalações", atraso: "15 dias", valor: "R$ 199,90" },
                    { nome: "Global Verde", atraso: "10 dias", valor: "R$ 499,90" },
                    { nome: "Engenheiros JS", atraso: "6 dias", valor: "R$ 499,90" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.nome}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          parseInt(item.atraso) > 30 ? 'bg-rose-100 text-rose-700' : 
                          parseInt(item.atraso) > 10 ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.atraso}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-rose-600">{item.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Total em Aberto</span>
              <span className="text-lg font-bold text-slate-900">R$ 12.450,00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
