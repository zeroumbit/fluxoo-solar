// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Upload, FileText, Send, ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api/projects'
import { FormattedDate } from '@/components/ui/formatted-date'

const statusIcon: Record<string, React.ReactNode> = {
  'APPROVED': <CheckCircle className="w-4 h-4 text-emerald-500" />,
  'REJECTED': <XCircle className="w-4 h-4 text-red-500" />,
  'PENDING': <Clock className="w-4 h-4 text-amber-500" />,
}

const statusLabel: Record<string, string> = { 
  'APPROVED': 'Aprovado', 
  'REJECTED': 'Rejeitado', 
  'PENDING': 'Pendente' 
}

const statusLabelMap: Record<string, string> = {
  'PROSPECTING': 'Prospecção',
  'DESIGNING': 'Design',
  'HOMOLOGATING': 'Homologação',
  'INSTALLED': 'Instalado',
  'COMPLETED': 'Concluído',
}

const typeColor: Record<string, string> = {
  system: 'bg-slate-200 text-slate-600',
  client: 'bg-blue-100 text-blue-700',
  engineering: 'bg-purple-100 text-purple-700',
  self: 'bg-primary/10 text-primary',
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [message, setMessage] = useState('')

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id as string),
    enabled: !!id
  })

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-medium">Carregando dados do projeto...</p>
        </div>
    )
  }

  if (error || !project) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Badge variant="destructive">Erro ao carregar projeto</Badge>
            <Button asChild variant="outline"><Link href="/integrator/projects">Voltar para lista</Link></Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/integrator/projects"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Projeto {project.code} — {project.client.name}</h1>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 italic">{statusLabelMap[project.status] || project.status}</Badge>
        </div>
        <Button><ArrowUpRight className="w-4 h-4 mr-2" /> Avançar Status</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Informações do Projeto</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><p className="text-muted-foreground">Dono</p><p className="font-semibold">{project.integrator?.name || 'Não informado'}</p></div>
          <div><p className="text-muted-foreground">Engenharia</p><p className="font-semibold text-purple-700">{project.engineering?.name || 'Não atribuído'}</p></div>
          <div><p className="text-muted-foreground">Revendedor</p><p className="font-semibold">{project.reseller?.name || 'Venda Direta'}</p></div>
          <div><p className="text-muted-foreground">Criado por</p><p className="font-semibold">{project.created_by_user?.name || 'Sistema'}</p></div>
          <div><p className="text-muted-foreground">Prazo</p><p className="font-semibold"><FormattedDate date={project.deadline} fallback="Sem prazo" /></p></div>
          <div><p className="text-muted-foreground">Tipo de Usina</p><p className="font-semibold">{project.type || 'Residencial'}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Dados do Cliente</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground">Nome</p><p className="font-semibold">{project.client.name}</p></div>
          <div><p className="text-muted-foreground">Telefone</p><p className="font-semibold">{project.client.phone || 'N/A'}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-semibold">{project.client.email || 'N/A'}</p></div>
          <div><p className="text-muted-foreground">Endereço</p><p className="font-semibold">{project.client.address || 'N/A'}</p></div>
          <div className="col-span-2 md:col-span-4">
            <Button variant="outline" size="sm">Ver contato completo</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Checklist de Documentos</CardTitle></CardHeader>
        <CardContent className="divide-y">
          {project.checklist?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 flex-1">
                {statusIcon[item.status] || <Clock className="w-4 h-4 text-slate-400" />}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {statusLabel[item.status] || 'Aguardando'}{item.rejection_reason && ` — ${item.rejection_reason}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {item.file_url && (
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href={item.file_url} target="_blank" rel="noreferrer">
                        <FileText className="w-3 h-3 mr-1" /> Ver
                    </a>
                  </Button>
                )}
                {item.status === 'PENDING' && (
                  <>
                    <Button variant="outline" size="sm" className="text-xs text-emerald-600"><CheckCircle className="w-3 h-3 mr-1" /> Aprovar</Button>
                    <Button variant="outline" size="sm" className="text-xs text-red-600"><XCircle className="w-3 h-3 mr-1" /> Rejeitar</Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="text-xs"><Upload className="w-3 h-3 mr-1" /> Upload</Button>
              </div>
            </div>
          )) || <p className="p-4 text-center text-sm text-muted-foreground font-italic">Nenhum item de checklist gerado.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Timeline e Conversas (Mock)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
             <p className="text-xs text-slate-400 text-center py-4">Histórico do projeto sendo carregado...</p>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Input placeholder="Escrever mensagem..." value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" />
            <Button size="sm"><Send className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
