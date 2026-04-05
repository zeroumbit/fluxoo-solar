'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function selectTenant(tenantId: string, role: string, type: string) {
  const supabase = await createClient()

  // In a multi-tenant Supabase setup, to have custom RLS policies that read dynamic claims,
  // we would ideally update the user's app_metadata.
  
  // Update the session's active metadata
  const { error } = await supabase.auth.updateUser({
    data: {
      active_tenant_id: tenantId,
      active_role: role,
      active_tenant_type: type,
    }
  })

  if (error) {
    console.error('Switch Tenant Error:', error.message)
  }

  // Define route mapping
  const routeMap: Record<string, string> = {
    'SUPER_ADMIN': '/super-admin/dashboard',
    'INTEGRATOR': '/integrator/dashboard',
    'ENGINEERING_FIRM': '/engineering/dashboard',
    'RESELLER': '/reseller/dashboard'
  }

  const targetRoute = routeMap[type] || '/unauthorized'

  revalidatePath('/', 'layout')
  redirect(targetRoute)
}
