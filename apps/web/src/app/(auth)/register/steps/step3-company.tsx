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
import { Loader2, Search, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  cnpj: z.string().min(14, 'CNPJ incompleto'),
  legalName: z.string().min(5, 'Razão Social obrigatória'),
  fantasyName: z.string().min(3, 'Nome Fantasia obrigatório'),
  phone: z.string().min(10, 'Telefone obrigatório'),
});

export function Step3Company() {
  const { updateForm, nextStep, prevStep, formData } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.company,
  });

  const handleCnpjSearch = async () => {
    const cnpj = form.getValues('cnpj').replace(/\D/g, '');
    if (cnpj.length !== 14) return;

    setLoading(true);
    try {
      const data = await onboardingApi.getCnpjData(cnpj);
      form.setValue('legalName', data.razao_social || '');
      form.setValue('fantasyName', data.nome_fantasia || data.razao_social || '');
      form.setValue('phone', data.ddd_telefone_1 || '');
      toast({ title: 'Dados encontrados!', description: 'CNPJ validado com sucesso.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'CNPJ não encontrado', description: 'Por favor preencha manualmente.' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    updateForm({ company: data });
    nextStep();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ da Empresa</Label>
        <div className="flex gap-2">
          <Input 
            id="cnpj" 
            placeholder="00.000.000/0001-00" 
            {...form.register('cnpj')} 
          />
          <Button type="button" variant="secondary" onClick={handleCnpjSearch} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="legalName">Razão Social</Label>
        <Input id="legalName" {...form.register('legalName')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fantasyName">Nome Fantasia</Label>
        <Input id="fantasyName" {...form.register('fantasyName')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone Comercial</Label>
        <Input id="phone" placeholder="(00) 0000-0000" {...form.register('phone')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" onClick={prevStep}>Voltar</Button>
        <Button type="submit">Próximo Passo</Button>
      </div>
    </form>
  );
}
