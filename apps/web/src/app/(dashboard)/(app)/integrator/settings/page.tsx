// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { onboardingApi } from '@/lib/api/onboarding'
import { Building2, MapPin, CreditCard, ShieldCheck, Save, Settings2, Search } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function IntegratorSettingsPage() {
  const [autoApproval, setAutoApproval] = useState(false)
  const [requireArt, setRequireArt] = useState(true)
  const [loadingCep, setLoadingCep] = useState(false)
  const [address, setAddress] = useState({
    cep: '04578-000',
    logradouro: 'Av. Engenheiro Luís Carlos Berrini',
    numero: '105',
    complemento: 'Andar 12',
    bairro: 'Brooklin',
    cidade: 'São Paulo',
    uf: 'SP'
  })

  const handleCepSearch = async () => {
    const cleanCep = address.cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    setLoadingCep(true)
    try {
      const data = await onboardingApi.getCepData(cleanCep)
      if (data.erro) {
        toast({ title: 'CEP não encontrado', variant: 'destructive' })
      } else {
        setAddress(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || 'SP'
        }))
      }
    } catch (err) {
      toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
    } finally {
      setLoadingCep(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie os dados e regras da sua integradora</p>
      </div>

      {/* Seção 1 - Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Dados da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input placeholder="Razão social" defaultValue="SolarMax Soluções em Energia LTDA" />
            </div>
            <div className="space-y-2">
              <Label>Nome Fantasia</Label>
              <Input placeholder="Nome fantasia" defaultValue="SolarMax" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="00.000.000/0000-00" defaultValue="45.123.789/0001-44" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" defaultValue="(11) 3344-5566" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button size="sm"><Save className="w-4 h-4 mr-2" /> Salvar alterações</Button>
        </CardFooter>
      </Card>

      {/* Seção 2 - Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="00000-000" 
                  value={address.cep} 
                  onChange={(e) => setAddress(prev => ({ ...prev, cep: e.target.value }))}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCepSearch} 
                  disabled={loadingCep}
                >
                  <Search className={`w-4 h-4 ${loadingCep ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Logradouro</Label>
              <Input 
                placeholder="Rua / Avenida" 
                value={address.logradouro} 
                onChange={(e) => setAddress(prev => ({ ...prev, logradouro: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input 
                placeholder="Nº" 
                value={address.numero} 
                onChange={(e) => setAddress(prev => ({ ...prev, numero: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input 
                placeholder="Apto, Sala" 
                value={address.complemento} 
                onChange={(e) => setAddress(prev => ({ ...prev, complemento: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input 
                placeholder="Bairro" 
                value={address.bairro} 
                onChange={(e) => setAddress(prev => ({ ...prev, bairro: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input 
                placeholder="Cidade" 
                value={address.cidade} 
                onChange={(e) => setAddress(prev => ({ ...prev, cidade: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={address.uf} 
                onValueChange={(uf) => setAddress(prev => ({ ...prev, uf }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {estados.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button size="sm"><Save className="w-4 h-4 mr-2" /> Salvar alterações</Button>
        </CardFooter>
      </Card>

      {/* Seção 3 - Plano de Assinatura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Plano de Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Plano atual:</p>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold px-3">PRO</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Próximo vencimento: 15/05/2026</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Alterar plano</Button>
              <Button variant="outline" size="sm">Histórico de pagamentos</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 4 - Regras de Negócio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Regras de Negócio
          </CardTitle>
          <CardDescription>Automatize processos e defina critérios de aprovação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto-aprovação de documentos</Label>
              <p className="text-xs text-muted-foreground italic">Permite que documentos básicos sejam marcados como conferidos automaticamente</p>
            </div>
            <Switch checked={autoApproval} onCheckedChange={setAutoApproval} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Exigir ART do CREA</Label>
              <p className="text-xs text-muted-foreground italic">Bloqueia o avanço do status se o documento ART não estiver presente</p>
            </div>
            <Switch checked={requireArt} onCheckedChange={setRequireArt} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Níveis de aprovação</Label>
            <Select defaultValue="1">
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Nível</SelectItem>
                <SelectItem value="2">2 Níveis</SelectItem>
                <SelectItem value="3">3 Níveis (Complexo)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Define quantos usuários precisam aprovar um projeto antes do próximo estágio</p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button size="sm"><Save className="w-4 h-4 mr-2" /> Salvar regras</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function Separator() {
  return <div className="h-px bg-border w-full" />
}
