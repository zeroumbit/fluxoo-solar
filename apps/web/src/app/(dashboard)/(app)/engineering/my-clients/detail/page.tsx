// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle, XCircle, Clock, Upload, MessageSquare,
  Send, FileText, DollarSign, ArrowUpRight, Edit, CreditCard
} from 'lucide-react'

const checklist = [
  { id: 1, name: 'Documentos do cliente', status: 'approved', file: 'docs_cliente.pdf' },
  { id: 2, name: 'Projeto CAD', status: 'pending', file: null },
  { id: 3, name: 'ART', status: 'pending', file: null },
]

const chatMessages = [
  { author: 'João Silva', date: '03/04 10:20', text: 'Bom dia! Quando fica pronto o projeto?' },
  { author: 'Você', date: '03/04 11:05', text: 'Bom dia João! Estamos finalizando o CAD, até sexta entregamos.' },
  { author: 'João Silva', date: '03/04 11:10', text: 'Perfeito, agradeço!' },
]

const statusIcon = {
  approved: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  rejected: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
}

const statusLabel = { approved: 'Aprovado', rejected: 'Rejeitado', pending: 'Pendente' }

export default function OwnProjectDetailPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Projeto — João Silva</h1>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Design</Badge>
      </div>

      {/* Info do Projeto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Informações do Projeto</CardTitle>
          <Button variant="outline" size="sm"><Edit className="w-3 h-3 mr-1" /> Editar dados</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><p className="text-muted-foreground">Cliente</p><p className="font-semibold">João Silva</p></div>
          <div><p className="text-muted-foreground">Telefone</p><p className="font-semibold">(11) 99999-1234</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-semibold">joao@email.com</p></div>
          <div><p className="text-muted-foreground">Endereço</p><p className="font-semibold">Rua das Flores, 123, São Paulo - SP</p></div>
          <div><p className="text-muted-foreground">Tipo</p><p className="font-semibold">Residencial 5kWp</p></div>
          <div><p className="text-muted-foreground">Valor</p><p className="font-semibold text-emerald-600">R$ 1.200,00</p></div>
        </CardContent>
      </Card>

      {/* Checklist Técnico */}
      <Card>
        <CardHeader><CardTitle className="text-base">Checklist Técnico</CardTitle></CardHeader>
        <CardContent className="space-y-0 divide-y">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 flex-1">
                {statusIcon[item.status]}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{statusLabel[item.status]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.file && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" /> Ver
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="w-3 h-3 mr-1" /> Upload
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat com Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Chat com Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.author === 'Você' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  m.author === 'Você' ? 'bg-primary text-primary-foreground' : 'bg-slate-100'
                }`}>
                  <p className="text-sm">{m.text}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{m.author} · {m.date}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Input placeholder="Escrever mensagem..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" />
            <Button size="sm"><Send className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Faturamento */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4" /> Faturamento</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><p className="text-muted-foreground">Valor total</p><p className="text-lg font-bold">R$ 1.200,00</p></div>
            <div><p className="text-muted-foreground">Comissão Fluxoo (10%)</p><p className="text-lg font-bold text-orange-600">R$ 120,00</p></div>
            <div><p className="text-muted-foreground">A receber</p><p className="text-lg font-bold text-emerald-600">R$ 1.080,00</p></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><CreditCard className="w-3 h-3 mr-1" /> Emitir cobrança</Button>
            <Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" /> Histórico de pagamentos</Button>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3">
        <Button><ArrowUpRight className="w-4 h-4 mr-2" /> Avançar Status</Button>
        <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Solicitar Assinatura</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <CheckCircle className="w-4 h-4 mr-2" /> Marcar como Concluído
        </Button>
      </div>
    </div>
  )
}
