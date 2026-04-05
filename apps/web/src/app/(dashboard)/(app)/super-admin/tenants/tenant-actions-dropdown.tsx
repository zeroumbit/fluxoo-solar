'use client'

import { useState } from 'react'
import { MoreVertical, Eye, Ban, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toggleTenantStatus } from './actions'
import Link from 'next/link'

interface TenantActionsDropdownProps {
  tenantId: string
  isActive: boolean
}

export function TenantActionsDropdown({ tenantId, isActive }: TenantActionsDropdownProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleTenantStatus(tenantId, !isActive)
    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/super-admin/tenants/${tenantId}`} className="relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground">
          <Eye className="w-4 h-4 mr-2" /> Ver detalhes
        </Link>
        <DropdownMenuSeparator />
        {isActive ? (
          <DropdownMenuItem
            className="text-rose-600 focus:text-rose-700 cursor-pointer"
            disabled={loading}
            onClick={handleToggle}
          >
            <Ban className="w-4 h-4 mr-2" /> {loading ? 'Suspensão...' : 'Suspender'}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-emerald-600 focus:text-emerald-700 cursor-pointer"
            disabled={loading}
            onClick={handleToggle}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> {loading ? 'Ativando...' : 'Reativar'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
