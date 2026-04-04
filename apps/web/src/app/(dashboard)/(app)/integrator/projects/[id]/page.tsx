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
  Loader2
} from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Projeto #{project.code}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 group">{project.client.name} — {project.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Card Detalhes Operacionais */}
          <Card className="border-slate-200 shadow-sm overflow-hidden border-none shadow-none ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Fluxoo de Operação</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Status Atual</p>
                    <div className="flex items-center gap-1.5 font-bold text-primary">
                        <TrendingUp className="w-4 h-4" /> {project.status}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Valor Estimado</p>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <DollarSign className="w-4 h-4" /> R$ {(project.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-medium">Entrega Prevista</p>
                    <div className="flex items-center gap-1.5 font-bold text-amber-600">
                        <Clock className="w-4 h-4" /> {format(new Date(project.expected_completion_date), "dd/MM/yyyy")}
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Checklist Exclusivo 4 Itens */}
          <Card className="border-slate-200 shadow-sm border-none ring-1 ring-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold">Checklist de Documentação</CardTitle>
                    <CardDescription>Obtenha todos os arquivos para liberar a engenharia.</CardDescription>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-200 uppercase tracking-tighter">
                   1/4 Concluído
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                {project.checklist_items.map((item: any) => (
                    <div key={item.id} className="p-6 flex items-start justify-between group bg-white hover:bg-slate-50/50 transition-all">
                        <div className="flex gap-4">
                            <div className={`p-2.5 rounded-xl border ${getStatusColor(item.status)}`}>
                                <FileImage className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                    {getStatusIcon(item.status)} {item.status}
                                </div>
                                {item.rejection_reason && (
                                    <p className="text-xs text-destructive mt-2 bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                                        Motivo: {item.rejection_reason}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                           {item.file_url ? (
                               <Button size="sm" variant="outline" onClick={() => window.open(item.file_url)}>Ver Arquivo</Button>
                           ) : (
                               <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-none transition-all">
                                   <Upload className="w-4 h-4" /> Enviar
                               </Button>
                           )}
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Card Cliente */}
          <Card className="border-none ring-1 ring-slate-200 shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 font-display">
                    <User className="w-5 h-5 text-primary" /> Perfil do Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nome Completo</p>
                    <p className="text-sm font-bold text-slate-800">{project.client.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Contatos</p>
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Mail className="w-3.5 h-3.5 text-primary" /> {project.client.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Phone className="w-3.5 h-3.5 text-primary" /> {project.client.phone}
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 rounded-2xl p-4 text-white hover:scale-[1.02] transition-transform shadow-xl shadow-slate-200">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter mb-2">Relacionamento Global</p>
                    <p className="text-xs leading-relaxed opacity-80">Este cliente foi identificado via hash corporativo. Todas as alterações em dados mestres refletem em todos os seus projetos.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
