'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Loader2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  CheckCircle2, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  clientCpf: z.string().min(11, 'CPF incompleto'),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  title: z.string().min(5, 'Título curto demais'),
  totalValueCents: z.coerce.number().min(100, 'Valor inválido'),
  expectedCompletionDate: z.string().min(10, 'Data inválida'),
});

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      clientCpf: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      title: '',
      totalValueCents: 0,
      expectedCompletionDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleCpfCheck = async () => {
    // Para MVP, assumimos novo cliente ou fluxo manual
    // Em produção, aqui chamamos a busca no backend
    setStep(2);
    setIsNewClient(true);
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await projectsApi.create(values);
      toast({ title: 'Sucesso!', description: 'Projeto e checklist criados transacionalmente.' });
      router.push(`/integrator/projects/${response.projectId}`);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Falha na criação', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Novo Fluxoo de Projeto</h1>
      </div>

      <div className="bg-white border rounded-3xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary w-8' : 'bg-slate-100 w-2'}`} />
            ))}
        </div>

        {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Search className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold">Identificação do Cliente</h2>
                    <p className="text-slate-500 text-sm">Insira o CPF para vincular ou criar um novo usuário global.</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF do Cliente</Label>
                        <Input id="cpf" placeholder="000.000.000-00" {...form.register('clientCpf')} className="h-12 border-slate-200 focus:ring-primary shadow-sm" />
                    </div>
                    <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={handleCpfCheck}>
                        Próximo Passo <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="text-center space-y-1 mb-4">
                    <h2 className="text-xl font-bold">Dados do Cliente</h2>
                    <p className="text-slate-500 text-sm">Cliente novo detectado em nosso banco de hashes.</p>
                </div>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" {...form.register('clientName')} className="border-slate-200 focus:bg-slate-50/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (opcional)</Label>
                            <Input id="email" {...form.register('clientEmail')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone (opcional)</Label>
                            <Input id="phone" {...form.register('clientPhone')} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>Voltar</Button>
                    <Button className="flex-1 h-12 font-bold" onClick={() => setStep(3)}>Avançar</Button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-300">
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold">Configurações do Projeto</h2>
                    <p className="text-slate-500 text-sm">Defina o título, valor e prazos.</p>
                </div>

                <div className="grid gap-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título do Projeto</Label>
                        <Input id="title" placeholder="Ex: Residência Solar de Luxo - João Silva" {...form.register('title')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="value" className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-primary" /> Valor Total (Centavos)</Label>
                            <Input id="value" type="number" {...form.register('totalValueCents')} placeholder="Ex: 5000000 para R$ 50k" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Entrega Prevista</Label>
                            <Input id="date" type="date" {...form.register('expectedCompletionDate')} />
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-1.5">
                    <p className="text-[10px] uppercase font-black text-primary tracking-tighter">Obrigatório pela engenharia (Checklist):</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Conta de luz</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> Foto do padrão de entrada</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-500" /> RG e Comprovante de Residência</li>
                    </ul>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>Voltar</Button>
                    <Button 
                        className="flex-1 h-12 font-bold bg-primary shadow-lg shadow-primary/20" 
                        disabled={loading}
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Criar Projeto Atômico'}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
