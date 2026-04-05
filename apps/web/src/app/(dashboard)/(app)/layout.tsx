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

  // Fetch active tenant from metadata or redirect to selection if not set
  const activeTenantId = user.app_metadata?.active_tenant_id
  
  const isSuperAdmin = 
    user.email === SUPER_ADMIN.EMAIL || 
    user.id === SUPER_ADMIN.UID ||
    user.app_metadata?.active_tenant_type === 'SUPER_ADMIN';

  if (!activeTenantId && !isSuperAdmin) {
    redirect('/select-company')
  }

  // Delegate the entire rendering (including hooks like useDeviceType) to the Client Component
  return <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
}
