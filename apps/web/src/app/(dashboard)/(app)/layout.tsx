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

  // Check for unauthorized access 
  if (!isSuperAdmin && !activeTenantId) {
    redirect('/select-company');
  }

  // Delegate the entire rendering (including hooks like useDeviceType) to the Client Component
  return <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
}
