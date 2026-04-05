'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'

interface TenantFiltersProps {
  defaultType: string
  defaultStatus: string
  search: string | null
}

export function TenantFilters({ defaultType, defaultStatus, search }: TenantFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'all-types' && value !== 'all-status') {
          params.set(name, value)
        } else {
          params.delete(name)
        }
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
      }, 300)
    },
    [searchParams, router, pathname]
  )

  const handleClear = () => {
    router.push('/super-admin/tenants')
  }

  const hasFilters = search || defaultType !== 'all-types' || defaultStatus !== 'all-status'

  return (
    <div className="flex flex-wrap gap-2 w-full md:w-auto">
      <Select defaultValue={defaultType} onValueChange={(value) => createQueryString('type', value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-types">Todos os Tipos</SelectItem>
          <SelectItem value="INTEGRATOR">Integradora</SelectItem>
          <SelectItem value="ENGINEERING_FIRM">Engenharia</SelectItem>
          <SelectItem value="RESELLER">Revenda</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={defaultStatus} onValueChange={(value) => createQueryString('status', value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">Todos os Status</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={handleClear}>
          Limpar
        </Button>
      )}
    </div>
  )
}
