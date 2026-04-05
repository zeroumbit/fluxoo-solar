// @ts-nocheck
'use client';

import React from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { SelectableCard } from '../../components/auth-ui';
import { useQuery } from '@tanstack/react-query';
import { plansApi } from '@/lib/api/plans';

export function Step6Plan() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  // Buscar planos reais filtrados pelo tipo de empresa selecionado no Step 2
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['onboarding-plans', formData.tenantType],
    queryFn: () => plansApi.list(formData.tenantType),
    enabled: !!formData.tenantType
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.planId) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="animate-in fade-in">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#ffd700]" />
            <p className="text-[#545f73] font-medium animate-pulse">Carregando planos disponíveis para {formData.tenantType}...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-[#545f73]">Nenhum plano disponível para o tipo selecionado no momento.</p>
            <button type="button" onClick={prevStep} className="mt-4 text-[#705e00] font-bold underline">Voltar e alterar tipo</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <SelectableCard 
                key={plan.id}
                title={<span className="text-2xl font-bold font-['Manrope'] uppercase">{plan.name}</span>}
                description={
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1 text-[#191c1e] mb-6">
                      <span className="text-lg font-bold">R$</span>
                      <span className="text-5xl font-extrabold font-['Manrope']">{(plan.price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                      <span className="text-[#545f73] font-medium">/mês</span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> {plan.max_projects >= 9999 ? 'Projetos Ilimitados' : `${plan.max_projects} Projetos`}</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> {plan.max_users} Usuários Inclusos</div>
                      {(plan.features || []).slice(0, 2).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#545f73] text-sm italic">
                          <CheckCircle2 className="w-4 h-4 text-[#ffd700]" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                }
                tag={plan.is_featured ? "RECOMENDADO" : undefined}
                isSelected={formData.planId === plan.id} 
                onClick={() => updateForm({ planId: plan.id, selectedPlan: plan })}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
        <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        
        <button type="submit" disabled={!formData.planId || isLoading} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
          Continuar para Checkout <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
