'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Download,
  AlertTriangle,
  FileBadge,
  ShieldCheck,
  TrendingDown,
  LayoutDashboard,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FinancePage() {
  const [loading, setLoading] = useState(false);

  // Mocks for Phase 5 Finance (Aggregations only - Rule 4)
  const summary = {
    monthly_revenue: 142000,
    commissions_payable: 12600,
    engineering_payments: 8400,
    projects_by_status: { PROSPECTING: 5, DESIGNING: 8, HOMOLOGATION: 3, INSTALLED: 2, COMPLETED: 6 }
  };

  const commissions = [
    { reseller: 'SolBr Vendas', amount: 4200, percentage: 15, status: 'PENDING' },
    { reseller: 'EcoEnergy', amount: 1800, percentage: 12, status: 'PENDING' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 group flex items-center gap-2">
                <Wallet className="w-8 h-8 text-primary" /> Financeiro e Receitas
            </h1>
            <p className="text-slate-500 font-medium">Visão consolidada de fluxos e agregações de projetos.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" className="h-11 px-5 rounded-2xl gap-2 font-bold bg-white text-slate-500 border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                <Calendar className="w-4 h-4" /> Março, 2026
             </Button>
             <Button className="h-11 px-5 rounded-2xl gap-2 font-bold bg-slate-950 text-white shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.03]">
                <Download className="w-4 h-4" /> Exportar Balanço
             </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardDescription className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> Faturamento Estimado
                </CardDescription>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">
                   R$ {summary.monthly_revenue.toLocaleString('pt-BR')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-100">
                   <ArrowUpRight className="w-3 h-3" /> +12% sobre Fevereiro
                </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardDescription className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-500" /> Comissões a Pagar
                </CardDescription>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">
                   R$ {summary.commissions_payable.toLocaleString('pt-BR')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs bg-amber-50 w-fit px-2 py-0.5 rounded-full border border-amber-100">
                   <AlertTriangle className="w-3 h-3" /> 2 pendentes para este mês
                </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardDescription className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Custos de Engenharia
                </CardDescription>
                <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">
                   R$ {summary.engineering_payments.toLocaleString('pt-BR')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100">
                   <FileBadge className="w-3 h-3" /> Projetos Delegados
                </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         {/* Status Breakdown */}
         <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden p-8 bg-white">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-primary" /> Volume de Operações
                    </h2>
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 font-black text-[10px] uppercase tracking-tighter">Projetos por Fase</Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(summary.projects_by_status).map(([status, count]) => (
                        <div key={status} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100">
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{status}</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tighter">{count}</p>
                        </div>
                    ))}
                </div>
            </div>
         </Card>

         {/* Commissions List (MVP VIEW) */}
         <Card className="border-none shadow-none ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <CardTitle className="text-lg font-black tracking-tight">Comissões a Pagar (Revendedoras)</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Valores calculados com base na taxa pactuada sobre projetos concluídos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {commissions.map((c, i) => (
                        <div key={i} className="p-8 group hover:bg-slate-50/40 transition-all flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-black text-slate-800 tracking-tight">{c.reseller}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{c.percentage}% taxa de indicação</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="font-black text-slate-900 text-lg tracking-tighter">R$ {c.amount.toLocaleString('pt-BR')}</p>
                                <Button variant="ghost" className="h-8 px-4 text-[10px] uppercase font-black tracking-widest text-primary border border-primary/20 rounded-xl hover:bg-primary/5">Detalhes</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
         </Card>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
         <div className="relative z-10 space-y-6">
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-xl mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter">Segurança de Dados Financeiros</h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
                    As agregações exibidas nesta tela são protegidas por Roles RBAC específicas. Apenas usuários com perfil <strong>OWNER</strong>, <strong>MANAGER</strong> ou <strong>FINANCE</strong> podem visualizar estas métricas de faturamento global.
                </p>
            </div>
            <div className="flex gap-4 pt-4">
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-tighter">Transações Reais: Não-Integrado</div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-tighter">Auditoria de Logs: Ativa</div>
            </div>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <TrendingUp className="w-64 h-64 -mr-16 -mt-16" />
         </div>
      </div>
    </div>
  );
}
