'use client'

import React from 'react'
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
import { NotificationBell } from '@/components/notifications/notification-bell'
import { OfflineIndicator } from '@/components/offline/offline-indicator'
import { useDeviceType } from '@/hooks/use-device-type'
import { BottomNavigation } from '@/components/mobile/bottom-navigation'

export function DashboardClientLayout({ 
  user, 
  children 
}: { 
  user: any; 
  children: React.ReactNode 
}) {
  const device = useDeviceType();

  if (device === 'mobile') {
    return (
        <div className="flex flex-col h-screen bg-slate-50/50">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 px-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 w-full mb-0">
             <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tighter text-slate-900">FLUXOO</span>
             </div>
             <div className="flex items-center gap-3">
                 <OfflineIndicator />
                 <NotificationBell />
             </div>
          </header>
          <main className="flex-1 overflow-y-auto pb-24 p-6 w-full max-w-full">
            {children}
          </main>
          <BottomNavigation />
        </div>
    );
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
      <SidebarInset className="bg-slate-50/50 min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/60 px-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-4">
                <OfflineIndicator />
                <Separator orientation="vertical" className="h-4 bg-slate-200 hidden md:block" />
                <NotificationBell />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:p-8 pt-4 overflow-y-auto max-w-[1600px] w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
