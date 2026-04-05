// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Star, MessageSquare } from 'lucide-react'

const reviews = [
  { id: 1, client: 'João S.', project: 'Residencial 5kWp', rating: 5, comment: 'Excelente trabalho, projeto entregue antes do prazo! Equipe muito profissional.', date: '01/04/2025', status: 'Publicada', response: null },
  { id: 2, client: 'Maria O.', project: 'Comercial 20kWp', rating: 4, comment: 'Muito bom atendimento, recomendo. Apenas o prazo poderia ser menor.', date: '28/03/2025', status: 'Respondida', response: 'Obrigado Maria! Vamos melhorar nossos prazos.' },
  { id: 3, client: 'Carlos S.', project: 'Residencial 8kWp', rating: 5, comment: 'Profissional e detalhista. Nota 10!', date: '25/03/2025', status: 'Publicada', response: null },
  { id: 4, client: 'Ana S.', project: 'Industrial 50kWp', rating: 3, comment: 'Projeto bom, mas a comunicação poderia ser melhor.', date: '20/03/2025', status: 'Publicada', response: null },
  { id: 5, client: 'Pedro L.', project: 'Residencial 3kWp', rating: 5, comment: 'Perfeito! Super indico.', date: '15/03/2025', status: 'Respondida', response: 'Muito obrigado Pedro!' },
]

export default function ReviewsPage() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<typeof reviews[0] | null>(null)
  const [responseText, setResponseText] = useState('')

  const avgRating = (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)

  const handleRespond = (review: typeof reviews[0]) => {
    setSelected(review)
    setResponseText('')
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações dos Clientes</h1>
        <p className="text-muted-foreground">Veja o que seus clientes pensam do seu trabalho</p>
      </div>

      {/* Card Resumo */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="pt-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-700">{avgRating}</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Média Geral</p>
            <p className="text-sm text-muted-foreground">{reviews.length} avaliações no total</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Cliente</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead className="hidden md:table-cell">Comentário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.client}</TableCell>
                  <TableCell className="text-sm">{r.project}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[250px] truncate">
                    {r.comment}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'Respondida' ? 'default' : 'outline'} className="text-xs">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status !== 'Respondida' && (
                      <Button variant="outline" size="sm" onClick={() => handleRespond(r)}>
                        <MessageSquare className="w-3 h-3 mr-1" /> Responder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Responder */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Avaliação</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{selected.client}</p>
                  <div className="flex gap-0.5">
                    {[...Array(selected.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selected.comment}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sua resposta</label>
                <Textarea rows={4} placeholder="Escreva sua resposta..." value={responseText} onChange={e => setResponseText(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Publicar resposta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
