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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Plus, Eye, ArrowUpRight, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { toast } from '@/hooks/use-toast'

interface Project {
  id: string
  code: string
  status: string
  created_at: string
  client: { name: string }
  reseller?: { name: string }
}

const statusColors: Record<string, string> = {
  'PROSPECTING': 'bg-slate-100 text-slate-700',
  'DESIGNING': 'bg-blue-100 text-blue-700',
  'HOMOLOGATING': 'bg-purple-100 text-purple-700',
  'INSTALLED': 'bg-teal-100 text-teal-700',
  'COMPLETED': 'bg-emerald-100 text-emerald-700',
}

const statusLabelMap: Record<string, string> = {
  'PROSPECTING': 'Prospecção',
  'DESIGNING': 'Design',
  'HOMOLOGATING': 'Homologação',
  'INSTALLED': 'Instalado',
  'COMPLETED': 'Concluído',
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [resellerFilter, setResellerFilter] = useState('all')
  const [openModal, setOpenModal] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [cpf, setCpf] = useState('')

  const { data: projectsData, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects', { status: statusFilter, search }],
    queryFn: () => projectsApi.list({ 
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined
    }),
  })

  const filtered = projectsData || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie todos os projetos da sua integradora</p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por código, cliente ou revendedor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PROSPECTING">Prospecção</SelectItem>
            <SelectItem value="DESIGNING">Design</SelectItem>
            <SelectItem value="HOMOLOGATING">Homologação</SelectItem>
            <SelectItem value="INSTALLED">Instalado</SelectItem>
            <SelectItem value="COMPLETED">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resellerFilter} onValueChange={setResellerFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Revendedor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="LuzSol Revenda">LuzSol Revenda</SelectItem>
            <SelectItem value="NovaSol">NovaSol</SelectItem>
            <SelectItem value="Direto">Direto</SelectItem>
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
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Revendedor</TableHead>
                <TableHead className="hidden md:table-cell">Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                          <TableCell colSpan={6} className="h-12 bg-slate-50/50" />
                      </TableRow>
                  ))
              ) : filtered.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum projeto encontrado.</TableCell>
                  </TableRow>
              ) : filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 text-sm">
                  <TableCell className="font-mono font-semibold">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.client?.name}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[p.status] || 'bg-slate-100'} hover:opacity-80 transition-opacity`}>
                        {statusLabelMap[p.status] || p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.reseller?.name || 'Venda Direta'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{new Date(p.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild title="Ver detalhes">
                        <Link href={`/integrator/projects/${p.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary" title="Avançar status">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500" title="Chat">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} projeto(s)</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">Próximo <ChevronRight className="w-4 h-4 ml-1" /></Button>
        </div>
      </div>

      {/* Modal Novo Projeto */}
      <Dialog open={openModal} onOpenChange={(val) => {
        setOpenModal(val)
        if (!val) setShowNewClientForm(false)
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Novo Projeto</DialogTitle></DialogHeader>
          
          {!showNewClientForm ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Buscar cliente por CPF</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="000.000.000-00" 
                    value={cpf} 
                    onChange={(e) => setCpf(e.target.value)} 
                    className="flex-1" 
                  />
                  <Button variant="outline" onClick={() => {
                    if (cpf.endsWith('99')) {
                        setShowNewClientForm(true)
                    } else {
                        toast({ title: 'Cliente não encontrado', description: 'Tente cadastrar um novo cliente.'})
                    }
                  }}>
                    Buscar
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground uppercase font-semibold">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button 
                variant="ghost" 
                className="text-sm text-primary hover:underline hover:bg-primary/5 w-full h-auto py-2"
                onClick={() => setShowNewClientForm(true)}
              >
                Cadastrar novo cliente
              </Button>

              <div className="space-y-2 pt-2">
                <Label>Revendedor responsável (opcional)</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecione o revendedor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luzSol">LuzSol Revenda</SelectItem>
                    <SelectItem value="novaSol">NovaSol</SelectItem>
                    <SelectItem value="direto">Sem revendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="gap-2 pt-4">
                <Button variant="outline" onClick={() => setOpenModal(false)}>Cancelar</Button>
                <Button onClick={() => setOpenModal(false)}>Criar Projeto</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-2 animate-in fade-in slide-in-from-right-4 duration-300">
               <p className="text-sm text-muted-foreground mb-2">Cliente não encontrado. Preencha os dados abaixo:</p>
               
               <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold text-slate-500">Nome Completo</Label>
                    <Input placeholder="Ex: João da Silva" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs uppercase font-bold text-slate-500">CPF</Label>
                        <Input placeholder="000.000.000-00" value={cpf} readOnly />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs uppercase font-bold text-slate-500">E-mail</Label>
                        <Input type="email" placeholder="joao@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs uppercase font-bold text-slate-500">Telefone</Label>
                        <Input placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs uppercase font-bold text-slate-500">CEP</Label>
                        <div className="flex gap-1">
                            <Input placeholder="00000-000" />
                            <Button size="icon" variant="ghost" className="shrink-0"><Search className="w-4 h-4" /></Button>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold text-slate-500">Endereço Completo</Label>
                    <Input placeholder="Rua, Número, Bairro, Cidade - UF" />
                  </div>
               </div>

               <DialogFooter className="gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewClientForm(false)}>Voltar</Button>
                <Button onClick={() => {
                    setShowNewClientForm(false)
                    setOpenModal(false)
                }}>Cadastrar e Criar Projeto</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
