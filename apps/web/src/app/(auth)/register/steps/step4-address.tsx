'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { onboardingApi } from '@/lib/api/onboarding';
import { Loader2, Search } from 'lucide-react';

const schema = z.object({
  cep: z.string().min(8, 'CEP incompleto'),
  street: z.string().min(3, 'Logradouro obrigatório'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, 'Bairro obrigatório'),
  city: z.string().min(3, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
});

export function Step4Address() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.address,
  });

  const handleCepSearch = async () => {
    const cep = form.getValues('cep').replace(/\D/g, '');
    if (cep.length !== 8) return;

    setLoading(true);
    try {
      const data = await onboardingApi.getCepData(cep);
      form.setValue('street', data.logradouro || '');
      form.setValue('neighborhood', data.bairro || '');
      form.setValue('city', data.localidade || '');
      form.setValue('state', data.uf || '');
      toast({ title: 'Endereço encontrado!', description: 'Campos preenchidos automaticamente.' });
    } catch (err) {
      // Ignorar erro silenciosamente se ViaCEP falhar
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    updateForm({ address: data });
    nextStep();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <div className="flex gap-1.5">
                <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    {...form.register('cep')} 
                />
                <Button type="button" variant="ghost" className="px-2" onClick={handleCepSearch} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="state">UF</Label>
            <Input id="state" placeholder="SP" {...form.register('state')} maxLength={2} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Logradouro</Label>
        <Input id="street" placeholder="Rua / Avenida" {...form.register('street')} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 space-y-2">
            <Label htmlFor="number">Nº</Label>
            <Input id="number" placeholder="123" {...form.register('number')} />
        </div>
        <div className="col-span-3 space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" placeholder="Sala 1, Bloco A..." {...form.register('complement')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" {...form.register('neighborhood')} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...form.register('city')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" onClick={prevStep}>Voltar</Button>
        <Button type="submit">Próximo Passo</Button>
      </div>
    </form>
  );
}
