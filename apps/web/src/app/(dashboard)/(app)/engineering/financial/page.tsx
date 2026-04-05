// @ts-nocheck
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { DollarSign, Building2, Users, TrendingDown, Eye, CreditCard } from 'lucide-react'

const integratorProjects = [
  { code: '#2025-00123', integrator: 'SolarPrime', value: 'R$ 1.500', status: 'Aguardando aprovação' },
  { code: '#2025-00124', integrator: 'EcoSolar', value: 'R$ 2.800', status: 'Pago' },
  { code: '#2025-00126', integrator: 'SolarPrime', value: 'R$ 1.200', status: 'Pago' },
]

const ownProjects = [
  { client: 'João Silva', project: 'Residencial 5kWp', value: 'R$ 1.200', status: 'Aguardando pagamento' },
  { client: 'Maria Oliveira', project: 'Comercial 20kWp', value: 'R$ 2.500', status: 'Pago' },
  { client: 'Carlos Souza', project: 'Residencial 8kWp', value: 'R$ 1.800', status: 'Vencido' },
]

const statusColors: Record<string, string> = {
  'Aguardando aprovação': 'bg-amber-100 text-amber-700',
  'Aguardando pagamento': 'bg-amber-100 text-amber-700',
  'Pago': 'bg-emerald-100 text-emerald-700',
  'Vencido': 'bg-red-100 text-red-700',
}

export default function FinancialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">Gestão de receitas e pagamentos</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A receber (Integradoras)</CardTitle>
            <Building2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">R$ 1.500</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A receber (Clientes)</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">R$ 3.000</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Fluxoo</CardTitle>
            <TrendingDown className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-600">R$ 450</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Líquido</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">R$ 4.050</div></CardContent>
        </Card>
      </div>

      {/* Tabela Integradoras */}
      <Card>
        <CardHeader><CardTitle className="text-base">Projetos de Integradoras</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Projeto</TableHead>
                <TableHead>Integradora</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integratorProjects.map((p) => (
                <TableRow key={p.code}>
                  <TableCell className="font-mono text-sm font-semibold">{p.code}</TableCell>
                  <TableCell>{p.integrator}</TableCell>
                  <TableCell className="font-mono">{p.value}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status]} hover:${statusColors[p.status]}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabela Clientes Diretos */}
      <Card>
        <CardHeader><CardTitle className="text-base">Projetos Próprios (Clientes Diretos)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Cliente</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownProjects.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{p.client}</TableCell>
                  <TableCell className="text-sm">{p.project}</TableCell>
                  <TableCell className="font-mono">{p.value}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status]} hover:${statusColors[p.status]}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.status !== 'Pago' && (
                        <Button variant="outline" size="sm" className="text-xs">
                          <CreditCard className="w-3 h-3 mr-1" /> Cobrar
                        </Button>
                      )}
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
