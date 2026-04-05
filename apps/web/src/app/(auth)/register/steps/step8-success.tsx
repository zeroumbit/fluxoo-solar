'use client';

import { useOnboardingStore } from '@/store/use-onboarding-store';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function Step8Success() {
  const { reset } = useOnboardingStore();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center animate-in zoom-in-95 border border-[#f2f4f6]">
      <CheckCircle2 className="w-24 h-24 text-[#1b6d24] mx-auto mb-6" />
      <h1 className="text-4xl font-['Manrope'] font-bold text-[#191c1e] mb-4">Setup Concluído!</h1>
      <p className="text-[#545f73] mb-8 text-lg">A sua conta foi criada com sucesso. Bem-vindo ao Fluxoo Solar.</p>
      <Link href="/login" onClick={() => reset()} className="px-10 py-4 rounded-full bg-[#191c1e] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#2d3133] transition-all inline-block">
        Entre agora
      </Link>
    </div>
  );
}
