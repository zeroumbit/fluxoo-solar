'use client';

import React, { useState } from 'react';
import { CreditCard, Building2, Zap, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { TextInput } from '../../components/auth-ui';
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

export function Step7Checkout() {
  const { formData, nextStep, prevStep } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Send only exactly what the backend DTO expects
      const apiData = {
          email: formData.email,
          password: formData.password,
          tenantType: formData.tenantType,
          company: formData.company,
          address: formData.address,
          responsible: formData.responsible,
          planId: formData.planId
      };
      
      await onboardingApi.register(apiData);
      nextStep(); // Go to Step 8 Success
    } catch (err) {
      console.error("Checkout error", err);
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
    <form onSubmit={handleFinish} className="animate-in fade-in grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'credit_card', label: 'Cartão de Crédito', icon: <CreditCard className="w-8 h-8 mb-2" /> },
            { id: 'boleto', label: 'Boleto', icon: <Building2 className="w-8 h-8 mb-2" /> },
            { id: 'pix', label: 'PIX', icon: <Zap className="w-8 h-8 mb-2" /> }
          ].map(method => (
            <label key={method.id} className={`relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#705d00] text-[#705d00] shadow-sm bg-[#fffbeb]' : 'border-[#d0c6ab]/30 text-[#545f73] hover:border-[#d0c6ab]'}`}>
              <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)} className="absolute opacity-0" />
              {method.icon}
              <span className="font-bold text-sm">{method.label}</span>
            </label>
          ))}
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="bg-[#f7f9fb] p-8 rounded-xl border border-[#d0c6ab]/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <TextInput label="Nome no Cartão" value={cardData.cardName} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setCardData({...cardData, cardName: e.target.value})} required />
            </div>
            <div className="md:col-span-2">
              <TextInput label="Número" value={cardData.cardNumber} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setCardData({...cardData, cardNumber: e.target.value})} required />
            </div>
            <TextInput label="Validade" placeholder="MM/AA" value={cardData.cardExpiry} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setCardData({...cardData, cardExpiry: e.target.value})} required />
            <TextInput label="CVV" type="password" value={cardData.cardCvv} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setCardData({...cardData, cardCvv: e.target.value})} required />
          </div>
        )}

        {paymentMethod === 'pix' && (
          <div className="bg-[#f7f9fb] p-8 rounded-xl border border-[#d0c6ab]/30 text-center">
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-[#d0c6ab]/50 mb-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=fluxoo-pix" alt="QR Code" className="w-full h-full opacity-90" />
            </div>
            <p className="text-sm font-mono bg-white p-3 rounded-lg border border-[#e0e3e5] text-[#545f73] mb-6 truncate">00020126580014br.gov.bcb.pix...</p>
            <div className="text-left">
              <label className="block text-[0.75rem] font-bold text-[#545f73] uppercase tracking-wider mb-2">Upload Comprovante</label>
              <input type="file" className="w-full bg-white border border-[#d0c6ab]/50 rounded-lg p-2 text-sm text-[#545f73] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#ffd700] file:text-[#705d00] cursor-pointer" />
            </div>
          </div>
        )}

        {paymentMethod === 'boleto' && (
          <div className="bg-[#fffbeb] p-6 rounded-xl border border-[#ffd700]/50 text-[#705d00] text-sm font-bold flex items-center justify-center gap-3">
            <Building2 className="w-6 h-6" /> O boleto será gerado automaticamente.
          </div>
        )}

        <div className="pt-8 border-t border-[#f2f4f6] flex justify-between gap-4">
          <button type="button" onClick={prevStep} className="px-6 py-3.5 text-[#545f73] font-bold uppercase tracking-widest text-[0.8rem] hover:bg-[#f2f4f6] rounded-xl flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>
          
          <button type="submit" disabled={isLoading} className="px-8 py-3.5 bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold uppercase tracking-widest text-[0.8rem] rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalizar Assinatura'} 
          </button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-[#191c1e] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden sticky top-32">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-bl-full blur-xl"></div>
          <h3 className="text-xs font-bold text-[#ffd700] uppercase tracking-widest mb-2">Resumo</h3>
          <p className="text-2xl font-['Manrope'] font-bold mb-8 uppercase">Plano {formData.selectedPlan?.name || 'Não selecionado'}</p>
          <div className="flex justify-between border-t border-white/10 pt-6">
            <span className="text-sm text-[#a0aabf]">Total a Pagar</span>
            <span className="text-2xl font-bold text-[#ffd700]">R$ {((formData.selectedPlan?.price_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
          </div>
        </div>
      </div>
    </form>

    {/* Error Dialog */}
    <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl">
        <div className="flex flex-col items-center text-center py-8">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <AlertCircle className="w-10 h-10 text-rose-600" />
          </div>

          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
            Erro ao Finalizar Cadastro
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="text-slate-500 text-base leading-relaxed mb-6">
            Não foi possível concluir seu cadastro. Ocorreu um erro inesperado durante o processamento.
          </DialogDescription>

          {/* Info Box */}
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-amber-700 text-left">
                Por favor, verifique seus dados e tente novamente. Se o problema persistir, entre em contato com o suporte.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <DialogFooter className="w-full">
            <Button
              onClick={() => setErrorDialogOpen(false)}
              className="w-full h-12 text-base font-semibold bg-gradient-to-br from-[#ffd700] to-[#705d00] hover:from-[#e6c200] hover:to-[#634f00] text-white shadow-lg"
            >
              Tentar Novamente
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
