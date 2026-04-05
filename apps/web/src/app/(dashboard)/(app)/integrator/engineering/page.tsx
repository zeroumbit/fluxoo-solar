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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, CheckCircle, Bell, Wrench, Eye } from 'lucide-react'

const activeProjects = [
  { project: '#2025-00128', engineering: 'Carla Engenharia', status: 'Em andamento', deadline: '10/04/2025', delivered: false },
  { project: '#2025-00129', engineering: 'TechSolar Eng.', status: 'Revisão', deadline: '08/04/2025', delivered: true },
  { project: '#2025-00130', engineering: 'Carla Engenharia', status: 'Pendente docs', deadline: '12/04/2025', delivered: false },
]

const companies = [
  { name: 'Carla Engenharia', rating: 4.9, reviews: 142, avgDays: 5, specialty: 'Residencial', city: 'São Paulo, SP', price: 'R$ 1.200' },
  { name: 'TechSolar Eng.', rating: 4.7, reviews: 98, avgDays: 7, specialty: 'Comercial', city: 'Campinas, SP', price: 'R$ 2.500' },
  { name: 'SunForce Projetos', rating: 4.5, reviews: 63, avgDays: 10, specialty: 'Industrial', city: 'Guarulhos, SP', price: 'R$ 5.000' },
  { name: 'EcoDesign Solar', rating: 4.8, reviews: 112, avgDays: 6, specialty: 'Residencial', city: 'Santos, SP', price: 'R$ 1.400' },
]

export default function EngineeringPage() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('all')

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchSpec = specialty === 'all' || c.specialty === specialty
    return matchSearch && matchSpec
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Engenharia Terceirizada</h1>
        <p className="text-muted-foreground">Gerencie projetos com empresas de engenharia parceiras</p>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projetos com Engenharia</TabsTrigger>
          <TabsTrigger value="search">Buscar Empresas</TabsTrigger>
        </TabsList>

        {/* Aba 1: Projetos ativos */}
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
                    <TableHead>Entregue</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProjects.map((p) => (
                    <TableRow key={p.project}>
                      <TableCell className="font-mono text-sm font-semibold">{p.project}</TableCell>
                      <TableCell className="font-medium">{p.engineering}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.deadline}</TableCell>
                      <TableCell>
                        {p.delivered ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Sim</Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-amber-600">
                            <Bell className="w-4 h-4" />
                          </Button>
                          {p.delivered && (
                            <Button variant="ghost" size="sm" className="text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {!p.delivered && (
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <Wrench className="w-4 h-4" />
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
        </TabsContent>

        {/* Aba 2: Buscar empresas */}
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou especialidade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Especialidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Residencial">Residencial</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <Card key={c.name} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.city}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{c.specialty}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{c.rating}</span>
                      <span className="text-muted-foreground">({c.reviews})</span>
                    </div>
                    <span className="text-muted-foreground">Prazo médio: <strong>{c.avgDays} dias</strong></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">A partir de <strong className="text-primary">{c.price}</strong></p>
                    <Button size="sm">Contratar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
