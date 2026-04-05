// @ts-nocheck
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { DollarSign, TrendingDown, TrendingUp, CreditCard, FileText, Eye } from 'lucide-react'

const commissions = [
  { reseller: 'LuzSol Revenda', value: 'R$ 3.840', commission: '8%' },
  { reseller: 'NovaSol', value: 'R$ 6.400', commission: '10%' },
  { reseller: 'SolBravo', value: 'R$ 1.620', commission: '9%' },
]

const engineeringPayments = [
  { project: '#2025-00128 — João Silva', company: 'Carla Engenharia', value: 'R$ 1.500', status: 'Aguardando aprovação' },
  { project: '#2025-00129 — Maria Oliveira', company: 'TechSolar Eng.', value: 'R$ 2.800', status: 'Pago' },
  { project: '#2025-00130 — Carlos Souza', company: 'Carla Engenharia', value: 'R$ 1.200', status: 'Aguardando aprovação' },
]

const statusColors: Record<string, string> = {
  'Aguardando aprovação': 'bg-amber-100 text-amber-700',
  'Pago': 'bg-emerald-100 text-emerald-700',
}

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">Controle comissões, pagamentos e receitas</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do mês</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">R$ 84.000</div><p className="text-xs text-muted-foreground">+12% vs. mês anterior</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões a pagar</CardTitle>
            <TrendingDown className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-600">R$ 11.860</div><p className="text-xs text-muted-foreground">Revendedores + Engenharia</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A receber líquido</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">R$ 72.140</div><p className="text-xs text-muted-foreground">Após comissões e taxas</p></CardContent>
        </Card>
      </div>

      {/* Comissões a Pagar */}
      <Card>
        <CardHeader><CardTitle className="text-base">Comissões a Pagar por Revendedor</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Revendedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.map((c) => (
                <TableRow key={c.reseller}>
                  <TableCell className="font-medium">{c.reseller}</TableCell>
                  <TableCell className="font-mono font-semibold">{c.value}</TableCell>
                  <TableCell><Badge variant="secondary" className="font-mono">{c.commission}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" className="text-xs">
                        <CreditCard className="w-3 h-3 mr-1" /> Pagar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagamentos à Engenharia */}
      <Card>
        <CardHeader><CardTitle className="text-base">Pagamentos Pendentes à Engenharia</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Projeto</TableHead>
                <TableHead>Engenharia</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engineeringPayments.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm">{p.project}</TableCell>
                  <TableCell className="font-medium">{p.company}</TableCell>
                  <TableCell className="font-mono font-semibold">{p.value}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status]} hover:${statusColors[p.status]}`}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status !== 'Pago' && (
                      <Button variant="outline" size="sm" className="text-xs">
                        <CreditCard className="w-3 h-3 mr-1" /> Pagar
                      </Button>
                    )}
                    {p.status === 'Pago' && (
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    )}
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
