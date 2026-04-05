'use client';

import React, { useState } from 'react';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { TextInput, applyMaskCPF, applyMaskPhone } from '../../components/auth-ui';

export function Step5Responsible() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();
  
  const [localForm, setLocalForm] = useState({
    name: formData.responsible?.name || '',
    cpf: formData.responsible?.cpf || '',
    roleInCompany: formData.responsible?.roleInCompany || '',
    phone: formData.responsible?.phone || '',
  });

  const updateLocalField = (field: string, value: string) => {
    setLocalForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm({ responsible: localForm });
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="space-y-6">
        <TextInput 
          label="Nome completo" 
          placeholder="João da Silva" 
          required 
          icon={<User />} 
          value={localForm.name} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('name', e.target.value)} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput 
            label="CPF" 
            placeholder="000.000.000-00" 
            required 
            maxLength={14} 
            value={localForm.cpf} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('cpf', applyMaskCPF(e.target.value))} 
          />
          <TextInput 
            label="Cargo" 
            as="select" 
            required 
            value={localForm.roleInCompany} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('roleInCompany', e.target.value)}
          >
            <option value="" disabled>Selecione</option>
            <option value="Dono">Dono</option>
            <option value="Sócio">Sócio</option>
            <option value="Administrador">Administrador</option>
          </TextInput>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput 
            label="Telefone celular" 
            placeholder="(00) 0 0000-0000" 
            type="tel" 
            required 
            maxLength={15} 
            value={localForm.phone} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('phone', applyMaskPhone(e.target.value))} 
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
        <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        
        <button type="submit" className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
