import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, ChevronRight, History } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { selectTenant } from './actions'

export default async function SelectCompanyPage() {
  const supabase = await createClient()

  const { data: memberships, error } = await supabase
    .from('tenant_user_memberships')
    .select(`
      tenant_id,
      role,
      tenants (
        id,
        name,
        type,
        fantasy_name,
        created_at
      )
    `)
    .eq('is_active', true)

  if (error || !memberships || memberships.length === 0) {
    redirect('/login?error=Nenhuma empresa vinculada')
  }

  // Auto-redirect if only one tenant
  if (memberships.length === 1) {
    const m = memberships[0] as any
    const tenant = m.tenants
    const role = m.role

    const routeMap: Record<string, string> = {
      'SUPER_ADMIN': '/super-admin/dashboard',
      'INTEGRATOR': '/integrator/dashboard',
      'ENGINEERING_FIRM': '/engineering/dashboard',
      'RESELLER': '/reseller/dashboard'
    }

    const targetRoute = routeMap[tenant.type] || '/unauthorized'
    await selectTenant(m.tenant_id, role, tenant.type)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Escolha sua empresa</h1>
          <p className="text-muted-foreground">Você possui acesso a múltiplas organizações</p>
        </div>

        <div className="grid gap-4">
          {memberships.map((m: any) => {
            const selectAction = selectTenant.bind(null, m.tenant_id, m.role, m.tenants.type)

            return (
              <Card key={m.tenant_id} className="group hover:border-primary transition-all overflow-hidden cursor-pointer">
                <form action={selectAction}>
                    <button type="submit" className="w-full text-left">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg leading-none">{m.tenants.name}</CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-2">
                                <span className="capitalize">{m.tenants.type.toLowerCase().replace('_', ' ')}</span>
                                <span>•</span>
                                <span className="text-xs">{m.role}</span>
                                </CardDescription>
                            </div>
                            </div>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <History className="w-3.5 h-3.5" />
                                <span>Cadastrado em: {format(new Date(m.tenants.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                            </div>
                        </CardContent>
                    </button>
                </form>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
            <form action="/login/actions" method="POST">
                <Button variant="link" className="text-muted-foreground" formAction="/login/actions?action=signOut">
                    Entrar com outra conta
                </Button>
            </form>
        </div>
      </div>
    </div>
  )
}
