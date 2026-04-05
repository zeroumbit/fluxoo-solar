// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Plus, Edit, Trash2, Send, Users } from 'lucide-react'

const team = [
  { name: 'Carla Mendes', email: 'carla@engenharia.com', role: 'Owner', permissions: 'Acesso total' },
  { name: 'Bruno Costa', email: 'bruno@engenharia.com', role: 'Engineer', permissions: 'Projetos, Documentos' },
  { name: 'Ana Paula', email: 'ana@engenharia.com', role: 'Draftsman', permissions: 'CAD, Upload' },
  { name: 'Lucas Silva', email: 'lucas@engenharia.com', role: 'Assistant Designer', permissions: 'Visualização' },
]

const roleColors: Record<string, string> = {
  'Owner': 'bg-purple-100 text-purple-700',
  'Manager': 'bg-blue-100 text-blue-700',
  'Engineer': 'bg-emerald-100 text-emerald-700',
  'Draftsman': 'bg-teal-100 text-teal-700',
  'Assistant Designer': 'bg-slate-100 text-slate-700',
}

export default function TeamPage() {
  const [open, setOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os membros da sua empresa de engenharia</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Convidar Funcionário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="hidden md:table-cell">Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((m, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                  <TableCell>
                    <Badge className={`${roleColors[m.role]} hover:${roleColors[m.role]}`}>{m.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{m.permissions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      {m.role !== 'Owner' && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Convidar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Convidar Funcionário
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input placeholder="Nome do funcionário" value={newMember.name} onChange={e => setNewMember(p => ({...p, name: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="email@empresa.com" value={newMember.email} onChange={e => setNewMember(p => ({...p, email: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select value={newMember.role} onValueChange={v => setNewMember(p => ({...p, role: v}))}>
                <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Draftsman">Draftsman</SelectItem>
                  <SelectItem value="Assistant Designer">Assistant Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>
              <Send className="w-4 h-4 mr-2" /> Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
