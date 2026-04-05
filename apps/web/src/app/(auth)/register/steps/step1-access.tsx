'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { TextInput, Checkbox } from '../../components/auth-ui';

export function Step1Access() {
  const { updateForm, nextStep, formData } = useOnboardingStore();
  const [showPassword, setShowPassword] = useState(false);
  const [localForm, setLocalForm] = useState({
    email: formData.email || '',
    password: formData.password || '',
    terms: formData.terms || false,
    privacy: formData.privacy || false,
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm(localForm);
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="space-y-6">
        <TextInput 
          label="E-mail" 
          type="email" 
          placeholder="exemplo@fluxoo.solar" 
          required 
          icon={<Mail />} 
          value={localForm.email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setLocalForm({ ...localForm, email: e.target.value })} 
        />
        <TextInput 
          label="Senha" 
          type={showPassword ? "text" : "password"} 
          placeholder="••••••••" 
          required 
          icon={<Lock />} 
          value={localForm.password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setLocalForm({ ...localForm, password: e.target.value })} 
          action={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 text-[#7e775f] hover:text-[#705d00] outline-none">
              {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
            </button>
          } 
        />
        <p className="text-xs text-[#545f73] font-medium flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#1b6d24]" /> A senha deve conter no mínimo 6 caracteres.</p>
        
        <div className="pt-2 space-y-3">
          <Checkbox 
            label={<>Li e concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" onClick={(e: React.MouseEvent) => e.stopPropagation()} className="text-[#705d00] font-bold hover:underline">Termos de Uso</a>.</>} 
            checked={localForm.terms} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalForm({ ...localForm, terms: e.target.checked })} 
            required 
          />
          <Checkbox 
            label={<>Li e concordo com as <a href="/privacidade" target="_blank" rel="noopener noreferrer" onClick={(e: React.MouseEvent) => e.stopPropagation()} className="text-[#705d00] font-bold hover:underline">Políticas de Privacidade</a>.</>} 
            checked={localForm.privacy} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalForm({ ...localForm, privacy: e.target.checked })} 
            required 
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#f2f4f6] flex justify-end gap-4">
        <button type="submit" className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
