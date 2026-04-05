'use client';

import { useState } from 'react';
import { 
  ArrowRightCircle, 
  CheckCircle2, 
  Loader2, 
  Info, 
  AlertTriangle,
  History,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface StatusTransitionButtonProps {
    currentStatus: string;
    projectId: string;
}

export function StatusTransitionButton({ currentStatus, projectId }: StatusTransitionButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const statusMap: Record<string, { label: string; next: string; nextLabel: string }> = {
    PROSPECTING: { label: 'PROSPECÇÃO', next: 'DESIGNING', nextLabel: 'DESIGNING' },
    DESIGNING: { label: 'DESIGN', next: 'HOMOLOGATION', nextLabel: 'HOMOLOGATION' },
    HOMOLOGATION: { label: 'HOMOLOGAÇÃO', next: 'INSTALLED', nextLabel: 'INSTALADO' },
    INSTALLED: { label: 'INSTALADO', next: 'COMPLETED', nextLabel: 'CONCLUÍDO' },
    COMPLETED: { label: 'CONCLUÍDO', next: '', nextLabel: '' },
  };

  const transition = statusMap[currentStatus];
  if (!transition?.next) return null;

  const handleTransition = async () => {
    setLoading(true);
    try {
        // CALL POST /api/projects/:id/status
        await new Promise(res => setTimeout(res, 1500)); // Simulando API
        toast({ title: 'Status Atualizado!', description: `O projeto agora está na fase de ${transition.nextLabel}.` });
        setOpen(false);
        // Sugerir refresh via router ou revalidação automatica
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Falha na transição', description: err.message });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
            <Button className="h-10 px-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200/50 rounded-xl transition-all hover:scale-[1.03]">
                Avançar para {transition.nextLabel} <ChevronRight className="w-4 h-4" />
            </Button>
        } />
        <DialogContent className="max-w-[400px] border-none shadow-2xl rounded-3xl p-8">
            <DialogHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 mb-2">
                    <History className="w-8 h-8" />
                </div>
                <DialogTitle className="text-xl font-bold tracking-tighter">Confirmar Transição</DialogTitle>
                <DialogDescription className="text-slate-500 leading-relaxed text-sm">
                    Você está movendo o projeto de <span className="font-bold text-slate-800 underline decoration-slate-300">{transition.label}</span> para <span className="font-bold text-primary underline decoration-primary/30 uppercase tracking-widest">{transition.nextLabel}</span>. 
                    <br/><br/>
                    Esta ação notificará todos os envolvidos via timeline e registrará um log permanente de auditoria.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col gap-3 sm:flex-col pt-4">
                <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={handleTransition} disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar e Avançar'}
                </Button>
                <Button variant="ghost" className="w-full h-12 text-slate-400" onClick={() => setOpen(false)} disabled={loading}>
                    Cancelar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
