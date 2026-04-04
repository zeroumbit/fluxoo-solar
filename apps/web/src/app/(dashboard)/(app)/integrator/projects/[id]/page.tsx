'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  FileImage, 
  XCircle, 
  Upload,
  Loader2,
  TrendingDown,
  ChevronRight,
  MessageSquare,
  History,
  Send,
  ShieldCheck
} from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProjectTimeline } from '@/components/timeline/project-timeline';
import { ChecklistItemComments } from '@/components/checklist/checklist-item-comments';
import { StatusTransitionButton } from '@/components/project/status-transition-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  // Mock data for UI development before API connection
  const mockProject = {
    id: id,
    code: '2025-00123',
    title: 'Residência João Silva',
    status: 'DESIGNING',
    value: 15500.50,
    created_at: new Date().toISOString(),
    expected_completion_date: '2026-05-15',
    client: { 
        name: 'João Silva', 
        email: 'joao@email.com', 
        phone: '(11) 99999-8888' 
    },
    checklist_items: [
        { id: 'c1', label: 'Conta de luz', status: 'PENDING', file_url: null },
        { id: 'c2', label: 'Foto do padrão de entrada', status: 'PENDING', file_url: null },
        { id: 'c3', label: 'Documento de identidade (RG)', status: 'APPROVED', file_url: 'https://example.com/rg.pdf' },
        { id: 'c4', label: 'Comprovante de residência', status: 'REJECTED', file_url: 'https://example.com/residencia.pdf', rejection_reason: 'Foto ilegível. Enviar PDF original.' },
    ]
  };

  useEffect(() => {
    // Simulando busca do projeto
    setTimeout(() => {
        setProject(mockProject);
        setLoading(false);
    }, 500);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
        case 'REJECTED': return 'text-destructive bg-destructive/5 border-destructive/20';
        case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
        default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle2 className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Projeto #{project.code}</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 group">{project.client.name} — {project.title}</h1>
          </div>
        </div>
        <StatusTransitionButton currentStatus={project.status} projectId={project.id} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 mb-6">
            <TabsTrigger value="overview" className="rounded-xl px-6 font-bold text-sm h-10 data-[state=active]:shadow-lg data-[state=active]:bg-white">Visão Geral</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-xl px-6 font-bold text-sm h-10 data-[state=active]:shadow-lg data-[state=active]:bg-white flex gap-2">
                <History className="w-4 h-4" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="finance" className="rounded-xl px-6 font-bold text-sm h-10 data-[state=active]:shadow-lg data-[state=active]:bg-white" disabled>Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="lg:col-span-2 space-y-6">
                {/* Detalhes Operacionais */}
                <Card className="border-none shadow-none ring-1 ring-slate-200 overflow-hidden rounded-3xl">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-primary" /> Fluxoo de Operação
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8 bg-white">
                      <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status Atual</p>
                          <div className="flex items-center gap-1.5 font-black text-primary text-xl uppercase tracking-tighter">
                              {project.status}
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Valor do Contrato</p>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xl tracking-tight">
                              R$ {(project.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Previsão de Conclusão</p>
                          <div className="flex items-center gap-1.5 font-bold text-amber-600 text-xl tracking-tight">
                               {format(new Date(project.expected_completion_date), "dd/MM/yyyy")}
                          </div>
                      </div>
                  </CardContent>
                </Card>

                {/* Checklist com Chat do Item */}
                <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white">
                      <div>
                          <CardTitle className="text-lg font-black tracking-tight text-slate-800">Checklist Operacional</CardTitle>
                          <CardDescription className="text-slate-400 font-medium">Arquivos e validações mandatórias.</CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                      {project.checklist_items.map((item: any) => (
                          <div key={item.id} className="p-8 group bg-white hover:bg-slate-50/30 transition-all">
                              <div className="flex items-start justify-between">
                                <div className="flex gap-5">
                                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${getStatusColor(item.status)}`}>
                                        <FileImage className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="font-black text-slate-900 text-base tracking-tight">{item.label}</p>
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border inline-flex ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)} {item.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                   {item.file_url ? (
                                       <Button size="sm" variant="outline" className="rounded-xl" onClick={() => window.open(item.file_url)}>Ver Documento</Button>
                                   ) : (
                                       <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-xl shadow-primary/5 transition-all rounded-xl h-10 border border-primary/20">
                                           <Upload className="w-4 h-4" /> Enviar Arquivo
                                       </Button>
                                   )}
                                </div>
                              </div>
                              
                              <ChecklistItemComments itemId={item.id} />
                          </div>
                      ))}
                      </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none ring-1 ring-slate-200 shadow-none rounded-3xl p-4 bg-white">
                  <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-black flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" /> Perfil do Cliente
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nome Completo</p>
                          <p className="text-sm font-black text-slate-900">{project.client.name}</p>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center gap-3 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              <Mail className="w-4 h-4 text-primary" /> {project.client.email}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              <Phone className="w-4 h-4 text-primary" /> {project.client.phone}
                          </div>
                      </div>
                  </CardContent>
                </Card>

                {/* Delegação (Regra 7) */}
                <Card className="border-none bg-primary/5 ring-1 ring-primary/20 shadow-none rounded-3xl p-2">
                    <CardHeader className="p-6">
                        <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Engenharia Terceirizada
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium pt-1">Delegue este projeto para uma empresa parceira realizar o design e homologação.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <Button className="w-full h-11 bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/5">
                           Delegar Projeto
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
        </TabsContent>

        <TabsContent value="timeline" className="max-w-3xl mx-auto pt-4">
            <ProjectTimeline projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
