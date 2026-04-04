'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Lock, 
  Globe, 
  User, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ChecklistItemComments({ itemId }: { itemId: string }) {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(true);

  // Mocks for Phase 4 UI
  const comments = [
    { 
        id: '1', 
        author_name: 'Carla (Engenharia)', 
        is_internal: true, 
        content: 'Documento OK. Pode aprovar essa conta de luz.', 
        created_at: new Date().toISOString() 
    },
    { 
        id: '2', 
        author_name: 'Ana (Integradora)', 
        is_internal: false, 
        content: 'Aprovado! Encaminhando para próxima fase.', 
        created_at: Date.now() + 1000
    },
  ];

  return (
    <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black uppercase tracking-tighter text-slate-500">Comentários e Chat do Item</h3>
      </div>

      <div className="space-y-4 mb-5">
        {comments.map((c) => (
          <div key={c.id} className={`flex gap-3 items-start animate-in fade-in duration-300 ${c.is_internal ? 'opacity-80' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                c.is_internal ? 'bg-slate-200 text-slate-500' : 'bg-primary/10 text-primary'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className="space-y-1 relative">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">{c.author_name}</span>
                    <span className="text-slate-300">•</span>
                    {c.is_internal ? (
                        <span className="flex items-center gap-0.5 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full border border-slate-200 uppercase font-black tracking-tighter">
                            <Lock className="w-2.5 h-2.5" /> Interno
                        </span>
                    ) : (
                        <span className="flex items-center gap-0.5 text-[9px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded-full border border-sky-100 uppercase font-black tracking-tighter">
                            <Globe className="w-2.5 h-2.5" /> Público
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[400px]">
                    {c.content}
                </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
            <Input 
                placeholder="Adicionar nota para este documento..." 
                className="h-8 border-none focus:ring-0 text-xs shadow-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button size="sm" className="h-7 w-7 p-0 rounded-full shadow-lg">
                <Send className="w-3.5 h-3.5" />
            </Button>
        </div>
        <div className="flex items-center gap-2 pl-2">
            <Checkbox 
                id={`internal-${itemId}`} 
                checked={isInternal} 
                onCheckedChange={(val) => setIsInternal(!!val)}
            />
            <Label htmlFor={`internal-${itemId}`} className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1 cursor-pointer">
                <Lock className="w-3 h-3" /> Comentário interno (Privado)
            </Label>
        </div>
      </div>
    </div>
  );
}
