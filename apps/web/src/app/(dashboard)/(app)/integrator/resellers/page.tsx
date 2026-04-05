// @ts-nocheck
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
import { onboardingApi } from '@/lib/api/onboarding'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Eye, Ban, Send, Search, Loader2 } from 'lucide-react'

const resellers = [
  { name: 'LuzSol Revenda', cnpj: '12.345.678/0001-90', commission: '8%', projects: 12, toPay: 'R$ 3.840', status: 'Ativo' },
  { name: 'NovaSol', cnpj: '98.765.432/0001-11', commission: '10%', projects: 8, toPay: 'R$ 6.400', status: 'Ativo' },
  { name: 'EnergiaBoa', cnpj: '45.678.901/0001-22', commission: '7%', projects: 0, toPay: 'R$ 0', status: 'Pendente' },
  { name: 'SolBravo', cnpj: '32.190.456/0001-44', commission: '9%', projects: 3, toPay: 'R$ 1.620', status: 'Suspenso' },
]

const statusColors: Record<string, string> = {
  'Ativo': 'bg-emerald-100 text-emerald-700',
  'Pendente': 'bg-amber-100 text-amber-700',
  'Suspenso': 'bg-red-100 text-red-700',
}

export default function ResellersPage() {
  const [open, setOpen] = useState(false)
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [form, setForm] = useState({ cnpj: '', name: '', email: '', commission: '' })

  const handleCnpjSearch = async () => {
    const cleanCnpj = form.cnpj.replace(/\D/g, '')
    if (cleanCnpj.length !== 14) return
    
    setLoadingCnpj(true)
    try {
      const data = await onboardingApi.getCnpjData(cleanCnpj)
      setForm(prev => ({
        ...prev,
        name: data.razao_social || data.nome_fantasia || ''
      }))
      toast({ title: 'Dados do CNPJ carregados!' })
    } catch (err) {
      toast({ title: 'Erro ao buscar CNPJ', variant: 'destructive' })
    } finally {
      setLoadingCnpj(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revendedores</h1>
          <p className="text-muted-foreground">Gerencie seus parceiros revendedores e comissões</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Revendedor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead className="hidden md:table-cell">Proj. no mês</TableHead>
                <TableHead>A pagar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map((r) => (
                <TableRow key={r.cnpj}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-sm text-muted-foreground">{r.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">{r.commission}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">{r.projects}</TableCell>
                  <TableCell className="font-mono text-sm font-semibold">{r.toPay}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[r.status]} hover:${statusColors[r.status]}`}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      {r.status !== 'Suspenso' && (
                        <Button variant="ghost" size="sm" className="text-red-500"><Ban className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Adicionar Revendedor</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="00.000.000/0000-00" 
                  value={form.cnpj} 
                  onChange={(e) => setForm(p => ({ ...p, cnpj: e.target.value }))} 
                  className="flex-1" 
                />
                <Button 
                  variant="outline" 
                  onClick={handleCnpjSearch}
                  disabled={loadingCnpj}
                >
                  {loadingCnpj ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nome da empresa</Label>
              <Input placeholder="Preenchido automaticamente" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>E-mail do responsável</Label>
              <Input type="email" placeholder="responsavel@empresa.com" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Comissão (%)</Label>
              <Input type="number" placeholder="Ex: 8" value={form.commission} onChange={(e) => setForm(p => ({ ...p, commission: e.target.value }))} />
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
