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
import { Building2, MapPin, CreditCard, ShieldCheck, Save } from 'lucide-react'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function SettingsPage() {
  const [hidePhones, setHidePhones] = useState(false)
  const [hideCpfs, setHideCpfs] = useState(false)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie os dados da sua empresa</p>
      </div>

      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Dados da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Razão Social</Label><Input placeholder="Razão social" defaultValue="Carla Engenharia LTDA" /></div>
            <div className="space-y-2"><Label>Nome Fantasia</Label><Input placeholder="Nome fantasia" defaultValue="Carla Engenharia" /></div>
            <div className="space-y-2"><Label>CNPJ</Label><Input placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-99" /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input placeholder="(00) 00000-0000" defaultValue="(11) 99999-5678" /></div>
          </div>
        </CardContent>
        <CardFooter><Button size="sm"><Save className="w-3 h-3 mr-1" /> Salvar</Button></CardFooter>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>CEP</Label><Input placeholder="00000-000" defaultValue="01310-100" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Logradouro</Label><Input placeholder="Rua / Avenida" defaultValue="Av. Paulista" /></div>
            <div className="space-y-2"><Label>Número</Label><Input placeholder="Nº" defaultValue="1000" /></div>
            <div className="space-y-2"><Label>Complemento</Label><Input placeholder="Apto, Sala" defaultValue="Sala 1501" /></div>
            <div className="space-y-2"><Label>Bairro</Label><Input placeholder="Bairro" defaultValue="Bela Vista" /></div>
            <div className="space-y-2"><Label>Cidade</Label><Input placeholder="Cidade" defaultValue="São Paulo" /></div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select defaultValue="SP">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {estados.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter><Button size="sm"><Save className="w-3 h-3 mr-1" /> Salvar</Button></CardFooter>
      </Card>

      {/* Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-sm">Plano atual:</p>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold text-sm px-3">PRO</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Alterar plano</Button>
            <Button variant="outline" size="sm">Histórico de pagamentos</Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade LGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Privacidade (LGPD)
          </CardTitle>
          <CardDescription>Configure como os dados sensíveis dos seus clientes são tratados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ocultar CPF dos meus clientes</p>
              <p className="text-xs text-muted-foreground">Não armazenar dados sensíveis</p>
            </div>
            <Switch checked={hideCpfs} onCheckedChange={setHideCpfs} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Ocultar telefone dos meus clientes</p>
              <p className="text-xs text-muted-foreground">Proteger informação de contato</p>
            </div>
            <Switch checked={hidePhones} onCheckedChange={setHidePhones} />
          </div>
        </CardContent>
        <CardFooter><Button size="sm"><Save className="w-3 h-3 mr-1" /> Salvar preferências</Button></CardFooter>
      </Card>
    </div>
  )
}
