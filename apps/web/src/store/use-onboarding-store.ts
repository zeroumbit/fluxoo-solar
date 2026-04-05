'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface OnboardingState {
  currentStep: OnboardingStep;
  formData: any;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: any) => void;
  reset: () => void;
}

/**
 * Store Zustand para gerenciar o estado global do Onboarding Multi-step.
 * Persistência para não perder dados se a página for recarregada no meio do fluxo.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: {
        email: '',
        password: '',
        tenantType: '',
        company: { cnpj: '', legalName: '', fantasyName: '', phone: '' },
        address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
        responsible: { name: '', cpf: '', roleInCompany: '', phone: '' },
        planId: 'PRO', // Default
      },

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ 
        currentStep: (state.currentStep + 1) as OnboardingStep 
      })),

      prevStep: () => set((state) => ({ 
        currentStep: (state.currentStep - 1) as OnboardingStep 
      })),

      updateForm: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),

      reset: () => set({ 
        currentStep: 1, 
        formData: { 
            email: '', 
            password: '', 
            tenantType: '', 
            company: {}, 
            address: {}, 
            responsible: {}, 
            planId: 'PRO' 
        } 
      }),
    }),
    { name: 'fluxoo-solar-onboarding' }
  )
);
