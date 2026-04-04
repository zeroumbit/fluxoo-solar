'use client'

import * as React from 'react'
import {
  PieChart,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Briefcase,
  Zap,
  TrendingUp,
} from 'lucide-react'

import { NavUser } from '@/components/dashboard/nav-user'
import { TeamSwitcher } from '@/components/dashboard/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

// Full navigation mapping based on role/tenant_type
const navigation = {
  integrator: [
    { title: 'Início', url: '/integrator/dashboard', icon: LayoutDashboard },
    { title: 'Projetos', url: '/integrator/projetos', icon: FileText },
    { title: 'Minha Equipe', url: '/integrator/equipe', icon: Users },
    { title: 'Financeiro', url: '/integrator/financeiro', icon: Zap },
    { title: 'Configurações', url: '/integrator/settings', icon: Settings },
  ],
  // ... and others
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Simplified team mapping for demo. 
  // In Phase 2, this would fetch from Zustand store or server side.
  const teams = [
    {
      name: 'Fluxoo Solar',
      logo: Zap,
      plan: 'Organização Ativa',
    }
  ]

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-200">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 font-semibold text-slate-400">Navegação Principal</SidebarGroupLabel>
          <SidebarMenu className="px-3 gap-1">
            {navigation.integrator.map((item) => {
              const active = pathname.startsWith(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={`h-11 rounded-lg px-3 transition-all ${
                            active 
                                ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                    >
                    <Link href={item.url}>
                        <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-slate-500'}`} />
                        <span className="text-sm">{item.title}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-100 bg-slate-50/20">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
