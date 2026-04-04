'use client';

import { Wifi, WifiOff, RefreshCw, Loader2, Database } from 'lucide-react';
import { useOfflineSync } from '@/hooks/use-offline-sync';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function OfflineIndicator() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();

  return (
    <div className="flex items-center gap-3">
        {!isOnline && (
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1.5 h-8 px-3 rounded-full font-black animate-pulse">
                <WifiOff className="w-3.5 h-3.5" /> MODO OFFLINE
            </Badge>
        )}

        {pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 h-9 border border-slate-800 shadow-xl shadow-slate-200 transition-all scale-in">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest">
                    <Database className="w-3.5 h-3.5 text-primary" /> {pendingCount} Pendentes
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-0 hover:bg-white/10 rounded-full" 
                    onClick={syncNow}
                    disabled={isSyncing || !isOnline}
                >
                    {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                </Button>
            </div>
        )}
    </div>
  );
}
