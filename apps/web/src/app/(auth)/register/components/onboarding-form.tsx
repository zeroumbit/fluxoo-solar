'use client';

import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Step1Access } from '../steps/step1-access';
import { Step2Type } from '../steps/step2-type';
import { Step3Company } from '../steps/step3-company';
import { Step4Address } from '../steps/step4-address';
import { Step5Responsible } from '../steps/step5-responsible';
import { Step6Plan } from '../steps/step6-plan';
import { Step7Checkout } from '../steps/step7-checkout';
import { Step8Success } from '../steps/step8-success';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { GlobalAuthStyles } from '../../components/auth-ui';

export function OnboardingForm() {
  const { currentStep } = useOnboardingStore();

  const stepsTitle: Record<number, string> = {
    1: "Dados de Acesso", 
    2: "Tipo de Empresa", 
    3: "Dados da Empresa", 
    4: "Endereço", 
    5: "Responsável", 
    6: "Plano", 
    7: "Checkout"
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Access />;
      case 2: return <Step2Type />;
      case 3: return <Step3Company />;
      case 4: return <Step4Address />;
      case 5: return <Step5Responsible />;
      case 6: return <Step6Plan />;
      case 7: return <Step7Checkout />;
      case 8: return <Step8Success />;
      default: return <Step1Access />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] selection:bg-[#ffd700]/30 selection:text-[#705e00] bg-[#f7f9fb] animate-in fade-in duration-500">
      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] flex justify-between items-center px-8 py-4">
        <Link href="/login" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 bg-[#ffd700] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#705e00]" fill="currentColor" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold tracking-tighter text-[#191c1e] uppercase font-['Manrope',sans-serif]">FLUXOO SOLAR</span>
        </Link>
        
        {currentStep < 8 && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[0.65rem] font-bold text-[#545f73] uppercase tracking-widest">Etapa {currentStep} de 7</span>
            <div className="h-1.5 w-48 bg-[#eceef0] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#ffd700] transition-all duration-500 ease-out" style={{ width: `${(currentStep / 7) * 100}%` }}></div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-6">
        <div className={`w-full max-w-6xl grid grid-cols-1 ${currentStep < 6 ? 'lg:grid-cols-12' : ''} gap-12 items-start`}>
          
          {/* NARRATIVA VISUAL (Steps 1 to 5) - Sem imagem, apenas texto */}
          {currentStep < 6 && (
            <div className="hidden lg:flex lg:col-span-5 flex-col gap-8 sticky top-32">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-[#ffd700]/20 text-[#705e00] font-bold text-[0.65rem] rounded-full uppercase tracking-widest">
                  ONBOARDING B2B
                </span>
                <h1 className="font-['Manrope',sans-serif] text-5xl font-extrabold tracking-tight leading-tight text-[#191c1e]">
                  A energia que <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#705d00] to-[#e9c400]">move o amanhã.</span>
                </h1>
                <p className="text-[#545f73] text-lg leading-relaxed">
                  Configure o seu ecossistema solar em 7 passos simples. Precisão técnica e escalabilidade integradas num só lugar.
                </p>
              </div>
            </div>
          )}

          {/* ÁREA DO FORMULÁRIO */}
          <div className={`${currentStep < 6 ? 'lg:col-span-7' : 'w-full max-w-4xl mx-auto'} ${currentStep < 8 ? 'bg-white rounded-3xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] border border-[#d0c6ab]/20 p-8 md:p-12 relative overflow-hidden' : ''}`}>
            {currentStep < 8 && (
              <div className="mb-10">
                <h2 className={`font-['Manrope',sans-serif] text-3xl font-extrabold text-[#191c1e] tracking-tight ${currentStep >= 6 ? 'text-center text-4xl' : ''}`}>
                  {stepsTitle[currentStep]}
                </h2>
              </div>
            )}

            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
