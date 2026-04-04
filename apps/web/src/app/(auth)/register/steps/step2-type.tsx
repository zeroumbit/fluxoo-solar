'use client';

import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Briefcase, TrendingUp, ChevronLeft } from 'lucide-react';

export function Step2Type() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  const handleSelect = (type: string) => {
    updateForm({ tenantType: type });
    nextStep();
  };

  const types = [
    {
      id: 'INTEGRATOR',
      title: 'Integradora',
      description: 'Instalo usinas solares do telhado ao solo.',
      icon: Zap,
    },
    {
      id: 'ENGINEERING_FIRM',
      title: 'Empresa de Engenharia',
      description: 'Faço projetos técnicos e emissão de ART.',
      icon: Briefcase,
    },
    {
      id: 'RESELLER',
      title: 'Revendedora',
      description: 'Vendo soluções de energia solar direto.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {types.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer transition-all border-2 ${
                formData.tenantType === type.id ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className={`p-2 rounded-lg ${formData.tenantType === type.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription className="text-xs">{type.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full flex gap-2" onClick={prevStep}>
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Button>
    </div>
  );
}
