'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Settings, Save, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SuperAdminFeatureFlags() {
  const [flags, setFlags] = useState({
    offline_mode_completo: false,
    projetista_showcase_enabled: true,
    assinatura_digital: true,
    whatsapp_notifications: false,
  })

  const handleToggle = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feature Flags</h1>
          <p className="text-muted-foreground mt-1">Ative ou desative recursos experimentais globalmente.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Salvar todas as alterações
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Atenção: Ao desativar uma funcionalidade global, ela ficará invisível e inacessível para todos os inquilinos, sobrepondo as permissões individuais dos planos.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-500" />
              Gestão de Funcionalidades
            </CardTitle>
            <CardDescription>Configure as variáveis de ambiente em tempo de execução.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 text-base">Modo Offline Completo</div>
                <p className="text-sm text-slate-500 max-w-xl">
                  Permite o uso do PWA sem conectividade para a criação de projetos. Atualmente em fase Beta fechado.
                </p>
              </div>
              <Switch 
                checked={flags.offline_mode_completo}
                onCheckedChange={() => handleToggle('offline_mode_completo')}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 text-base">Showcase de Projetistas</div>
                <p className="text-sm text-slate-500 max-w-xl">
                  Habilita a vitrine pública de portfólios no marketplace de mão de obra para empresas Integradoras.
                </p>
              </div>
              <Switch 
                checked={flags.projetista_showcase_enabled}
                onCheckedChange={() => handleToggle('projetista_showcase_enabled')}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 text-base">Módulo de Assinatura Digital</div>
                <p className="text-sm text-slate-500 max-w-xl">
                  Integração nativa com Docusign/Zapsign. Requer configuração do webhook de terceiros.
                </p>
              </div>
              <Switch 
                checked={flags.assinatura_digital}
                onCheckedChange={() => handleToggle('assinatura_digital')}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 text-base">Notificações por WhatsApp</div>
                <p className="text-sm text-slate-500 max-w-xl">
                  Dispara alertas transacionais via WhatsApp (criação de projetos, boletos vencendo). Custo adicional por disparo.
                </p>
              </div>
              <Switch 
                checked={flags.whatsapp_notifications}
                onCheckedChange={() => handleToggle('whatsapp_notifications')}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 rounded-b-xl border-t mt-4">
              <p className="text-xs text-slate-500 w-full text-center">Última alteração: hoje às 14:32 por Super Admin</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
