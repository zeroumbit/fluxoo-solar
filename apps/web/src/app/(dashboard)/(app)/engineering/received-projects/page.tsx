// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Search, Eye, Play, Send, ShieldAlert, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { FormattedDate } from '@/components/ui/formatted-date'

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-700',
  'DESIGNING': 'bg-blue-100 text-blue-700',
  'HOMOLOGATING': 'bg-purple-100 text-purple-700',
  'INSTALLED': 'bg-teal-100 text-teal-700',
  'COMPLETED': 'bg-emerald-100 text-emerald-700',
}

const statusLabelMap: Record<string, string> = {
  'PENDING': 'Pendente',
  'DESIGNING': 'Design',
  'HOMOLOGATING': 'Homologação',
  'INSTALLED': 'Instalado',
  'COMPLETED': 'Concluído',
}

export default function ReceivedProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['received-projects', { status: statusFilter, search }],
    queryFn: () => projectsApi.listReceived({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined
    })
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
            placeholder="Buscar por código ou integradora..."
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
            <SelectItem value="HOMOLOGATING">Homologação</SelectItem>
            <SelectItem value="COMPLETED">Concluídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Projetos Recebidos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Código</TableHead>
                <TableHead>Integradora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : projects.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">Nenhum projeto recebido ainda.</TableCell></TableRow>
              ) : projects.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 hover:cursor-default transition-colors">
                  <TableCell className="font-mono text-sm font-semibold">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.integrator?.fantasy_name || p.integrator?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 bg-white">{p.type || 'Solar'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status] || 'bg-slate-100'} hover:opacity-80 transition-opacity`}>
                      {statusLabelMap[p.status] || p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <FormattedDate date={p.deadline} fallback="Sem prazo" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/engineering/received-projects/${p.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {p.status === 'PENDING' && (
                        <Button variant="ghost" size="sm" title="Aceitar e Iniciar" className="text-primary">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {(p.status === 'DESIGNING' || p.status === 'HOMOLOGATING') && (
                        <Button variant="ghost" size="sm" title="Enviar para Revisão" className="text-emerald-600">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação Simples */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} projeto(s) recebido(s)</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próximo <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
