'use client';

import React from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { SelectableCard } from '../../components/auth-ui';

export function Step6Plan() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.planId) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SelectableCard 
            title={<span className="text-2xl font-bold font-['Manrope']">ESSENTIAL</span>}
            description={
              <div className="mt-4">
                <div className="flex items-baseline gap-1 text-[#191c1e] mb-6">
                  <span className="text-lg font-bold">R$</span>
                  <span className="text-5xl font-extrabold font-['Manrope']">197</span>
                  <span className="text-[#545f73] font-medium">/mês</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> 50 Projetos</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> 5 Usuários</div>
                </div>
              </div>
            }
            isSelected={formData.planId?.toLowerCase() === 'essential'} 
            onClick={() => updateForm({ planId: 'ESSENTIAL' })}
          />
          <SelectableCard 
            title={<span className="text-2xl font-bold font-['Manrope']">PRO</span>}
            description={
              <div className="mt-4">
                <div className="flex items-baseline gap-1 text-[#191c1e] mb-6">
                  <span className="text-lg font-bold">R$</span>
                  <span className="text-5xl font-extrabold font-['Manrope']">497</span>
                  <span className="text-[#545f73] font-medium">/mês</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> 200 Projetos</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> 20 Usuários</div>
                </div>
              </div>
            }
            tag="MAIS POPULAR" 
            isSelected={formData.planId?.toLowerCase() === 'pro'} 
            onClick={() => updateForm({ planId: 'PRO' })}
          />
          <SelectableCard 
            title={<span className="text-2xl font-bold font-['Manrope']">ENTERPRISE</span>}
            description={
              <div className="mt-4">
                <div className="flex items-baseline gap-1 text-[#191c1e] mb-6">
                  <span className="text-lg font-bold">R$</span>
                  <span className="text-5xl font-extrabold font-['Manrope']">997</span>
                  <span className="text-[#545f73] font-medium">/mês</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> Projetos Ilimitados</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#1b6d24]" /> Usuários Ilimitados</div>
                </div>
              </div>
            }
            isSelected={formData.planId?.toLowerCase() === 'enterprise'} 
            onClick={() => updateForm({ planId: 'ENTERPRISE' })}
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
        <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        
        <button type="submit" disabled={!formData.planId} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
