'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle2, 
  X, 
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function TeamPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const mockMembers = [
    { id: '1', name: 'Ana Silva', email: 'ana@empresa.com', role: 'OWNER', status: 'ACTIVE', joined_at: '2026-04-01' },
    { id: '2', name: 'Carlos Oliveira', email: 'carlos@empresa.com', role: 'ENGINEER', status: 'ACTIVE', joined_at: '2026-04-05' },
    { id: '3', name: 'João Melo', email: 'joao@email.com', role: 'SALES', status: 'PENDING', joined_at: '2026-04-10' },
  ];

  const handleInvite = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: 'Convite enviado!', description: 'O novo membro receberá as instruções por e-mail.' });
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 group flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" /> Equipe e Colaboradores
            </h1>
            <p className="text-slate-500 font-medium">Gerencie acessos, permissões e convites do seu tenant.</p>
        </div>
        
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-11 px-6 bg-slate-950 hover:bg-slate-900 text-white shadow-xl shadow-slate-200/50 rounded-2xl gap-2 font-bold transition-all hover:scale-[1.03]">
                    <UserPlus className="w-4 h-4" /> Convidar Membro
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[450px] border-none shadow-2xl rounded-3xl p-8">
                <DialogHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 mb-2">
                        <Mail className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tighter">Enviar Novo Convite</DialogTitle>
                    <DialogDescription className="text-slate-500 leading-relaxed text-sm">
                        O membro receberá um token único por e-mail válido por 7 dias. Selecione o cargo cuidadosamente (Regra 1).
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-1">E-mail do Usuário</label>
                        <Input placeholder="ex: colaborador@fluxoosolar.com" className="h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-1">Cargo / Role</label>
                        <Select defaultValue="ENGINEER">
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold">
                                <SelectValue placeholder="Selecione o Cargo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl font-bold">
                                <SelectItem value="OWNER">Proprietário (OWNER)</SelectItem>
                                <SelectItem value="MANAGER">Gestor (MANAGER)</SelectItem>
                                <SelectItem value="ENGINEER">Engenheiro (ENGINEER)</SelectItem>
                                <SelectItem value="SALES">Vendas (SALES)</SelectItem>
                                <SelectItem value="FINANCE">Financeiro (FINANCE)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="flex flex-col gap-3 sm:flex-col pt-6">
                    <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleInvite} disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar e Enviar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between p-8">
            <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">Membros Ativos</CardTitle>
                <CardDescription className="text-slate-500 font-medium font-sans">Usuários vinculados à empresa {mockMembers.length}.</CardDescription>
            </div>
            <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input placeholder="Filtrar por nome ou e-mail..." className="pl-10 h-10 border-slate-100 bg-white rounded-xl shadow-none" />
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
                {mockMembers.map((m) => (
                    <div key={m.id} className="p-8 group hover:bg-slate-50/40 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-sm ${
                                m.status === 'PENDING' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-slate-900 text-white border-slate-800'
                            }`}>
                                {m.name ? m.name.charAt(0) : <Clock className="w-6 h-6" />}
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    {m.name || 'Convite Pendente'} 
                                    {m.role === 'OWNER' && <Shield className="w-3.5 h-3.5 text-primary" />}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {m.email}</span>
                                    <span className="text-slate-300">•</span>
                                    {m.status === 'PENDING' ? (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] font-black uppercase tracking-tighter">Aguardando Aceite</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-black uppercase tracking-tighter">Membro Ativo</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Cargo Atual</p>
                                <p className="font-bold text-slate-700 text-sm">{m.role}</p>
                            </div>
                            <div className="flex items-center gap-2 h-10 px-2 bg-slate-50 rounded-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:text-primary transition-all">
                                    <Shield className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:text-destructive transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex items-center gap-6">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm text-primary">
            <AlertCircle className="w-6 h-6" />
         </div>
         <div className="space-y-1">
            <p className="font-black text-slate-800 tracking-tight">Dica de Segurança RBAC</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                Lembre-se que apenas <strong>OWNERs</strong> e <strong>MANAGERs</strong> possuem permissão para convidar novos membros. O OWNER é a única role com poderes globais de delegação financeira.
            </p>
         </div>
      </div>
    </div>
  );
}
