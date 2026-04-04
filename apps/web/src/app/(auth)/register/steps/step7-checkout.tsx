'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { onboardingApi } from '@/lib/api/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Loader2, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step7Checkout() {
  const { formData, reset, prevStep } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onboardingApi.register(formData);
      toast({ title: 'Tudo pronto!', description: 'Sua empresa foi cadastrada. Faça login para começar.' });
      reset();
      router.push('/login?message=Cadastro realizado! Faça login para acessar sua conta.');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Falha no cadastro', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="text-center space-y-2">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <CardTitle className="text-2xl font-bold">Confirmação de Acesso</CardTitle>
        <p className="text-sm text-muted-foreground px-4">
            Ao confirmar, sua conta corporativa será criada no **Fluxoo Solar**. 
            Nesta etapa experimental, o pagamento será processado via boleto após o primeiro acesso.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <div className="bg-white rounded-lg p-4 border space-y-2 shadow-sm text-sm">
            <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Empresa:</span>
                <span className="font-semibold">{formData.company.legalName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Plano Selecionado:</span>
                <span className="font-semibold">{formData.planId}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">E-mail:</span>
                <span className="font-semibold">{formData.email}</span>
            </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full text-lg h-14" onClick={handleFinish} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
                 <Loader2 className="w-5 h-5 animate-spin" /> Processando...
            </div>
          ) : (
            'Finalizar Cadastro e Contratar'
          )}
        </Button>
        {!loading && (
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={prevStep}>
            Revisar dados
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
