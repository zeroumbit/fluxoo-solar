'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Filter, 
  User, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Loader2, 
  ArrowRightCircle,
  FileBadge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ProjectTimeline({ projectId }: { projectId: string }) {
  const [content, setContent] = useState('');
  const [layer, setLayer] = useState('B2C_PUBLIC');

  // Mocks for Phase 4 UI
  const messages = [
    { 
        id: '1', 
        sender_name: 'Carla (Engenharia)', 
        visibility_layer: 'TECHNICAL_INTERNAL', 
        content: 'Projeto enviado para homologação na concessionária. Protocolo: #123456.', 
        created_at: new Date().toISOString(),
        is_system_event: false 
    },
    { 
        id: '2', 
        sender_name: 'Sistema', 
        visibility_layer: 'B2C_PUBLIC', 
        content: 'Status alterado de DESIGNING para HOMOLOGATION.', 
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_system_event: true 
    },
    { 
        id: '3', 
        sender_name: 'João (Cliente)', 
        visibility_layer: 'B2C_PUBLIC', 
        content: 'Alguma novidade sobre o prazo?', 
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_system_event: false 
    },
  ];

  const getLayerIcon = (layer: string) => {
    switch(layer) {
        case 'TECHNICAL_INTERNAL': return <Lock className="w-3 h-3 text-blue-600" />;
        case 'COMMERCIAL_INTERNAL': return <ShieldCheck className="w-3 h-3 text-amber-600" />;
        default: return <Globe className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 shadow-inner">
        <div className="flex gap-2 mb-3">
            <Select value={layer} onValueChange={setLayer}>
                <SelectTrigger className="w-[180px] h-8 text-[11px] font-bold uppercase tracking-wider bg-white">
                   <div className="flex items-center gap-2">
                        {getLayerIcon(layer)}
                        <SelectValue />
                   </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="B2C_PUBLIC">Pública (Cliente)</SelectItem>
                    <SelectItem value="TECHNICAL_INTERNAL">Técnica (Interna)</SelectItem>
                    <SelectItem value="COMMERCIAL_INTERNAL">Comercial</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="relative">
            <Textarea 
                placeholder="Escreva uma atualização para a timeline..." 
                className="min-h-[100px] bg-white border-slate-200 focus:ring-primary rounded-xl transition-all resize-none p-4 pb-12"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button className="absolute bottom-3 right-3 h-8 gap-2 shadow-lg" size="sm">
                <Send className="w-3.5 h-3.5" /> Postar Update
            </Button>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[1.5px] before:bg-slate-100">
        {messages.map((m) => (
          <div key={m.id} className="relative pl-12">
            <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                m.is_system_event ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'
            }`}>
                {m.is_system_event ? <ArrowRightCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            
            <div className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${
                m.visibility_layer === 'TECHNICAL_INTERNAL' ? 'border-blue-100' : 'border-slate-100'
            }`}>
               <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-800">{m.sender_name}</span>
                        <span className="text-slate-300">•</span>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            m.visibility_layer === 'TECHNICAL_INTERNAL' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                            {getLayerIcon(m.visibility_layer)} {m.visibility_layer.split('_')[0]}
                        </div>
                    </div>
                    <span className="text-[10px] items-center gap-1 flex text-slate-400 font-bold uppercase">
                        <Clock className="w-3 h-3" /> {format(new Date(m.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                    </span>
               </div>
               <p className={`text-sm leading-relaxed ${m.is_system_event ? 'italic font-medium text-slate-600' : 'text-slate-700'}`}>
                    {m.content}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clock({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )
}
