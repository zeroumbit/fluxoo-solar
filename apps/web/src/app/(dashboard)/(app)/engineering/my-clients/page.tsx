// @ts-nocheck
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
import { Search, Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const projects = [
  { client: 'João Silva', project: 'Residencial 5kWp', status: 'Design', value: 'R$ 1.200', date: '01/04/2025' },
  { client: 'Maria Oliveira', project: 'Comercial 20kWp', status: 'Concluído', value: 'R$ 2.500', date: '25/03/2025' },
  { client: 'Carlos Souza', project: 'Residencial 8kWp', status: 'Homologação', value: 'R$ 1.800', date: '28/03/2025' },
  { client: 'Ana Santos', project: 'Industrial 50kWp', status: 'Prospecção', value: 'R$ 5.000', date: '30/03/2025' },
  { client: 'Pedro Lima', project: 'Residencial 3kWp', status: 'Instalado', value: 'R$ 1.200', date: '15/03/2025' },
]

const statusColors: Record<string, string> = {
  'Prospecção': 'bg-slate-100 text-slate-700',
  'Design': 'bg-blue-100 text-blue-700',
  'Homologação': 'bg-purple-100 text-purple-700',
  'Instalado': 'bg-teal-100 text-teal-700',
  'Concluído': 'bg-emerald-100 text-emerald-700',
}

export default function MyClientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = projects.filter((p) => {
    const matchSearch = p.client.toLowerCase().includes(search.toLowerCase()) ||
                        p.project.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Buscar por cliente ou projeto..."
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
            <SelectItem value="Prospecção">Prospecção</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Homologação">Homologação</SelectItem>
            <SelectItem value="Instalado">Instalado</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Cliente</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{p.client}</TableCell>
                  <TableCell className="text-sm">{p.project}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status] || ''} hover:${statusColors[p.status] || ''}`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{p.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/engineering/my-clients/detail`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
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
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} projeto(s)</p>
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
