import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sun } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden">
        <div className="bg-primary h-2 w-full" />
        <CardHeader className="space-y-4 pt-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Sun className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Fluxoo Solar</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {searchParams.error && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
              {searchParams.error}
            </div>
          )}
          {searchParams.message && (
            <div className="p-3 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
              {searchParams.message}
            </div>
          )}
          
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nome@empresa.com" 
                required 
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button variant="link" size="sm" className="px-0 h-auto font-normal text-muted-foreground">
                  Esqueceu a senha?
                </Button>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-slate-50"
              />
            </div>
            <Button formAction={login} className="w-full font-semibold py-6 text-base">
              Acessar Plataforma
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 pt-2 flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{' '}
            <Button variant="link" className="px-0 font-semibold p-0 h-auto">
              Cadastre sua empresa
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
