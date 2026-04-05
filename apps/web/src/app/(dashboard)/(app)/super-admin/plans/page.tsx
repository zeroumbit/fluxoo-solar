'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Users, FolderOpen, Zap, DollarSign } from 'lucide-react'
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

export default function SuperAdminPlans() {
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const plans = [
    { 
      id: '1', nome: "Starter", preco: "R$ 199,90", usuarios: 3, projetos: 10,  
      para: "Integradora", extraUser: "R$ 49,90", status: "Ativo",
      features: ["3 usuários inclusos", "Até 10 projetos ativos", "Suporte email"]
    },
    { 
      id: '2', nome: "Pro", preco: "R$ 499,90", usuarios: 10, projetos: 50,  
      para: "Integradora", extraUser: "R$ 39,90", status: "Ativo",
      features: ["10 usuários inclusos", "Até 50 projetos ativos", "Suporte prioritário"]
    },
    { 
      id: '3', nome: "Enterprise Engineering", preco: "R$ 899,90", usuarios: 25, projetos: "Ilimitado",  
      para: "Engenharia", extraUser: "R$ 29,90", status: "Ativo",
      features: ["25 usuários inclusos", "Projetos ilimitados", "Assinatura Digital inclusa", "API Access"]
    },
  ]

  const openPlanModal = (plan?: any) => {
    setSelectedPlan(plan || null)
    setPlanModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Planos e Assinaturas</h1>
          <p className="text-muted-foreground mt-1">Gerencie os pacotes oferecidos aos inquilinos.</p>
        </div>
        <Button onClick={() => openPlanModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative flex flex-col hover:shadow-md transition-all">
            {plan.status !== 'Ativo' && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">
                Inativo
              </div>
            )}
            <CardHeader>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{plan.para}</div>
              <CardTitle className="text-2xl">{plan.nome}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-slate-900 block mt-2">{plan.preco}</span>
                <span className="text-sm">/mês</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-700">
                  <Users className="w-4 h-4 mr-2 text-slate-400" />
                  Max Usuários: <span className="font-semibold ml-1">{plan.usuarios}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <FolderOpen className="w-4 h-4 mr-2 text-slate-400" />
                  Max Projetos: <span className="font-semibold ml-1">{plan.projetos}</span>
                </div>
                <div className="flex items-center text-sm text-slate-700">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                  Usuário Extra: <span className="font-semibold ml-1">{plan.extraUser}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <Zap className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => openPlanModal(plan)} variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" /> Editar Plano
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do plano. Alterações afetam novas assinaturas imediatamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input id="nome" defaultValue={selectedPlan?.nome} placeholder="Ex: Starter, Pro, Enterprise" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="preco">Preço Mensal (R$)</Label>
                <Input id="preco" defaultValue={selectedPlan ? selectedPlan.preco.replace('R$ ', '') : ''} placeholder="0,00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="para">Público-alvo (Para)</Label>
                <Select defaultValue={selectedPlan?.para || 'integrator'}>
                  <SelectTrigger id="para">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="integrator">Integradora</SelectItem>
                    <SelectItem value="engineering">Engenharia</SelectItem>
                    <SelectItem value="reseller">Revendedora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_users">Máx. de Usuários</Label>
                <Input id="max_users" type="number" defaultValue={selectedPlan?.usuarios} placeholder="Ex: 5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_projects">Máx. de Projetos</Label>
                <Input id="max_projects" type="number" defaultValue={selectedPlan?.projetos !== 'Ilimitado' ? selectedPlan?.projetos : ''} placeholder="Deixe vazio para Ilimitado" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="extra_user">Valor por Usuário Extra (R$)</Label>
              <Input id="extra_user" defaultValue={selectedPlan ? selectedPlan.extraUser.replace('R$ ', '') : ''} placeholder="0,00" />
            </div>

            <div className="grid gap-2 mt-2">
              <Label>Status do Plano</Label>
              <RadioGroup defaultValue={selectedPlan?.status === 'Inativo' ? 'inativo' : 'ativo'} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ativo" id="r-ativo" />
                  <Label htmlFor="r-ativo" className="font-normal">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inativo" id="r-inativo" />
                  <Label htmlFor="r-inativo" className="font-normal text-slate-500">Inativo</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4">
            {selectedPlan ? (
              <Button variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">Excluir</Button>
            ) : <div></div>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPlanModalOpen(false)}>Cancelar</Button>
              <Button>Salvar Plano</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
