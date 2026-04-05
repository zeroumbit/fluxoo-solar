'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShieldCheck, HardDrive, Mail, Save, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SuperAdminSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações Globais</h1>
          <p className="text-muted-foreground mt-1">Ajustes de segurança, compliance e limites do sistema.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Salvar Configurações
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm font-medium text-amber-700">
          Alterações nestas configurações afetam todos os tenants e entram em vigor imediatamente.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-500" /> Compliance e LGPD
            </CardTitle>
            <CardDescription>Regras automáticas de governança de dados e privacidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="lgpd_days">Dias para Exclusão Permanente (Soft Delete)</Label>
                 <Input id="lgpd_days" type="number" defaultValue="30" />
                 <p className="text-xs text-slate-500">
                    Após um inquilino excluir um projeto, os arquivos serão mantidos no S3 por este período antes de serem fisicamente removidos.
                 </p>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="audit_retention">Retenção de Logs de Auditoria (Meses)</Label>
                 <Input id="audit_retention" type="number" defaultValue="12" />
                 <p className="text-xs text-slate-500">
                    Tempo mínimo de armazenamento legal dos registros de acesso e alterações sensíveis.
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-slate-500" /> Limites e Infraestrutura
            </CardTitle>
            <CardDescription>Sobrescrita global de teto de recursos (proteção contra abusos).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="max_storage">Teto Hard Limit de Storage Ocasional (GB)</Label>
                 <Input id="max_storage" type="number" defaultValue="100" />
                 <p className="text-xs text-slate-500">
                    Nenhum Inquilino poderá ultrapassar este limite máximo absoluto de arquivos, mesmo com upgrades manuais.
                 </p>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="max_branches">Limite Absoluto de Filiais/Franquias</Label>
                 <Input id="max_branches" type="number" defaultValue="50" />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-500" /> Utilitários do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="font-medium text-sm text-slate-900">Serviço de Email Transacional (Resend)</p>
                <p className="text-xs text-slate-500">Verifique se as credenciais SMTP/API estão funcionando ao enviar um e-mail de teste para si mesmo.</p>
              </div>
              <Button variant="secondary" className="shrink-0 bg-white">Testar Envio de Email</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
