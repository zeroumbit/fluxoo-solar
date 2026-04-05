import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Briefcase, DollarSign, Activity, AlertCircle, TrendingUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SuperAdminDashboard() {
  const stats = [
    { title: 'Empresas Ativas', value: '142', icon: Building2, trend: '+12' },
    { title: 'Projetos Ativos', value: '1,834', icon: Briefcase, trend: '+84' },
    { title: 'MRR', value: 'R$ 142.500', icon: DollarSign, trend: '+15%' },
    { title: 'Novas Empresas', value: '28', icon: Activity, trend: 'últimos 30 dias' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Super Admin</h1>
          <p className="text-muted-foreground mt-1">Visão geral da plataforma Fluxoo Solar.</p>
        </div>
        <div className="w-[180px]">
          <Select defaultValue="30">
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimas Empresas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { nome: "SolarTech Brasil", tipo: "Integradora", status: "Ativo", data: "Hoje" },
                    { nome: "Engenharia Luz", tipo: "Engenharia", status: "Pendente", data: "Ontem" },
                    { nome: "Revenda Sul", tipo: "Revenda", status: "Ativo", data: "Ontem" },
                    { nome: "EcoSolar SP", tipo: "Integradora", status: "Ativo", data: "Hace 2 dias" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.nome}</td>
                      <td className="px-4 py-3 text-slate-600">{item.tipo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{item.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
               <ul className="space-y-4">
                 <li className="flex items-start gap-4">
                   <div className="w-2 h-2 mt-2 rounded-full bg-rose-500"></div>
                   <div>
                     <p className="font-medium text-sm text-slate-900">Faturamento Vencido</p>
                     <p className="text-xs text-slate-500">12 empresas estão com faturas atrasadas há mais de 15 dias.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                   <div>
                     <p className="font-medium text-sm text-slate-900">Limites de Storage</p>
                     <p className="text-xs text-slate-500">3 empresas atingiram 90% do limite de armazenamento nesta semana.</p>
                   </div>
                 </li>
               </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
             <CardContent className="p-6">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-xl shadow-sm">
                   <TrendingUp className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-900">Crescimento Sustentável</h3>
                   <p className="text-sm text-slate-600 mt-1">Aumento de 15% na base de clientes no último trimestre.</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
