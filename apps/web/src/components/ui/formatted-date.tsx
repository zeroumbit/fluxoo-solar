'use client'

import React from 'react'

interface FormattedDateProps {
  date: string | Date | null | undefined
  fallback?: string
  options?: Intl.DateTimeFormatOptions
}

export function FormattedDate({ date, fallback = '-', options }: FormattedDateProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!date) return <>{fallback}</>
  
  const d = typeof date === 'string' ? new Date(date) : date

  // Enquanto não montou, renderiza um placeholder ou o valor bruto
  // Isso evita o erro de hidratação por causa do locale ou timezone
  if (!mounted) {
    return <span suppressHydrationWarning>-</span> 
  }

  return <span suppressHydrationWarning>{d.toLocaleDateString('pt-BR', options)}</span>
}
