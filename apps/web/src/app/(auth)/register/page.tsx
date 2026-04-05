import { Metadata } from 'next';
import { OnboardingForm } from './components/onboarding-form';
import { GlobalAuthStyles } from '../components/auth-ui';

export const metadata: Metadata = {
  title: 'Cadastro Fluxoo Solar — Onboarding Corporativo',
  description: 'Cadastre sua empresa na melhor plataforma para energia solar.',
};

export default function RegisterPage() {
  return (
    <>
      <GlobalAuthStyles />
      <OnboardingForm />
    </>
  );
}
