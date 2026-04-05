'use client';

import React from 'react';
import { Zap, Building2, Flame, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { SelectableCard } from '../../components/auth-ui';

export function Step2Type() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tenantType) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectableCard 
            title="Integradora" 
            description="Instalo usinas solares" 
            icon={<Zap className="w-8 h-8" />} 
            isSelected={formData.tenantType === 'INTEGRATOR'} 
            onClick={() => updateForm({ tenantType: 'INTEGRATOR', planId: null, selectedPlan: null })} 
          />
          <SelectableCard 
            title="Engenharia" 
            description="Faço projetos e ART" 
            icon={<Building2 className="w-8 h-8" />} 
            isSelected={formData.tenantType === 'ENGINEERING_FIRM'} 
            onClick={() => updateForm({ tenantType: 'ENGINEERING_FIRM', planId: null, selectedPlan: null })} 
          />
          <SelectableCard 
            title="Revendedora" 
            description="Vendo para clientes" 
            icon={<Flame className="w-8 h-8" />} 
            isSelected={formData.tenantType === 'RESELLER'} 
            onClick={() => updateForm({ tenantType: 'RESELLER', planId: null, selectedPlan: null })} 
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
        <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        
        <button type="submit" disabled={!formData.tenantType} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
