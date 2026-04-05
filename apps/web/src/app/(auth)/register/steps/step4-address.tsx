'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { TextInput, applyMaskCEP } from '../../components/auth-ui';
import { onboardingApi } from '@/lib/api/onboarding';

export function Step4Address() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [localForm, setLocalForm] = useState({
    cep: formData.address?.cep || '',
    street: formData.address?.street || '',
    number: formData.address?.number || '',
    complement: formData.address?.complement || '',
    neighborhood: formData.address?.neighborhood || '',
    city: formData.address?.city || '',
    state: formData.address?.state || '',
  });

  const updateLocalField = (field: string, value: string) => {
    setLocalForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const searchCep = async () => {
      const cleanCep = localForm.cep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setIsLoading(true);
        try {
          const data = await onboardingApi.getCepData(cleanCep);
          if (!data.erro) {
            setLocalForm(prev => ({
              ...prev,
              street: data.logradouro || prev.street,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
            }));
          }
        } catch (err) {
          console.error("CEP error", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    searchCep();
  }, [localForm.cep]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm({ address: localForm });
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput 
            label="CEP" 
            placeholder="00000-000" 
            required 
            maxLength={9} 
            icon={<MapPin />} 
            value={localForm.cep} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('cep', applyMaskCEP(e.target.value))} 
            action={isLoading && <Loader2 className="w-5 h-5 text-[#705d00] animate-spin" />} 
          />
        </div>
        <TextInput 
          label="Logradouro" 
          placeholder="Rua, Avenida..." 
          required 
          value={localForm.street} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('street', e.target.value)} 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput 
            label="Número" 
            placeholder="123" 
            required 
            value={localForm.number} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('number', e.target.value)} 
          />
          <div className="md:col-span-2">
            <TextInput 
              label="Complemento" 
              placeholder="Sala, Andar..." 
              value={localForm.complement} 
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('complement', e.target.value)} 
            />
          </div>
        </div>
        <TextInput 
          label="Bairro" 
          placeholder="Nome do Bairro" 
          required 
          value={localForm.neighborhood} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('neighborhood', e.target.value)} 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TextInput 
              label="Cidade" 
              placeholder="Cidade" 
              required 
              value={localForm.city} 
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('city', e.target.value)} 
            />
          </div>
          <TextInput 
            label="Estado" 
            as="select" 
            required 
            value={localForm.state} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('state', e.target.value)}
          >
            <option value="">UF</option>
            <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option>
            <option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option>
            <option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
            <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option>
            <option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option>
            <option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
            <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
          </TextInput>
        </div>
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
        <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        
        <button type="submit" disabled={isLoading} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
