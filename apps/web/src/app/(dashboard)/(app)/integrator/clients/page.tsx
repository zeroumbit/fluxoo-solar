// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Search, Plus, Eye, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const clients = [
  { name: 'João Silva', cpf: '***.***.***-01', phone: '(11) 99999-8888', projects: 2, lastAccess: '04/04/2025 14:32' },
  { name: 'Maria Oliveira', cpf: '***.***.***-02', phone: '(11) 98888-7777', projects: 1, lastAccess: '03/04/2025 09:15' },
  { name: 'Carlos Souza', cpf: '***.***.***-03', phone: '(11) 97777-6666', projects: 3, lastAccess: '02/04/2025 16:00' },
  { name: 'Ana Santos', cpf: '***.***.***-04', phone: '(21) 96666-5555', projects: 1, lastAccess: '01/04/2025 11:20' },
  { name: 'Pedro Lima', cpf: '***.***.***-05', phone: '(31) 95555-4444', projects: 2, lastAccess: '30/03/2025 08:45' },
  { name: 'Fernanda Costa', cpf: '***.***.***-06', phone: '(11) 94444-3333', projects: 1, lastAccess: '29/03/2025 17:00' },
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Base de clientes da sua integradora</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Novo Cliente</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, CPF ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">CPF</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead>Projetos</TableHead>
                <TableHead className="hidden lg:table-cell">Último acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-sm text-muted-foreground">{c.cpf}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{c.phone}</TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">{c.projects}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{c.lastAccess}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-primary"><MessageSquare className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} cliente(s)</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">Próximo <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>
      </div>
    </div>
  )
}
