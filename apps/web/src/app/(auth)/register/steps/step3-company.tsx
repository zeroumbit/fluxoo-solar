'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { TextInput, applyMaskCNPJ, applyMaskPhone } from '../../components/auth-ui';
import { onboardingApi } from '@/lib/api/onboarding';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Step3Company() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCnpjNotFoundDialog, setShowCnpjNotFoundDialog] = useState(false);
  
  const [localForm, setLocalForm] = useState({
    cnpj: formData.company?.cnpj || '',
    legalName: formData.company?.legalName || '',
    fantasyName: formData.company?.fantasyName || '',
    phone: formData.company?.phone || '',
  });

  const updateLocalField = (field: string, value: string) => {
    setLocalForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const searchCnpj = async () => {
      const cleanCnpj = localForm.cnpj.replace(/\D/g, '');
      if (cleanCnpj.length === 14) {
        setIsLoading(true);
        try {
          const data = await onboardingApi.getCnpjData(cleanCnpj);
          if (data) {
            setLocalForm(prev => ({
                ...prev,
                legalName: data.razao_social || prev.legalName,
                fantasyName: data.nome_fantasia || data.razao_social || prev.fantasyName,
                phone: data.ddd_telefone_1 || prev.phone,
            }));
          } else {
            setShowCnpjNotFoundDialog(true);
          }
        } catch (err) {
          console.error("CNPJ error", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    searchCnpj();
  }, [localForm.cnpj]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm({ company: localForm });
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-8 animate-in fade-in">
      <div className="space-y-6">
        <TextInput 
          label="CNPJ" 
          placeholder="00.000.000/0000-00" 
          required 
          maxLength={18} 
          value={localForm.cnpj} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('cnpj', applyMaskCNPJ(e.target.value))} 
          action={isLoading && <Loader2 className="w-5 h-5 text-[#705d00] animate-spin" />} 
        />
        <TextInput 
          label="Razão Social" 
          placeholder={isLoading ? "A procurar dados..." : "Preenchimento Automático via API"} 
          required 
          value={localForm.legalName} 
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('legalName', e.target.value)} 
          readOnly={isLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput 
            label="Nome Fantasia" 
            placeholder="Nome da marca" 
            value={localForm.fantasyName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateLocalField('fantasyName', e.target.value)} 
          />
          <TextInput 
            label="Telefone" 
            placeholder="(00) 0000-0000" 
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
        
        <button type="submit" disabled={isLoading} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CNPJ Not Found Dialog */}
      <Dialog open={showCnpjNotFoundDialog} onOpenChange={setShowCnpjNotFoundDialog}>
        <DialogContent className="sm:max-w-[450px] border-none shadow-2xl">
          <div className="flex flex-col items-center text-center py-8">
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              CNPJ Não Encontrado
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-slate-500 text-base leading-relaxed mb-6">
              Não conseguimos localizar os dados do CNPJ{' '}
              <span className="font-semibold text-slate-900">{localForm.cnpj}</span>{' '}
              automaticamente na Receita Federal.
            </DialogDescription>

            {/* Info Box */}
            <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-sky-100 rounded-lg shrink-0">
                  <svg className="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-sky-700 text-left">
                  Por favor, preencha manualmente os campos abaixo:{' '}
                  <strong>Razão Social</strong>, <strong>Nome Fantasia</strong> e{' '}
                  <strong>Telefone</strong>.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <DialogFooter className="w-full">
              <Button
                onClick={() => setShowCnpjNotFoundDialog(false)}
                className="w-full h-12 text-base font-semibold bg-gradient-to-br from-[#ffd700] to-[#705d00] hover:from-[#e6c200] hover:to-[#634f00] text-white shadow-lg"
              >
                Entendi, vou preencher manualmente
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
