'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/store/use-onboarding-store';

const schema = z.object({
  name: z.string().min(3, 'Nome completo obrigatório'),
  cpf: z.string().min(11, 'CPF incompleto'),
  roleInCompany: z.string().min(2, 'Cargo/Função obrigatória'),
  phone: z.string().min(10, 'Celular obrigatório'),
});

export function Step5Responsible() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.responsible,
  });

  const onSubmit = (data: any) => {
    updateForm({ responsible: data });
    nextStep();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Responsável Legal</Label>
        <Input id="name" placeholder="Ex: João da Silva" {...form.register('name')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input id="cpf" placeholder="000.000.000-00" {...form.register('cpf')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleInCompany">Cargo na Empresa</Label>
        <Input id="roleInCompany" placeholder="Ex: Sócio Proprietário" {...form.register('roleInCompany')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Celular (WhatsApp)</Label>
        <Input id="phone" placeholder="(00) 90000-0000" {...form.register('phone')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" onClick={prevStep}>Voltar</Button>
        <Button type="submit">Próximo Passo</Button>
      </div>
    </form>
  );
}
