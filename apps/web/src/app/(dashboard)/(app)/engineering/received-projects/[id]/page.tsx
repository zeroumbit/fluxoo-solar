// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  ShieldAlert, CheckCircle, XCircle, Clock, Upload, MessageSquare,
  Send, FileText, Building2, AlertTriangle
} from 'lucide-react'

const checklist = [
  { id: 1, name: 'Fotos do telhado', status: 'approved', file: 'telhado_fotos.zip' },
  { id: 2, name: 'Conta de luz', status: 'pending', file: null },
  { id: 3, name: 'Projeto CAD', status: 'rejected', file: 'projeto_v1.dwg', reason: 'Área insuficiente' },
  { id: 4, name: 'ART / RRT', status: 'pending', file: null },
  { id: 5, name: 'Parecer de acesso', status: 'pending', file: null },
]

const chatMessages = [
  { author: 'SolarPrime', date: '04/04 14:32', text: 'Enviamos as fotos do telhado. O acesso é pela lateral.' },
  { author: 'Você', date: '04/04 15:10', text: 'Recebi. Vou analisar e retorno com o pré-projeto amanhã.' },
  { author: 'SolarPrime', date: '04/04 16:45', text: 'Perfeito. A conta de luz será enviada hoje à noite.' },
]

const statusIcon = {
  approved: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  rejected: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
}

const statusLabel = {
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  pending: 'Pendente',
}

export default function ReceivedProjectDetailPage() {
  const [message, setMessage] = useState('')
  const [protocol, setProtocol] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Projeto #2025-00123</h1>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Design</Badge>
        </div>
      </div>

      {/* Alerta de Sigilo */}
      <Alert className="border-amber-200 bg-amber-50">
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Sigilo total:</strong> Você não tem acesso aos dados pessoais do cliente final.
          Este projeto pertence à Integradora <strong>SolarPrime</strong>.
        </AlertDescription>
      </Alert>

      {/* Info do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Dono</p>
            <p className="font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3" /> SolarPrime
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Prazo</p>
            <p className="font-semibold">10/04/2025</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-semibold">Residencial</p>
          </div>
          <div>
            <p className="text-muted-foreground">Criado por</p>
            <p className="font-semibold">Ana Pereira</p>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Técnico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist Técnico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 flex-1">
                {statusIcon[item.status]}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {statusLabel[item.status]}
                    {item.reason && ` — ${item.reason}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.file && (
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" /> Ver
                  </Button>
                )}
                {item.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm" className="text-xs text-emerald-600">
                      <CheckCircle className="w-3 h-3 mr-1" /> Aprovar
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs text-red-600">
                      <XCircle className="w-3 h-3 mr-1" /> Rejeitar
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="w-3 h-3 mr-1" /> Upload
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat Técnico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Chat Técnico (apenas com Integradora)
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
                <p className="text-[10px] text-muted-foreground mt-1">
                  {m.author} · {m.date}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Input
              placeholder="Escrever mensagem para a Integradora..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Concessionárias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Concessionárias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número do protocolo</label>
              <Input placeholder="Ex: PROT-2025-001234" value={protocol} onChange={(e) => setProtocol(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status na concessionária</label>
              <Input placeholder="Ex: Aguardando parecer" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Atualizar protocolo</Button>
            <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1" /> Anexar parecer de acesso</Button>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <CheckCircle className="w-4 h-4 mr-2" /> Marcar como Concluído
        </Button>
        <Button variant="outline">
          <AlertTriangle className="w-4 h-4 mr-2" /> Solicitar mais informações
        </Button>
      </div>
    </div>
  )
}
