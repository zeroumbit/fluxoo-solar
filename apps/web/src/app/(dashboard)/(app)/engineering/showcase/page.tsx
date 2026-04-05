// @ts-nocheck
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
  Star, MapPin, Award, FileText, Globe, Plus, Save, Eye, X
} from 'lucide-react'

const reviews = [
  { client: 'João S.', rating: 5, text: 'Excelente trabalho, projeto entregue antes do prazo!' },
  { client: 'Maria O.', rating: 4, text: 'Muito bom atendimento, recomendo.' },
  { client: 'Carlos S.', rating: 5, text: 'Profissional e detalhista. Nota 10!' },
]

const cities = ['São Paulo, SP', 'Campinas, SP', 'Guarulhos, SP', 'Santos, SP']

export default function ShowcasePage() {
  const [isActive, setIsActive] = useState(true)
  const [about, setAbout] = useState('Engenharia especializada em projetos fotovoltaicos residenciais, comerciais e industriais. Mais de 10 anos de experiência no mercado de energia solar.')
  const [prices, setPrices] = useState({ residential: '1200', commercial: '2500', industrial: '5000' })
  const [crea, setCrea] = useState('5067892345-SP')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vitrine</h1>
          <p className="text-muted-foreground">Configure como os clientes encontram e veem sua empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
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
              <h2 className="text-xl font-bold">Carla Engenharia</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-800">4.9</span>
                  <span>(142 avaliações)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> São Paulo, SP — Atua em todo estado
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span><strong>47</strong> projetos concluídos</span>
                <span>CREA: <strong>{crea}</strong></span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-2">Sobre</h3>
            <p className="text-sm text-muted-foreground">{about}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Tabela de Preços</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center bg-slate-50">
                <p className="text-xs text-muted-foreground">Residencial</p>
                <p className="text-lg font-bold">R$ {prices.residential}</p>
              </Card>
              <Card className="p-3 text-center bg-slate-50">
                <p className="text-xs text-muted-foreground">Comercial</p>
                <p className="text-lg font-bold">R$ {prices.commercial}</p>
              </Card>
              <Card className="p-3 text-center bg-slate-50">
                <p className="text-xs text-muted-foreground">Industrial</p>
                <p className="text-lg font-bold">R$ {prices.industrial}</p>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Últimas Avaliações</h3>
            <div className="space-y-2">
              {reviews.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm">{r.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">— {r.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edição */}
      <Card>
        <CardHeader><CardTitle className="text-base">Editar Vitrine</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sobre a empresa</Label>
            <Textarea rows={4} value={about} onChange={e => setAbout(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Preço residencial (R$)</Label>
              <Input value={prices.residential} onChange={e => setPrices(p => ({...p, residential: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Preço comercial (R$)</Label>
              <Input value={prices.commercial} onChange={e => setPrices(p => ({...p, commercial: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Preço industrial (R$)</Label>
              <Input value={prices.industrial} onChange={e => setPrices(p => ({...p, industrial: e.target.value}))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>CREA</Label>
            <Input value={crea} onChange={e => setCrea(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Áreas de atuação</Label>
            <div className="flex flex-wrap gap-2">
              {cities.map((c, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {c} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="w-3 h-3 mr-1" /> Adicionar cidade
            </Button>
          </div>

          <Button><Save className="w-4 h-4 mr-2" /> Salvar alterações</Button>
        </CardContent>
      </Card>
    </div>
  )
}
