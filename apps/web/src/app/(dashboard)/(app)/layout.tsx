import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

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

  if (!activeTenantId) {
    redirect('/select-company')
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        user={{
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email!,
            avatar: user.user_metadata?.avatar_url
        }}
      />
      <SidebarInset className="bg-slate-50/50">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/60 px-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Fluxoo Solar
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:p-8 pt-4 overflow-y-auto max-w-[1600px]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
