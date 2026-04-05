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
import { Search, Eye, Play, Send, ShieldAlert, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-700',
  'DESIGNING': 'bg-blue-100 text-blue-700',
  'REVIEW': 'bg-purple-100 text-purple-700',
  'APPROVED': 'bg-teal-100 text-teal-700',
  'COMPLETED': 'bg-emerald-100 text-emerald-700',
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

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

export default function ReceivedProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['received-projects', { status: statusFilter, search }],
    queryFn: () => projectsApi.listReceived({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined
    })
  })

  // Mutation para aceitar projeto (mudar status para DESIGNING)
  const acceptMutation = useMutation({
    mutationFn: (projectId: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DESIGNING' })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-projects'] })
    }
  })

  // Mutation para enviar para revisão
  const reviewMutation = useMutation({
    mutationFn: (projectId: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REVIEW' })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-projects'] })
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos Recebidos</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Trabalhos solicitados por integradoras parceiras.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, título ou integradora..."
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
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="DESIGNING">Em Design</SelectItem>
            <SelectItem value="REVIEW">Em Revisão</SelectItem>
            <SelectItem value="APPROVED">Aprovados</SelectItem>
            <SelectItem value="COMPLETED">Concluídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Projetos Recebidos */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic text-sm">
              {search || statusFilter !== 'all'
                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                : 'Nenhum projeto recebido ainda. As integradoras delegarão projetos para sua equipe.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Código</TableHead>
                  <TableHead>Integradora</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p: any) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-sm font-semibold">
                      {p.code || p.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.integrator?.fantasy_name || p.integrator?.name || 'Integradora'}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {p.title || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 bg-white">
                        {p.type || 'Solar'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[p.status] || 'bg-slate-100 text-slate-700'}>
                        {statusLabels[p.status] || p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {p.total_value_cents ? formatCurrency(p.total_value_cents) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.deadline ? new Date(p.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/engineering/received-projects/${p.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        {p.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Aceitar e Iniciar"
                            className="text-primary"
                            onClick={() => acceptMutation.mutate(p.id)}
                            disabled={acceptMutation.isPending}
                          >
                            {acceptMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        {(p.status === 'DESIGNING') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Enviar para Revisão"
                            className="text-emerald-600"
                            onClick={() => reviewMutation.mutate(p.id)}
                            disabled={reviewMutation.isPending}
                          >
                            {reviewMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        )}
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
          {projects.length} projeto(s) recebido(s)
        </p>
      </div>
    </div>
  )
}
