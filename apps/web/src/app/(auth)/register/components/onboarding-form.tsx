'use client';

import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Step1Access } from '../steps/step1-access';
import { Step2Type } from '../steps/step2-type';
import { Step3Company } from '../steps/step3-company';
import { Step4Address } from '../steps/step4-address';
import { Step5Responsible } from '../steps/step5-responsible';
import { Step6Plan } from '../steps/step6-plan';
import { Step7Checkout } from '../steps/step7-checkout';
import { Sun } from 'lucide-react';

export function OnboardingForm() {
  const { currentStep } = useOnboardingStore();

  const stepsTitle: Record<number, string> = {
    1: 'Dados de Acesso',
    2: 'Tipo de Organização',
    3: 'Empresa',
    4: 'Endereço',
    5: 'Responsável',
    6: 'Escolha o Plano',
    7: 'Finalização',
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
      default: return <Step1Access />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Sun className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Onboarding Corporativo</h1>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          Etapa {currentStep} de 7: <span className="font-semibold text-slate-800">{stepsTitle[currentStep]}</span>
        </p>
        <div className="flex gap-1 justify-center mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all ${
                        s <= currentStep ? 'bg-primary w-6' : 'bg-slate-200 w-2'
                    }`}
                />
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        {renderStep()}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Seus dados estão protegidos por criptografia de ponta no Fluxoo Solar.
      </p>
    </div>
  );
}
