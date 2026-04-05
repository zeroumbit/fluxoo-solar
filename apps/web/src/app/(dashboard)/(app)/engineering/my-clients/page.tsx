'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Search, Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'

const statusColors: Record<string, string> = {
  'PROSPECTING': 'bg-slate-100 text-slate-700',
  'DESIGNING': 'bg-blue-100 text-blue-700',
  'REVIEW': 'bg-purple-100 text-purple-700',
  'APPROVED': 'bg-teal-100 text-teal-700',
  'COMPLETED': 'bg-emerald-100 text-emerald-700',
  'REJECTED': 'bg-red-100 text-red-700',
  'CANCELED': 'bg-gray-100 text-gray-700'
}

const statusLabels: Record<string, string> = {
  'PROSPECTING': 'Prospecção',
  'DESIGNING': 'Design',
  'REVIEW': 'Revisão',
  'APPROVED': 'Aprovado',
  'COMPLETED': 'Concluído',
  'REJECTED': 'Rejeitado',
  'CANCELED': 'Cancelado'
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

export default function MyClientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Buscar projetos próprios (onde engenharia é dona do projeto, não delegada)
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['engineering-own-projects'],
    queryFn: () => projectsApi.list({ search: search || undefined })
  })

  const filtered = projects.filter((p: any) => {
    const matchSearch = !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name || '').toLowerCase().includes(search.toLowerCase())

    const matchStatus = statusFilter === 'all' || p.status === statusFilter

    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Clientes</h1>
          <p className="text-muted-foreground">Clientes que contrataram diretamente nossos serviços</p>
        </div>
        <Button asChild>
          <Link href="/engineering/my-clients/new">
            <Plus className="w-4 h-4 mr-2" /> Novo Projeto
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, código ou projeto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PROSPECTING">Prospecção</SelectItem>
            <SelectItem value="DESIGNING">Design</SelectItem>
            <SelectItem value="REVIEW">Revisão</SelectItem>
            <SelectItem value="APPROVED">Aprovado</SelectItem>
            <SelectItem value="COMPLETED">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic">
              {search || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                : 'Nenhum projeto próprio criado ainda.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Prazo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p: any) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-sm font-semibold">
                      {p.code || p.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.client_name || 'Cliente'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.title || 'Sem título'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[p.status] || 'bg-slate-100 text-slate-700'}>
                        {statusLabels[p.status] || p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">
                      {p.total_value_cents ? formatCurrency(p.total_value_cents) : '—'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {p.deadline ? new Date(p.deadline).toLocaleDateString('pt-BR') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/engineering/my-clients/${p.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/engineering/my-clients/${p.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} projeto(s) encontrado(s)
        </p>
      </div>
    </div>
  )
}
