// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Users, FolderOpen, Zap, DollarSign, Loader2, Trash } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { plansApi } from '@/lib/api/plans'
import { useToast } from '@/hooks/use-toast'

export default function SuperAdminPlans() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [planToDelete, setPlanToDelete] = useState<any>(null)
  const [deletedPlanName, setDeletedPlanName] = useState('')

  // 1. Fetch real plans
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['super-admin-plans'],
    queryFn: () => plansApi.list(),
  })

  // 2. Mutations
  const createOrUpdateMutation = useMutation({
    mutationFn: (data) => selectedPlan ? plansApi.update(selectedPlan.id, data) : plansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['super-admin-plans'])
      setPlanModalOpen(false)
      toast({ title: 'Plano salvo com sucesso!' })
    },
    onError: (err) => toast({ title: 'Erro ao salvar plano', description: err.message, variant: 'destructive' })
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => plansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['super-admin-plans'])
      setDeleteDialogOpen(false)
      setDeletedPlanName(planToDelete?.name || 'Plano')
      setSuccessDialogOpen(true)
      setPlanToDelete(null)
    },
    onError: (err) => toast({ title: 'Erro ao excluir', description: err.message, variant: 'destructive' })
  })

  const openPlanModal = (plan?: any) => {
    setSelectedPlan(plan || null)
    setDeleteDialogOpen(false)
    setPlanModalOpen(true)
  }

  const openDeleteDialog = (plan: any) => {
    setPlanToDelete(plan)
    setPlanModalOpen(false)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id)
      setDeleteDialogOpen(false)
      setPlanToDelete(null)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      slug: formData.get('name').toLowerCase().replace(/ /g, '-'),
      price_cents: Math.round(parseFloat(formData.get('price').replace(',', '.')) * 100),
      target_type: formData.get('target_type'),
      max_users: parseInt(formData.get('max_users')),
      max_projects: parseInt(formData.get('max_projects') || 999999),
      extra_user_price_cents: Math.round(parseFloat(formData.get('extra_user_price').replace(',', '.')) * 100),
      is_active: formData.get('status') === 'ativo',
      features: (formData.get('features') || '').split(',').map(f => f.trim()).filter(f => f !== '')
    }
    createOrUpdateMutation.mutate(data)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Planos e Assinaturas Real</h1>
          <p className="text-muted-foreground mt-1">Gerencie os pacotes oferecidos aos inquilinos.</p>
        </div>
        <Button onClick={() => openPlanModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Plano
        </Button>
      </div>

      {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative flex flex-col hover:shadow-md transition-all border-none bg-slate-50/50">
            {!plan.is_active && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">
                Inativo
              </div>
            )}
            <CardHeader>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{plan.target_type}</div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-slate-900 block mt-2">R$ {(plan.price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="text-sm">/mês</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-700">
                  <Users className="w-4 h-4 mr-2 text-slate-400" />
                  Max Usuários: <span className="font-semibold ml-1">{plan.max_users}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <FolderOpen className="w-4 h-4 mr-2 text-slate-400" />
                  Max Projetos: <span className="font-semibold ml-1">{plan.max_projects >= 9999 ? 'Ilimitado' : plan.max_projects}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                  Usuário Extra: <span className="font-semibold ml-1">R$ {(plan.extra_user_price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <ul className="space-y-2">
                  {(plan.features || []).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <Zap className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => openPlanModal(plan)} variant="outline" className="w-full bg-white">
                <Edit className="w-4 h-4 mr-2" /> Editar Plano
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do plano no banco de dados.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input id="name" name="name" defaultValue={selectedPlan?.name} placeholder="Ex: Starter, Pro, Enterprise" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço Mensal (R$)</Label>
                  <Input id="price" name="price" defaultValue={selectedPlan ? (selectedPlan.price_cents / 100).toFixed(2) : ''} placeholder="0,00" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target_type">Público-alvo (Para)</Label>
                  <Select name="target_type" defaultValue={selectedPlan?.target_type || 'INTEGRATOR'}>
                    <SelectTrigger id="target_type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTEGRATOR">Integradora</SelectItem>
                      <SelectItem value="ENGINEERING_FIRM">Engenharia</SelectItem>
                      <SelectItem value="RESELLER">Revendedora</SelectItem>
                      <SelectItem value="ANY">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max_users">Máx. de Usuários</Label>
                  <Input id="max_users" name="max_users" type="number" defaultValue={selectedPlan?.max_users} placeholder="Ex: 5" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_projects">Máx. de Projetos</Label>
                  <Input id="max_projects" name="max_projects" type="number" defaultValue={selectedPlan?.max_projects < 9999 ? selectedPlan?.max_projects : ''} placeholder="Deixe vazio para Ilimitado" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="extra_user_price">Valor por Usuário Extra (R$)</Label>
                <Input id="extra_user_price" name="extra_user_price" defaultValue={selectedPlan ? (selectedPlan.extra_user_price_cents / 100).toFixed(2) : ''} placeholder="0,00" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="features">Vantagens (Features) - Separadas por vírgula</Label>
                <Input id="features" name="features" defaultValue={selectedPlan?.features?.join(', ')} placeholder="Ex: Projetos Ilimitados, Suporte 24h" />
              </div>

              <div className="grid gap-2 mt-2">
                <Label>Status do Plano</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                      <input type="radio" name="status" value="ativo" defaultChecked={selectedPlan?.is_active !== false} /> Ativo
                  </label>
                  <label className="flex items-center gap-2">
                      <input type="radio" name="status" value="inativo" defaultChecked={selectedPlan?.is_active === false} /> Inativo
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4">
              {selectedPlan ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => openDeleteDialog(selectedPlan)}
                  disabled={deleteMutation.isLoading}
                >
                  <Trash className="w-4 h-4 mr-2" /> Excluir
                </Button>
              ) : <div></div>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setPlanModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createOrUpdateMutation.isLoading}>
                    {createOrUpdateMutation.isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Salvar Plano
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-rose-600" /> Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o plano <span className="font-semibold text-slate-900">{planToDelete?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-rose-700">
                ⚠️ Esta ação não pode ser desfeita. Todos os dados associados a este plano serão removidos permanentemente.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setPlanToDelete(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Sim, Excluir Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
          <div className="flex flex-col items-center text-center py-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Plano Excluído com Sucesso!
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-slate-500 text-base leading-relaxed mb-6">
              O plano <span className="font-semibold text-slate-900">{deletedPlanName}</span> foi removido permanentemente da plataforma.
            </DialogDescription>

            {/* Info Box */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 text-left">
                  Esta ação não pode ser desfeita. Os usuários associados a este plano deverão ser realocados.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => setSuccessDialogOpen(false)} 
              className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
