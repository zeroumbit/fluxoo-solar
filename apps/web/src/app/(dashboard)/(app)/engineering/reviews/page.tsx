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
import { Star, MessageSquare, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@/lib/api/reviews'

export default function ReviewsPage() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [responseText, setResponseText] = useState('')
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['engineering-reviews'],
    queryFn: () => reviewsApi.list()
  })

  const { data: averageData } = useQuery({
    queryKey: ['engineering-reviews-average'],
    queryFn: () => reviewsApi.getAverage()
  })

  const respondMutation = useMutation({
    mutationFn: ({ reviewId, response }: { reviewId: string; response: string }) =>
      reviewsApi.respond(reviewId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engineering-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['engineering-reviews-average'] })
      setOpen(false)
      setResponseText('')
    }
  })

  const avgRating = averageData?.average || 0
  const totalReviews = averageData?.count || reviews.length

  const handleRespond = (review: any) => {
    setSelected(review)
    setResponseText(review.engineering_response || '')
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
            <p className="text-4xl font-bold text-amber-700">{avgRating || '—'}</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Média Geral</p>
            <p className="text-sm text-muted-foreground">{totalReviews} avaliações no total</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm italic">
              Nenhuma avaliação recebida ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead className="hidden md:table-cell">Comentário</TableHead>
                  <TableHead className="hidden md:table-cell">Integradora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r: any) => {
                  const hasResponse = !!r.engineering_response
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.reviewer?.name || r.client_name || 'Cliente'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.project?.title || r.project?.code || 'Projeto'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[250px] truncate">
                        {r.comment}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {r.project?.integrator?.fantasy_name || r.project?.integrator?.name || 'Integradora'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={hasResponse ? 'default' : 'outline'} className="text-xs">
                          {hasResponse ? 'Respondida' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRespond(r)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {hasResponse ? 'Editar' : 'Responder'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Responder */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected?.engineering_response ? 'Editar Resposta' : 'Responder Avaliação'}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">
                    {selected.reviewer?.name || selected.client_name || 'Cliente'}
                  </p>
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
                <Textarea
                  rows={4}
                  placeholder="Escreva sua resposta..."
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              onClick={() =>
                respondMutation.mutate({
                  reviewId: selected.id,
                  response: responseText
                })
              }
              disabled={respondMutation.isPending || !responseText.trim()}
            >
              {respondMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Publicar resposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
