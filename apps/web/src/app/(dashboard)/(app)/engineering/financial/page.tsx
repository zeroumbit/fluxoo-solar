'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { DollarSign, Building2, Users, TrendingDown, Eye, CreditCard, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { financeApi } from '@/lib/api/finance'
import { projectsApi } from '@/lib/api/projects'

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-700',
  'DESIGNING': 'bg-blue-100 text-blue-700',
  'REVIEW': 'bg-purple-100 text-purple-700',
  'APPROVED': 'bg-emerald-100 text-emerald-700',
  'COMPLETED': 'bg-slate-100 text-slate-700',
  'REJECTED': 'bg-red-100 text-red-700',
  'CANCELED': 'bg-gray-100 text-gray-700'
}

const statusLabels: Record<string, string> = {
  'PENDING': 'Pendente',
  'DESIGNING': 'Em Design',
  'REVIEW': 'Em Revisão',
  'APPROVED': 'Aprovado',
  'COMPLETED': 'Concluído',
  'REJECTED': 'Rejeitado',
  'CANCELED': 'Cancelado'
}

export default function FinancialPage() {
  const { data: financeData, isLoading: financeLoading } = useQuery({
    queryKey: ['engineering-finance-stats'],
    queryFn: () => financeApi.getEngineeringStats()
  })

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['engineering-dashboard-projects'],
    queryFn: () => projectsApi.listReceived()
  })

  const isLoading = financeLoading || projectsLoading

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">Gestão de receitas e pagamentos</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturado (Completados)</CardTitle>
                <Building2 className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(financeData?.total_billed_cents || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {financeData?.completed_count || 0} projetos
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Receber (Em andamento)</CardTitle>
                <Users className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(financeData?.total_receivable_cents || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {financeData?.in_progress_count || 0} projetos
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <DollarSign className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {financeData?.projects_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa de 10% por projeto
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total Estimada</CardTitle>
                <TrendingDown className="w-4 h-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-600">
                  {formatCurrency(
                    (financeData?.total_billed_cents || 0) + (financeData?.total_receivable_cents || 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Faturado + a receber
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela por Integradora */}
          {financeData?.revenue_by_integrator && financeData.revenue_by_integrator.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receita por Integradora</CardTitle>
                <CardDescription>Valores estimados (10% do valor do projeto)</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Integradora</TableHead>
                      <TableHead className="text-right">Projetos</TableHead>
                      <TableHead className="text-right">Valor Total do Projeto</TableHead>
                      <TableHead className="text-right">Receita Engenharia (10%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeData.revenue_by_integrator.map((item: any) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCurrency(item.total_cents * 10)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-emerald-600">
                          {formatCurrency(item.total_cents)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Tabela de Projetos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projetos Recentes</CardTitle>
              <CardDescription>Últimos projetos recebidos</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Código</TableHead>
                    <TableHead>Integradora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor do Projeto</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                        Nenhum projeto recebido ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.slice(0, 10).map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-sm font-semibold">
                          {p.code || p.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {p.integrator?.fantasy_name || p.integrator?.name || 'Integradora'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[p.status] || 'bg-slate-100 text-slate-700'}>
                            {statusLabels[p.status] || p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCurrency(p.total_value_cents || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
