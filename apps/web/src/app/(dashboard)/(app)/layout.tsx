import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SUPER_ADMIN } from '@/constants/super-admin'
import { DashboardClientLayout } from '@/components/dashboard/dashboard-client-layout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch active tenant from metadata (can be in user_metadata or app_metadata)
  const activeTenantId = user.user_metadata?.active_tenant_id || user.app_metadata?.active_tenant_id
  const activeTenantType = user.user_metadata?.active_tenant_type || user.app_metadata?.active_tenant_type
  
  const isSuperAdmin = 
    user.email === SUPER_ADMIN.EMAIL || 
    user.id === SUPER_ADMIN.UID ||
    activeTenantType === 'SUPER_ADMIN';

  // If no tenant is selected, try to automatically pick one if the user only has one
  if (!isSuperAdmin && !activeTenantId) {
    const { data: memberships } = await supabase
      .from('tenant_user_memberships')
      .select('tenant_id, role, tenants(type)')
      .eq('user_id', user.id)
      .eq('is_active', true);

    const typedMemberships = memberships as any[];

    if (typedMemberships?.length === 1) {
       const m = typedMemberships[0];
       const type = m.tenants.type;
       
       // Update user metadata 
       await supabase.auth.updateUser({
         data: {
           active_tenant_id: m.tenant_id,
           active_role: m.role,
           active_tenant_type: type
         }
       });

       const routeMap: Record<string, string> = {
         'INTEGRATOR': '/integrator/dashboard',
         'ENGINEERING_FIRM': '/engineering/dashboard',
         'RESELLER': '/reseller/dashboard'
       };

       if (routeMap[type]) {
         redirect(routeMap[type]);
       }
    }

    redirect('/select-company');
  }

  // Redirect based on current active tenant type if they land on generic root
  // (Optional, keeps them in their correct portal)

  // Delegate the entire rendering (including hooks like useDeviceType) to the Client Component
  return <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
}
