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
import { Search, Eye, Play, Send, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const projects = [
  { code: '#2025-00123', integrator: 'SolarPrime', status: 'Pendente', deadline: '2025-04-10', type: 'Residencial' },
  { code: '#2025-00124', integrator: 'EcoSolar', status: 'Design', deadline: '2025-04-08', type: 'Comercial' },
  { code: '#2025-00125', integrator: 'SunTech', status: 'Homologação', deadline: '2025-04-15', type: 'Industrial' },
  { code: '#2025-00126', integrator: 'SolarPrime', status: 'Concluído', deadline: '2025-03-28', type: 'Residencial' },
  { code: '#2025-00127', integrator: 'GreenPower', status: 'Design', deadline: '2025-04-12', type: 'Comercial' },
  { code: '#2025-00128', integrator: 'EcoSolar', status: 'Instalado', deadline: '2025-04-20', type: 'Residencial' },
]

const statusColors: Record<string, string> = {
  'Pendente': 'bg-amber-100 text-amber-700',
  'Design': 'bg-blue-100 text-blue-700',
  'Homologação': 'bg-purple-100 text-purple-700',
  'Instalado': 'bg-teal-100 text-teal-700',
  'Concluído': 'bg-emerald-100 text-emerald-700',
}

export default function ReceivedProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = projects.filter((p) => {
    const matchSearch = p.code.toLowerCase().includes(search.toLowerCase()) ||
                        p.integrator.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projetos Recebidos</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Trabalhos solicitados por integradoras. O cliente final é sigiloso.
        </p>
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
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
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
                <TableHead>Código</TableHead>
                <TableHead>Integradora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.code} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono text-sm font-semibold">{p.code}</TableCell>
                  <TableCell>{p.integrator}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{p.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status] || ''} hover:${statusColors[p.status] || ''}`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.deadline).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/engineering/received-projects/${p.code.replace('#', '')}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      {p.status === 'Pendente' && (
                        <Button variant="ghost" size="sm" className="text-primary">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {(p.status === 'Design' || p.status === 'Homologação') && (
                        <Button variant="ghost" size="sm" className="text-emerald-600">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum projeto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} projeto(s) encontrado(s)</p>
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
