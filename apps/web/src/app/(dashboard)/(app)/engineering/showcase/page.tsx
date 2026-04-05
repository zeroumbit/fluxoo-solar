'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Star, MapPin, Award, FileText, Globe, Plus, Save, Eye, X, Loader2
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@/lib/api/reviews'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// API para dados do tenant
async function getTenantData() {
  const response = await fetch(`${API_URL}/engineering/profile`)
  if (!response.ok) throw new Error('Não foi possível carregar dados da empresa')
  return response.json()
}

async function updateTenantData(data: any) {
  const response = await fetch(`${API_URL}/engineering/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Erro ao atualizar dados')
  return response.json()
}

export default function ShowcasePage() {
  const queryClient = useQueryClient()
  const [about, setAbout] = useState('')
  const [prices, setPrices] = useState({ residential: '', commercial: '', industrial: '' })
  const [crea, setCrea] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [newCity, setNewCity] = useState('')

  const { data: tenantData, isLoading } = useQuery({
    queryKey: ['engineering-profile'],
    queryFn: getTenantData
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['engineering-reviews'],
    queryFn: () => reviewsApi.list()
  })

  const { data: averageData } = useQuery({
    queryKey: ['engineering-reviews-average'],
    queryFn: () => reviewsApi.getAverage()
  })

  const updateMutation = useMutation({
    mutationFn: updateTenantData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engineering-profile'] })
    }
  })

  // Carregar dados quando disponíveis
  useState(() => {
    if (tenantData) {
      setAbout(tenantData.showcase_about || '')
      setPrices({
        residential: tenantData.price_residential || '',
        commercial: tenantData.price_commercial || '',
        industrial: tenantData.price_industrial || ''
      })
      setCrea(tenantData.crea || '')
      setCities(tenantData.cities || [])
    }
  })

  const handleAddCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()])
      setNewCity('')
    }
  }

  const handleRemoveCity = (city: string) => {
    setCities(cities.filter(c => c !== city))
  }

  const handleSave = () => {
    updateMutation.mutate({
      showcase_about: about,
      price_residential: prices.residential,
      price_commercial: prices.commercial,
      price_industrial: prices.industrial,
      crea: crea,
      cities: cities
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isActive = tenantData?.showcase_active ?? true
  const tenantName = tenantData?.fantasy_name || tenantData?.name || 'Minha Engenharia'
  const projectsCompleted = reviews.filter(r => r.project?.status === 'COMPLETED').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vitrine</h1>
          <p className="text-muted-foreground">Configure como os clientes encontram e veem sua empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={(checked) => {
            updateMutation.mutate({ showcase_active: checked })
          }} />
          <span className="text-sm font-medium">
            {isActive ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <Globe className="w-3 h-3 mr-1" /> Vitrine ativa
              </Badge>
            ) : (
              <Badge variant="secondary">Vitrine desativada</Badge>
            )}
          </span>
        </div>
      </div>

      {/* Preview Pública */}
      <Card className="border-2 border-dashed border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Pré-visualização Pública</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{tenantName}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-800">{averageData?.average || '—'}</span>
                  <span>({averageData?.count || 0} avaliações)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {cities[0] || 'Não definido'} — {cities.length > 1 ? `Atua em ${cities.length} cidades` : ''}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span><strong>{projectsCompleted}</strong> projetos concluídos</span>
                {crea && <span>CREA: <strong>{crea}</strong></span>}
              </div>
            </div>
          </div>

          <Separator />

          {about && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Sobre</h3>
              <p className="text-sm text-muted-foreground">{about}</p>
            </div>
          )}

          {(prices.residential || prices.commercial || prices.industrial) && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Tabela de Preços</h3>
              <div className="grid grid-cols-3 gap-3">
                {prices.residential && (
                  <Card className="p-3 text-center bg-slate-50">
                    <p className="text-xs text-muted-foreground">Residencial</p>
                    <p className="text-lg font-bold">R$ {prices.residential}</p>
                  </Card>
                )}
                {prices.commercial && (
                  <Card className="p-3 text-center bg-slate-50">
                    <p className="text-xs text-muted-foreground">Comercial</p>
                    <p className="text-lg font-bold">R$ {prices.commercial}</p>
                  </Card>
                )}
                {prices.industrial && (
                  <Card className="p-3 text-center bg-slate-50">
                    <p className="text-xs text-muted-foreground">Industrial</p>
                    <p className="text-lg font-bold">R$ {prices.industrial}</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Últimas Avaliações</h3>
              <div className="space-y-2">
                {reviews.slice(0, 3).map((r: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3 h-3 ${
                            j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm">{r.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        — {r.reviewer?.name || r.client_name || 'Cliente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edição */}
      <Card>
        <CardHeader><CardTitle className="text-base">Editar Vitrine</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sobre a empresa</Label>
            <Textarea
              rows={4}
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Descreva sua empresa, experiência e especialidades..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Preço residencial (R$)</Label>
              <Input
                value={prices.residential}
                onChange={e => setPrices(p => ({...p, residential: e.target.value}))}
                placeholder="1200"
              />
            </div>
            <div className="space-y-2">
              <Label>Preço comercial (R$)</Label>
              <Input
                value={prices.commercial}
                onChange={e => setPrices(p => ({...p, commercial: e.target.value}))}
                placeholder="2500"
              />
            </div>
            <div className="space-y-2">
              <Label>Preço industrial (R$)</Label>
              <Input
                value={prices.industrial}
                onChange={e => setPrices(p => ({...p, industrial: e.target.value}))}
                placeholder="5000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>CREA</Label>
            <Input
              value={crea}
              onChange={e => setCrea(e.target.value)}
              placeholder="5067892345-SP"
            />
          </div>

          <div className="space-y-2">
            <Label>Áreas de atuação</Label>
            <div className="flex flex-wrap gap-2">
              {cities.map((c, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {c}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveCity(c)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Adicionar cidade"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCity()}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={handleAddCity}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar
              </Button>
            </div>
          </div>

          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
