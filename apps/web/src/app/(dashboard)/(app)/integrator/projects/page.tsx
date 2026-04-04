'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  
  // Mock data for UI development before API connection
  const projects = [
    { id: '1', code: '2025-00123', client: 'João Silva', status: 'DESIGNING', value: 15500, date: '10/04/2026' },
    { id: '2', code: '2025-00122', client: 'Maria Souza', status: 'PROSPECTING', value: 22000, date: '09/04/2026' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'DESIGNING': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'PROSPECTING': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos fotovoltaicos e acompanhe checklists.</p>
        </div>
        <Link href="/integrator/projects/new">
            <Button className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-5 h-5" /> Novo Projeto
            </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por cliente ou código do projeto..." 
            className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-slate-600">
            Filtros
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/integrator/projects/${project.id}`}>
            <Card className="group hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary transition-colors group-hover:text-white">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">#{project.code} — {project.client}</CardTitle>
                            <CardDescription className="flex items-center gap-3 mt-1.5 font-medium">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-black tracking-widest ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-slate-500 text-xs">
                                    <Clock className="w-3.5 h-3.5" /> {project.date}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-primary text-xs font-bold">
                                    <TrendingUp className="w-3.5 h-3.5" /> R$ {(project.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-primary" />
                    </Button>
                </CardHeader>
            </Card>
          </Link>
        ))}

        {projects.length === 0 && (
            <div className="py-20 text-center space-y-4 border-2 border-dashed rounded-3xl opacity-50">
                <FileText className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-slate-500 font-medium">Nenhum projeto encontrado.</p>
            </div>
        )}
      </div>
    </div>
  );
}
