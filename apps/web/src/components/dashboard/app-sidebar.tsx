// @ts-nocheck
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
  Building2,
  CreditCard,
  ToggleRight,
  MessageSquare,
  Activity,
  ShieldCheck,
  LogOut
} from 'lucide-react'

import { signOut } from '@/app/(auth)/login/actions'
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
    { title: 'Dashboard', url: '/integrator/dashboard', icon: LayoutDashboard },
    { title: 'Projetos', url: '/integrator/projects', icon: FileText },
    { title: 'Engenharia', url: '/integrator/engineering', icon: Briefcase },
    { title: 'Revendedores', url: '/integrator/resellers', icon: Zap },
    { title: 'Clientes', url: '/integrator/clients', icon: Users },
    { title: 'Financeiro', url: '/integrator/finance', icon: CreditCard },
    { title: 'Equipe', url: '/integrator/team', icon: Building2 },
    { title: 'Configurações', url: '/integrator/settings', icon: Settings },
  ],
  engineering: [
    { title: 'Dashboard', url: '/engineering/dashboard', icon: LayoutDashboard },
    { title: 'Projetos Recebidos', url: '/engineering/received-projects', icon: Briefcase },
    { title: 'Meus Clientes', url: '/engineering/my-clients', icon: Users },
    { title: 'Vitrine', url: '/engineering/showcase', icon: Activity },
    { title: 'Avaliações', url: '/engineering/reviews', icon: TrendingUp },
    { title: 'Financeiro', url: '/engineering/financial', icon: Zap },
    { title: 'Equipe', url: '/engineering/team', icon: Building2 },
    { title: 'Configurações', url: '/engineering/settings', icon: Settings },
  ],
  reseller: [
    { title: 'Home', url: '/reseller/dashboard', icon: LayoutDashboard },
    { title: 'Meus Projetos', url: '/reseller/projects', icon: FileText },
    { title: 'Comissões', url: '/reseller/commissions', icon: Zap },
    { title: 'Indicar Cliente', url: '/reseller/refer', icon: Users },
    { title: 'Links de Afiliado', url: '/reseller/links', icon: TrendingUp },
    { title: 'Configurações', url: '/reseller/settings', icon: Settings },
  ],
  superadmin: [
    { title: 'Dashboard', url: '/super-admin/dashboard', icon: LayoutDashboard },
    { title: 'Empresas', url: '/super-admin/tenants', icon: Building2 },
    { title: 'Planos', url: '/super-admin/plans', icon: CreditCard },
    { title: 'Métricas', url: '/super-admin/metrics', icon: PieChart },
    { title: 'Feature Flags', url: '/super-admin/feature-flags', icon: ToggleRight },
    { title: 'Suporte Técnico', url: '/super-admin/support', icon: MessageSquare },
    { title: 'Config. Globais', url: '/super-admin/settings', icon: Settings },
    { title: 'Auditoria', url: '/super-admin/audit', icon: ShieldCheck },
  ],
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

  let currentRole = 'integrator';
  if (pathname.startsWith('/super-admin')) currentRole = 'superadmin';
  else if (pathname.startsWith('/engineering')) currentRole = 'engineering';
  else if (pathname.startsWith('/reseller')) currentRole = 'reseller';
  
  const navItems = navigation[currentRole as keyof typeof navigation] || navigation.integrator

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-200">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 font-semibold text-slate-400">Navegação Principal</SidebarGroupLabel>
          <SidebarMenu className="px-3 gap-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={active}
                        className={`h-11 rounded-lg px-3 transition-all ${
                            active
                                ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                        render={
                          <Link href={item.url}>
                            <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-slate-500'}`} />
                            <span className="text-sm">{item.title}</span>
                          </Link>
                        }
                    />
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 pt-0 border-t border-slate-100 bg-slate-50/20">
        <SidebarMenu>
          <SidebarMenuItem className="mb-2">
              <form action={signOut}>
                  <SidebarMenuButton 
                      type="submit"
                      className="h-11 w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl px-4 transition-all flex items-center gap-3 font-bold group"
                      tooltip="Sair do Sistema"
                  >
                      <LogOut className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Encerrar Sessão</span>
                  </SidebarMenuButton>
              </form>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
