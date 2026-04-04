'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const setupRealtime = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Subscription Realtime (Com Filtro RLS - Regra 3)
        const channel = supabase
          .channel(`notifications:${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`, // Filtro RLS Obrigatório
            },
            (payload) => {
              console.log('Nova notificação:', payload);
              setNotifications(prev => [payload.new, ...prev]);
              setUnreadCount(prev => prev + 1);
              toast({ title: payload.new.title, description: payload.new.content });
            }
          )
          .subscribe();

        return () => { supabase.removeChannel(channel); };
    };

    setupRealtime();
  }, [supabase]);

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-100" align="end">
        <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-tight">Notificações</h3>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-black tracking-widest text-primary" onClick={markAllRead}>
                Marcar todas como lidas
            </Button>
        </div>
        <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2 opacity-50">
                    <Bell className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">Nenhuma notificação por enquanto.</p>
                </div>
            ) : (
                notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-all cursor-pointer ${!n.is_read ? 'bg-primary/5' : ''}`}>
                        <p className="text-xs font-bold text-slate-800 mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{n.content}</p>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Agora mesmo</p>
                    </div>
                ))
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
