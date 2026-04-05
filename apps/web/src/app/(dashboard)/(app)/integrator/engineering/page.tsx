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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, CheckCircle, Bell, Wrench, Eye, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { tenantsApi } from '@/lib/api/tenants'
import { toast } from '@/hooks/use-toast'
import { FormattedDate } from '@/components/ui/formatted-date'

export default function EngineeringPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('all')
  const [selectedFirm, setSelectedFirm] = useState(null)
  const [openDelegateModal, setOpenDelegateModal] = useState(false)

  // 1. Buscar empresas de engenharia parceiras
  const { data: firms = [], isLoading: isLoadingFirms } = useQuery({
    queryKey: ['engineering-firms', { search, specialty }],
    queryFn: () => tenantsApi.listEngineeringFirms({ 
      search: search || undefined,
      specialty: specialty === 'all' ? undefined : specialty
    }),
  })

  // 2. Buscar projetos que ESTÃO delegados para engenharia
  const { data: allProjects = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['projects-with-engineering'],
    queryFn: () => projectsApi.list()
  })

  // Filtrar apenas projetos que tem um delegado
  const projectsWithEngineering = allProjects.filter(p => !!p.delegated_engineering_tenant_id)
  
  // 3. Buscar projetos que PODEM ser delegados (que ainda não tem engenharia)
  const evaluableProjects = allProjects.filter(p => !p.delegated_engineering_tenant_id && p.status === 'PROSPECTING' || p.status === 'DESIGNING')

  // 4. Mutação para delegar
  const delegateMutation = useMutation({
    mutationFn: ({ projectId, firmId }) => projectsApi.delegate(projectId, firmId),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects-with-engineering'])
      toast({ title: 'Projeto delegado com sucesso!' })
      setOpenDelegateModal(false)
    },
    onError: (err) => {
        toast({ title: 'Erro ao delegar', description: err.message, variant: 'destructive' })
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engenharia Terceirizada</h1>
          <p className="text-muted-foreground">Gerencie projetos com empresas de engenharia parceiras</p>
        </div>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projetos com Engenharia</TabsTrigger>
          <TabsTrigger value="search">Buscar Empresas</TabsTrigger>
        </TabsList>

        {/* Aba 1: Projetos ativos delegados */}
        <TabsContent value="projects" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Projeto</TableHead>
                    <TableHead>Engenharia</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingAll ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                  ) : projectsWithEngineering.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">Nenhum projeto delegado recentemente.</TableCell></TableRow>
                  ) : projectsWithEngineering.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm font-semibold">{p.code}</TableCell>
                      <TableCell className="font-medium">{p.engineering?.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs uppercase bg-slate-50">{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground"><FormattedDate date={p.deadline} fallback="Não definido" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild><a href={`/integrator/projects/${p.id}`}><Eye className="w-4 h-4" /></a></Button>
                          <Button variant="ghost" size="sm" className="text-amber-600"><Bell className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba 2: Buscar empresas e contratar */}
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={specialty} onValueChange={setSpecialty} className="w-[200px]">
              <SelectTrigger><SelectValue placeholder="Especialidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Especialidades</SelectItem>
                <SelectItem value="Residencial">Residencial</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {isLoadingFirms ? (
                Array(4).fill(0).map((_, i) => <Card key={i} className="h-40 animate-pulse bg-slate-50" />)
            ) : firms.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-all border-none bg-slate-50/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{c.fantasy_name || c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.city || 'São Paulo, SP'}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-white">{c.specialty || 'Solar'}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-muted-foreground">(12)</span>
                    </div>
                    <span className="text-muted-foreground">Prazo: <strong>5 dias</strong></span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <p className="text-sm font-medium text-emerald-600">Sob consulta</p>
                    <Button size="sm" onClick={() => {
                        setSelectedFirm(c)
                        setOpenDelegateModal(true)
                    }}>
                        Contratar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Delegação */}
      <Dialog open={openDelegateModal} onOpenChange={setOpenDelegateModal}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <DialogTitle>Delegar Projeto para {selectedFirm?.fantasy_name || selectedFirm?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                  <p className="text-sm text-muted-foreground">Selecione um projeto para ser realizado por esta empresa de engenharia:</p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {evaluableProjects.length === 0 ? (
                          <div className="text-center py-6 text-sm text-muted-foreground italic border rounded-lg">Você não tem projetos pendentes de design.</div>
                      ) : evaluableProjects.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                              <div>
                                  <p className="text-sm font-bold">{p.code}</p>
                                  <p className="text-xs text-muted-foreground">{p.client?.name}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => delegateMutation.mutate({ projectId: p.id, firmId: selectedFirm.id })}
                                disabled={delegateMutation.isLoading}
                              >
                                  {delegateMutation.isLoading && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                                  Selecionar
                              </Button>
                          </div>
                      ))}
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  )
}
