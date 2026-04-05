import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2, Search
} from 'lucide-react'
import { TenantFilters } from './tenant-filters-client'
import { TenantActionsDropdown } from './tenant-actions-dropdown'
import { createClient } from '@/lib/supabase/server'

const typeLabels: Record<string, string> = {
  'INTEGRATOR': 'Integradora',
  'ENGINEERING_FIRM': 'Engenharia',
  'RESELLER': 'Revenda',
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-rose-100 text-rose-700',
}

interface SearchParams {
  search?: string
  type?: string
  status?: string
  page?: string
}

export default async function SuperAdminTenants({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const page = parseInt(params.page || '1', 10)
  const limit = 20
  const search = params.search || null
  const typeFilter = params.type && params.type !== 'all-types' ? params.type : null
  const statusFilter = params.status && params.status !== 'all-status' ? params.status : null

  // Busca tenants via RPC
  const { data: tenantsResult, error } = await supabase
    .rpc('super_admin_list_tenants', {
      p_page: page,
      p_limit: limit,
      p_search: search,
      p_type: typeFilter,
      p_status: statusFilter,
    })

  const tenants = tenantsResult || []
  const totalCount = tenants.length > 0 ? tenants[0].total_count : 0
  const totalPages = Math.ceil(totalCount / limit)

  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, totalCount)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h1>
        <p className="text-muted-foreground mt-1">
          Visualize todas as empresas cadastradas na plataforma.{' '}
          <span className="font-medium text-slate-700">
            {totalCount} empresa{totalCount !== 1 ? 's' : ''} cadastrada{totalCount !== 1 ? 's' : ''}.
          </span>
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form className="relative w-full md:w-96" action="/super-admin/tenants" method="GET">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                name="search"
                defaultValue={search || ''}
                placeholder="Buscar por nome ou CNPJ..."
                className="pl-9 w-full"
              />
              {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
              {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
              <input type="hidden" name="page" value="1" />
              <button type="submit" className="sr-only">Buscar</button>
            </form>

            <TenantFilters
              defaultType={params.type || 'all-types'}
              defaultStatus={params.status || 'all-status'}
              search={search}
            />
          </div>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">Nenhuma empresa encontrada</h3>
              <p className="text-sm text-slate-500 mt-1">
                {search || typeFilter || statusFilter
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Nenhuma empresa cadastrada na plataforma ainda.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Nome</th>
                      <th className="px-4 py-3 font-medium">CNPJ</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Plano</th>
                      <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tenants.map((tenant: any) => (
                      <tr key={tenant.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{tenant.name}</p>
                            {tenant.fantasy_name && (
                              <p className="text-xs text-slate-500">{tenant.fantasy_name}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{tenant.cnpj || '—'}</td>
                        <td className="px-4 py-3 text-slate-600">
                          <Badge variant="outline">{typeLabels[tenant.type] || tenant.type}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.is_active
                              ? statusColors.active
                              : statusColors.inactive
                          }`}>
                            {tenant.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {tenant.plan_name || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <TenantActionsDropdown
                            tenantId={tenant.id}
                            isActive={tenant.is_active}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-slate-500">
                  Mostrando {startItem} a {endItem} de {totalCount} empresa{totalCount !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {page > 1 ? (
                    <a href={buildPageUrl(page - 1, { search, type: typeFilter, status: statusFilter })} className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-muted hover:text-foreground h-7 px-2.5 text-[0.8rem] font-medium transition-colors">
                      Anterior
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                  )}
                  {page < totalPages ? (
                    <a href={buildPageUrl(page + 1, { search, type: typeFilter, status: statusFilter })} className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-muted hover:text-foreground h-7 px-2.5 text-[0.8rem] font-medium transition-colors">
                      Próximo
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" disabled>Próximo</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function buildPageUrl(page: number, params: { search?: string | null; type?: string | null; status?: string | null }) {
  const url = new URL('/super-admin/tenants', 'http://localhost')
  url.searchParams.set('page', page.toString())
  if (params.search) url.searchParams.set('search', params.search)
  if (params.type) url.searchParams.set('type', params.type)
  if (params.status) url.searchParams.set('status', params.status)
  return url.pathname + url.search
}
