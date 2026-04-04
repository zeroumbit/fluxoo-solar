'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/store/use-onboarding-store';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export function Step1Access() {
  const { updateForm, nextStep, formData } = useOnboardingStore();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: formData.email,
      password: formData.password,
    },
  });

  const onSubmit = (data: any) => {
    updateForm(data);
    nextStep();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail de acesso corporativo</Label>
        <Input 
          id="email" 
          placeholder="admin@empresa.com.br" 
          {...form.register('email')} 
          className={form.formState.errors.email ? 'border-destructive' : ''}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">{form.formState.errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password" 
          {...form.register('password')} 
          className={form.formState.errors.password ? 'border-destructive' : ''}
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message as string}</p>
        )}
      </div>

      <Button type="submit" className="w-full">Próximo Passo</Button>
    </form>
  );
}
