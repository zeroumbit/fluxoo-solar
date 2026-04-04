import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function IntegratorDashboard() {
  const stats = [
    { title: 'Projetos Ativos', value: '12', icon: FileText, trend: '+2' },
    { title: 'Revendedores', value: '45', icon: Users, trend: '+5' },
    { title: 'Faturamento Mensal', value: 'R$ 84k', icon: DollarSign, trend: '+12%' },
    { title: 'Taxa de Conversão', value: '24%', icon: TrendingUp, trend: '+3%' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Integradora</h1>
        <p className="text-muted-foreground">Sistema Fluxoo Solar — Bem-vindo ao painel de controle operacional.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary font-medium">{stat.trend}</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-white/20">
        <div className="text-center space-y-4">
            <div className="bg-primary/5 p-6 rounded-full mx-auto w-fit">
                <FileText className="w-10 h-10 text-primary/30" />
            </div>
            <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-800">Sem atividades recentes</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Novos projetos e solicitações de engenharia aparecerão aqui conforme forem registrados.
                </p>
            </div>
        </div>
      </Card>
    </div>
  )
}
