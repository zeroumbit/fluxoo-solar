'use client'

import * as React from 'react'
import {
  Building2,
  ChevronsUpDown,
  Plus,
  Zap,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-900">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-slate-200 shadow-xl"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 uppercase font-bold tracking-wider">
              Suas Organizações
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 cursor-pointer focus:bg-primary/5"
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-slate-200">
                  <team.logo className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{team.name}</span>
                  <span className="text-[10px] text-muted-foreground">{team.plan}</span>
                </div>
                <DropdownMenuShortcut className="text-xs">⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer text-primary bg-primary/5 hover:bg-primary/10">
              <div className="flex size-6 items-center justify-center rounded-md border border-primary/20 bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-xs">Nova Unidade</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
