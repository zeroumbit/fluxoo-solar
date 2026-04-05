import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ChevronRight, History, Home } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { selectTenant } from './actions';
import { SUPER_ADMIN } from '@/constants/super-admin';

function isSuperAdmin(user: Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getUser']>>['user']): boolean {
  if (!user) return false
  return (
    user.email === SUPER_ADMIN.EMAIL ||
    user.id === SUPER_ADMIN.UID ||
    user.app_metadata?.active_tenant_type === 'SUPER_ADMIN'
  )
}

export default async function SelectCompanyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect('/login'); }

  // Super Admin não passa pela seleção de empresa, vai direto para /super-admin
  if (isSuperAdmin(user)) {
    redirect('/super-admin/dashboard');
  }

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
    .eq('is_active', true);

  if (error || !memberships || memberships.length === 0) {
    redirect('/login?error=Nenhuma organização vinculada a este perfil.');
  }

  /**
   * REGRA 2: Logado -> Se 1 empresa, redirecionar automático
   */
  if (memberships.length === 1) {
    const m = memberships[0] as any;
    const tenant = m.tenants;
    const role = m.role;

    // Regra 3: Redirecionamento baseado no tenant_type
    const routeMap: Record<string, string> = {
      'SUPER_ADMIN': '/super-admin/dashboard',
      'INTEGRATOR': '/integrator/dashboard',
      'ENGINEERING_FIRM': '/engineering/dashboard',
      'RESELLER': '/reseller/dashboard'
    };

    const targetRoute = routeMap[tenant.type] || '/unauthorized';
    
    // Atualiza metadados JWT (através do Server Action compartilhado)
    await selectTenant(m.tenant_id, role, tenant.type);
    redirect(targetRoute);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary" />
            </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Suas Organizações</h1>
          <p className="text-muted-foreground">Selecione para qual empresa deseja administrar o Fluxoo Solar agora.</p>
        </div>

        <div className="grid gap-4">
          {memberships.map((m: any) => {
            const selectAction = selectTenant.bind(null, m.tenant_id, m.role, m.tenants.type);

            return (
              <Card key={m.tenant_id} className="group hover:border-primary transition-all overflow-hidden cursor-pointer shadow-sm border-slate-200">
                <form action={selectAction}>
                    <button type="submit" className="w-full text-left">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/5 rounded-xl text-primary group-hover:bg-primary/10 transition-colors">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg leading-none font-bold text-slate-800">{m.tenants.fantasy_name || m.tenants.name}</CardTitle>
                                    <CardDescription className="mt-1.5 flex items-center gap-2">
                                        <span className="capitalize text-primary font-medium">{m.tenants.type.replace('_', ' ').toLowerCase()}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{m.role}</span>
                                    </CardDescription>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-400" />
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                <History className="w-3.5 h-3.5" />
                                <span>Desde {format(new Date(m.tenants.created_at), "MMMM 'de' yyyy", { locale: ptBR })}</span>
                            </div>
                        </CardContent>
                    </button>
                </form>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-4">
            <form action="/login/actions" method="POST">
                <Button variant="link" className="text-slate-500 hover:text-primary transition-colors text-sm" formAction="/login/actions?action=signOut">
                    Sair e entrar com outra conta
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
