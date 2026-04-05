'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function SuperAdminAudit() {
  const auditLogs = [
    { id: 1, data: "04/04/2026 14:32", acao: "Empresa Suspensa (Falta de Pagamento)", empresa: "Solar Max Ltda", usuario: "super_admin_01", ip: "192.168.1.100" },
    { id: 2, data: "04/04/2026 11:15", acao: "Novo Plano 'Pro' Criado", empresa: "-", usuario: "super_admin_02", ip: "10.0.0.45" },
    { id: 3, data: "03/04/2026 09:10", acao: "Empresa Aprovada e Ativada", empresa: "EcoSolar SP", usuario: "super_admin_01", ip: "192.168.1.100" },
    { id: 4, data: "02/04/2026 16:45", acao: "Feature Flag (WhatsApp) Ativada", empresa: "Global", usuario: "super_admin_01", ip: "192.168.1.100" },
    { id: 5, data: "02/04/2026 10:20", acao: "Limite de Storage Alterado (5GB -> 10GB)", empresa: "Engenharia Luz", usuario: "super_admin_03", ip: "172.16.0.33" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Logs de Auditoria</h1>
          <p className="text-muted-foreground mt-1">Trilha de auditoria das ações imutáveis do Super Admin.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar por empresa ou usuário..." className="pl-9 w-full" />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Últimos 7 dias</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium mb-1">Selecione o filtro:</div>
                    <Input type="date" />
                    <span className="text-xs text-center text-slate-400">até</span>
                    <Input type="date" />
                    <Button size="sm" className="mt-2 text-xs">Aplicar Filtro</Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select defaultValue="all-actions">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-actions">Todas as Ações</SelectItem>
                  <SelectItem value="tenant_status">Atualização de Status (Empresa)</SelectItem>
                  <SelectItem value="plan_change">Criação/Edição de Planos</SelectItem>
                  <SelectItem value="feature_flags">Feature Flags</SelectItem>
                  <SelectItem value="limits">Alteração de Limites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Data/Hora</th>
                  <th className="px-4 py-3 font-medium">Ação Realizada</th>
                  <th className="px-4 py-3 font-medium">Alvo (Empresa)</th>
                  <th className="px-4 py-3 font-medium">Usuário Executante</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">IP / Rede</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{log.data}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                      {log.acao.includes('Suspensa') && <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />}
                      {log.acao}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{log.empresa}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{log.usuario}</td>
                    <td className="px-4 py-3 text-right text-slate-500 font-mono text-xs">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 border-t pt-4">
            <span className="text-sm text-slate-500">Mostrando 5 de 2,492 registros de auditoria</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
