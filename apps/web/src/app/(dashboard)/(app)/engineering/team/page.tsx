'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Edit, Trash2, Send, Users, Loader2, Search } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const teamApi = {
  async listMembers() {
    const response = await fetch(`${API_URL}/team/members`)
    if (!response.ok) throw new Error('Não foi possível carregar a equipe')
    return response.json()
  },
  async inviteMember(email: string, role: string) {
    const response = await fetch(`${API_URL}/team/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    })
    if (!response.ok) throw new Error('Erro ao convidar membro')
    return response.json()
  },
  async removeMember(userId: string) {
    const response = await fetch(`${API_URL}/team/members/${userId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao remover membro')
    return response.json()
  }
}

const roleLabels: Record<string, string> = {
  'OWNER': 'Dono',
  'MANAGER': 'Gerente',
  'ENGINEER': 'Engenheiro',
  'DRAFTSMAN': 'Desenhista',
  'ASSISTANT_DESIGNER': 'Assistente de Design',
  'FINANCE': 'Financeiro',
  'SALES': 'Vendas'
}

const roleColors: Record<string, string> = {
  'OWNER': 'bg-purple-100 text-purple-700',
  'MANAGER': 'bg-blue-100 text-blue-700',
  'ENGINEER': 'bg-emerald-100 text-emerald-700',
  'DRAFTSMAN': 'bg-teal-100 text-teal-700',
  'ASSISTANT_DESIGNER': 'bg-slate-100 text-slate-700',
  'FINANCE': 'bg-amber-100 text-amber-700',
  'SALES': 'bg-green-100 text-green-700'
}

export default function TeamPage() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'ENGINEER' })
  const queryClient = useQueryClient()

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => teamApi.listMembers()
  })

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      teamApi.inviteMember(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
      setOpen(false)
      setNewMember({ name: '', email: '', role: 'ENGINEER' })
    }
  })

  const removeMutation = useMutation({
    mutationFn: (userId: string) => teamApi.removeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] })
    }
  })

  const filteredMembers = members.filter((m: any) => {
    const name = m.profiles?.name || ''
    const email = m.profiles?.email || ''
    return name.toLowerCase().includes(search.toLowerCase()) ||
           email.toLowerCase().includes(search.toLowerCase())
  })

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

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              Nenhum membro encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Desde</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((m: any) => (
                  <TableRow key={m.user_id}>
                    <TableCell className="font-medium">
                      {m.profiles?.name || 'Sem nome'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {m.profiles?.email || ''}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[m.role] || 'bg-slate-100 text-slate-700'}>
                        {roleLabels[m.role] || m.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {m.role !== 'OWNER' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeMutation.mutate(m.user_id)}
                            disabled={removeMutation.isPending}
                          >
                            {removeMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
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
              <Input
                placeholder="Nome do funcionário"
                value={newMember.name}
                onChange={e => setNewMember(p => ({...p, name: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="email@empresa.com"
                value={newMember.email}
                onChange={e => setNewMember(p => ({...p, email: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select
                value={newMember.role}
                onValueChange={v => setNewMember(p => ({...p, role: v}))}
              >
                <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">Gerente</SelectItem>
                  <SelectItem value="ENGINEER">Engenheiro</SelectItem>
                  <SelectItem value="DRAFTSMAN">Desenhista</SelectItem>
                  <SelectItem value="ASSISTANT_DESIGNER">Assistente de Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => inviteMutation.mutate({ email: newMember.email, role: newMember.role })}
              disabled={inviteMutation.isPending || !newMember.email}
            >
              {inviteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
