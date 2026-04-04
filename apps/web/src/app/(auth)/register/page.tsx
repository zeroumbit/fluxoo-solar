import { OnboardingForm } from './components/onboarding-form';

export const metadata = {
  title: 'Cadastro Fluxoo Solar — Onboarding Corporativo',
  description: 'Cadastre sua empresa na melhor plataforma para energia solar.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <OnboardingForm />
    </div>
  );
}
