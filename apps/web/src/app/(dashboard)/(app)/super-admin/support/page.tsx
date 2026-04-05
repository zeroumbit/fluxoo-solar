'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MessageSquare, ExternalLink, Headset } from 'lucide-react'

export default function SuperAdminSupport() {
  const tickets = [
    { id: 'TKT-1029', empresa: "SolarTech Brasil", tipo: "Dúvida Comercial", data: "04/04/2026", status: "Aberto" },
    { id: 'TKT-1028', empresa: "Engenharia Luz", tipo: "Bug Report (Upload PDF)", data: "03/04/2026", status: "Em andamento" },
    { id: 'TKT-1027', empresa: "EcoSolar SP", tipo: "Solicitação de Acesso", data: "01/04/2026", status: "Resolvido" },
    { id: 'TKT-1026', empresa: "Revenda Sul", tipo: "Falha de Pagamento", data: "30/03/2026", status: "Resolvido" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Suporte Técnico</h1>
          <p className="text-muted-foreground mt-1">Acompanhe os tickets abertos pelos inquilinos.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar ticket por número ou nome da empresa..." className="pl-9 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Ticket</th>
                  <th className="px-4 py-3 font-medium">Empresa</th>
                  <th className="px-4 py-3 font-medium">Tipo do Problema</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{ticket.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{ticket.empresa}</td>
                    <td className="px-4 py-3 text-slate-600">{ticket.tipo}</td>
                    <td className="px-4 py-3 text-slate-500">{ticket.data}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        ticket.status === 'Aberto' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        ticket.status === 'Em andamento' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        <MessageSquare className="w-4 h-4 mr-2" /> Ver Conversa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-slate-500">Mostrando 4 de 12 tickets abertos</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-primary/5 rounded-xl border border-primary/10 p-6 flex items-start gap-4 mt-8">
         <div className="bg-white p-3 rounded-full shadow-sm">
             <Headset className="w-6 h-6 text-primary" />
         </div>
         <div>
             <h3 className="font-semibold text-slate-900">Política de Privacidade no Suporte</h3>
             <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                 Por motivos de segurança e conformidade com a LGPD, a equipe Super Admin só tem acesso aos metadados do ticket (status, categoria e tempo de resolução). O conteúdo das mensagens é criptografado end-to-end entre o inquilino e a equipe especializada de atendimento de Nível 2.
             </p>
         </div>
      </div>
    </div>
  )
}
