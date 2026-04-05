// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Building2, Search, Plus, MoreVertical, Eye, Edit, Ban, 
  MapPin, Phone, Mail, Activity, Database, CheckCircle2 
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function SuperAdminTenants() {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  const tenants = [
    { id: '1', nome: "SolarTech Brasil", cnpj: "12.345.678/0001-90", tipo: "Integradora", status: "Ativo", plano: "Pro", location: "São Paulo, SP" },
    { id: '2', nome: "Engenharia Luz", cnpj: "98.765.432/0001-10", tipo: "Engenharia", status: "Pendente", plano: "Starter", location: "Rio de Janeiro, RJ" },
    { id: '3', nome: "Revenda Sul", cnpj: "45.678.901/0001-23", tipo: "Revenda", status: "Suspenso", plano: "Enterprise", location: "Curitiba, PR" },
  ]

  const openDetails = (tenant: any) => {
    setSelectedTenant(tenant)
    setDetailsModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h1>
          <p className="text-muted-foreground mt-1">Gerencie todas as empresas da plataforma.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Empresa
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar por nome ou CNPJ..." className="pl-9 w-full" />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select defaultValue="all-types">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Todos os Tipos</SelectItem>
                  <SelectItem value="integrator">Integradora</SelectItem>
                  <SelectItem value="engineering">Engenharia</SelectItem>
                  <SelectItem value="reseller">Revenda</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-status">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Nome</th>
                  <th className="px-4 py-3 font-medium">CNPJ</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Plano</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tenants.map((tenant, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{tenant.nome}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{tenant.cnpj}</td>
                    <td className="px-4 py-3 text-slate-600">{tenant.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tenant.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 
                        tenant.status === 'Suspenso' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{tenant.plano}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetails(tenant)}>
                            <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status === 'Suspenso' ? (
                            <DropdownMenuItem className="text-emerald-600 focus:text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Reativar Empresa
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-rose-600 focus:text-rose-700">
                              <Ban className="w-4 h-4 mr-2" /> Suspender
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-slate-500">Mostrando 1 a 3 de 142 empresas</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTenant && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedTenant.nome}</DialogTitle>
                    <DialogDescription className="font-mono text-sm">{selectedTenant.cnpj}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Mail className="w-4 h-4" /> contato@empresa.com
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 mt-1">
                      <Phone className="w-4 h-4" /> (11) 98765-4321
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</span>
                    <div className="flex items-start gap-2 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> 
                      <span>{selectedTenant.location}<br/>Brasil</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl grid grid-cols-3 gap-4 border border-slate-100">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Briefcase className="w-5 h-5 text-primary mb-1" />
                    <span className="text-xl font-bold text-slate-900">42</span>
                    <span className="text-xs text-slate-500">Projetos Ativos</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <Activity className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-xl font-bold text-slate-900">12</span>
                    <span className="text-xs text-slate-500">Usuários Ativos</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <Database className="w-5 h-5 text-indigo-500 mb-1" />
                    <span className="text-xl font-bold text-slate-900">4.2GB</span>
                    <span className="text-xs text-slate-500">Storage Usado</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4">
                <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700">Excluir Empresa</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>Cancelar</Button>
                  {selectedTenant.status === 'Suspenso' ? (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Reativar Acesso</Button>
                  ) : (
                    <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">Suspender</Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
