import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2, MapPin, Phone, Mail, Activity, Database,
  Briefcase, ArrowLeft, CheckCircle2, Ban, Calendar
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

const typeLabels: Record<string, string> = {
  'INTEGRATOR': 'Integradora',
  'ENGINEERING_FIRM': 'Engenharia',
  'RESELLER': 'Revenda',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

function formatStorageMB(mb: number | string) {
  const value = typeof mb === 'string' ? parseFloat(mb) : mb
  if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} GB`
  }
  return `${value.toFixed(1)} MB`
}

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: tenantDetails } = await supabase
    .rpc('super_admin_tenant_details', { p_tenant_id: id })

  if (!tenantDetails || tenantDetails.length === 0) {
    notFound()
  }

  const tenant = tenantDetails[0]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <a href="/super-admin/tenants" className="inline-flex items-center justify-center rounded-lg border border-transparent bg-background h-8 w-8 text-sm font-medium hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-sky-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{tenant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {tenant.fantasy_name && (
                  <span className="text-sm text-slate-500">{tenant.fantasy_name}</span>
                )}
                <Badge variant={tenant.is_active ? 'default' : 'destructive'} className="text-xs">
                  {tenant.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {typeLabels[tenant.type] || tenant.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {tenant.is_active ? (
            <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">
              <Ban className="w-4 h-4 mr-2" /> Suspender
            </Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Reativar
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{tenant.active_projects}</p>
                <p className="text-xs text-slate-500">Projetos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{tenant.active_users}</p>
                <p className="text-xs text-slate-500">Usuários Ativos (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Database className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatStorageMB(tenant.total_storage_mb)}</p>
                <p className="text-xs text-slate-500">Storage Usado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{formatDate(tenant.created_at)}</p>
                <p className="text-xs text-slate-500">Data de Cadastro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Informações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Razão Social</p>
                <p className="text-sm text-slate-900 font-medium mt-1">{tenant.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome Fantasia</p>
                <p className="text-sm text-slate-900 font-medium mt-1">{tenant.fantasy_name || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CNPJ</p>
                <p className="text-sm font-mono text-slate-900 mt-1">{tenant.cnpj || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefone</p>
                <p className="text-sm text-slate-900 mt-1">{tenant.phone || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plano Atual</p>
              <p className="text-sm text-slate-900 font-medium mt-1">{tenant.plan_name || '—'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Atividade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Total de Projetos</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{tenant.total_projects}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Projetos Ativos</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{tenant.active_projects}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Total de Usuários</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{tenant.total_users}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">Usuários Ativos (30 dias)</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{tenant.active_users}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Storage Total</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatStorageMB(tenant.total_storage_mb)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
