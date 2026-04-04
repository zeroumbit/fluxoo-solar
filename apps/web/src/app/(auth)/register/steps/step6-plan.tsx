'use client';

import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';

export function Step6Plan() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  const plans = [
    { id: 'ESSENTIAL', name: 'ESSENTIAL', price: '197', features: ['5 Projetos/mês', '1 Equipe', 'Suporte E-mail'] },
    { id: 'PRO', name: 'PRO', price: '497', features: ['Projetos Ilimitados', 'Equipes Ilimitadas', 'Suporte WhatsApp'] },
    { id: 'ENTERPRISE', name: 'ENTERPRISE', price: '997', features: ['Personalização Total', 'Multifilial', 'Gerente de Contas'] },
  ];

  const handleSelect = (pid: string) => {
    updateForm({ planId: pid });
    nextStep();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {plans.map((p) => (
          <Card 
            key={p.id} 
            className={`cursor-pointer transition-all border-2 ${
                formData.planId === p.id ? 'border-primary shadow-md' : 'hover:border-primary/40'
            }`}
            onClick={() => handleSelect(p.id)}
          >
            <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <div className="text-xl font-bold text-primary">R$ {p.price}<span className="text-xs text-muted-foreground">/mês</span></div>
                </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-2">
                {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-green-600" /> {f}
                    </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full flex gap-2" onClick={prevStep}>
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Button>
    </div>
  );
}
