// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const estados = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function NewProjectPage() {
  const [form, setForm] = useState({
    cpf: '', name: '', email: '', phone: '', cep: '', street: '', number: '',
    complement: '', neighborhood: '', city: '', state: '',
    title: '', type: '', value: '', deadline: ''
  })

  const update = (key: string, val: string) => setForm(prev => ({...prev, [key]: val}))

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/engineering/my-clients"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
          <p className="text-muted-foreground">Cadastre um novo projeto para cliente direto</p>
        </div>
      </div>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader><CardTitle className="text-base">Dados do Cliente</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input placeholder="000.000.000-00" value={form.cpf} onChange={e => update('cpf', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input placeholder="Nome do cliente" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input placeholder="00000-000" value={form.cep} onChange={e => update('cep', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Logradouro</Label>
              <Input placeholder="Rua / Avenida" value={form.street} onChange={e => update('street', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input placeholder="Nº" value={form.number} onChange={e => update('number', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input placeholder="Apto, Bloco..." value={form.complement} onChange={e => update('complement', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input placeholder="Bairro" value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input placeholder="Cidade" value={form.city} onChange={e => update('city', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.state} onValueChange={v => update('state', v)}>
                <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                <SelectContent>
                  {estados.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Projeto */}
      <Card>
        <CardHeader><CardTitle className="text-base">Dados do Projeto</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título do projeto</Label>
              <Input placeholder="Ex: Residencial 5kWp" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={v => update('type', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor do projeto (R$)</Label>
              <Input type="number" placeholder="0,00" value={form.value} onChange={e => update('value', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Prazo de entrega</Label>
              <Input type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex gap-3">
        <Button>
          <Save className="w-4 h-4 mr-2" /> Criar Projeto
        </Button>
        <Button variant="outline" asChild>
          <Link href="/engineering/my-clients">Cancelar</Link>
        </Button>
      </div>
    </div>
  )
}
