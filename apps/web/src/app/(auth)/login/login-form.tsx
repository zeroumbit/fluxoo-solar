'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { login } from './actions';
import { TextInput, Checkbox, GlobalAuthStyles } from '../components/auth-ui';
import Link from 'next/link';

export default function LoginForm({ 
  error, 
  message 
}: { 
  error?: string; 
  message?: string 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    // the server action will redirect or re-render
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#f7f9fb]">
      <GlobalAuthStyles />
      <div className="absolute top-[0%] right-[10%] w-[40vw] h-[40vw] bg-[#ffd700]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] left-[10%] w-[30vw] h-[30vw] bg-[#705d00]/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative w-full max-w-[460px] z-10 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-full bg-[#ffffff] rounded-3xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] border border-[#d0c6ab]/20 p-8 md:p-12">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ffd700] flex items-center justify-center shadow-lg shadow-[#ffd700]/20 mb-6">
              <Zap className="w-7 h-7 text-[#705e00]" fill="currentColor" strokeWidth={1.5} />
            </div>
            <h1 className="font-['Manrope',sans-serif] text-3xl font-extrabold text-[#191c1e] tracking-tight mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sm font-medium text-[#545f73]">
              Insira as suas credenciais corporativas.
            </p>
          </div>

          {(error || message) && (
             <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${error ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]/20 text-[#ba1a1a]' : 'bg-[#1b6d24]/10 border-[#1b6d24]/20 text-[#1b6d24]'}`}>
                {error || message}
             </div>
          )}

          <form action={login} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <TextInput
                label="E-mail de acesso"
                name="email"
                type="email"
                placeholder="exemplo@empresa.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
                icon={<Mail />}
              />
              <TextInput
                label="Senha"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
                icon={<Lock />}
                hint={<Link href="#" className="hover:underline cursor-pointer">Esqueci a minha senha</Link>}
                action={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded text-[#7e775f] hover:text-[#705d00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
            </div>

            <div className="pt-1 pb-2">
              <Checkbox
                label="Manter sessão iniciada"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={(e) => setForm({...form, rememberMe: e.target.checked})}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#705d00] text-white font-bold py-4 text-[0.85rem] tracking-[0.1em] uppercase shadow-[0_10px_20px_rgba(112,93,0,0.15)] hover:shadow-[0_15px_30px_rgba(112,93,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> A Autenticar...</>
              ) : (
                <>Aceder à Plataforma <ArrowRight className="w-5 h-5" strokeWidth={2.5} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#f2f4f6] text-center">
            <p className="text-sm font-medium text-[#545f73]">
              Ainda não tem uma conta B2B?{' '}
              <Link
                href="/register"
                className="font-bold text-[#705d00] hover:text-[#e9c400] transition-colors hover:underline underline-offset-4"
              >
                Criar conta agora
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-[0.75rem] font-bold tracking-widest text-[#545f73] uppercase">
          <span className="hover:text-[#705d00] transition-colors hover:underline cursor-pointer">Termos de Uso</span>
          <span className="w-1.5 h-1.5 bg-[#d0c6ab] rounded-full" />
          <span className="hover:text-[#705d00] transition-colors hover:underline cursor-pointer">Políticas de Privacidade</span>
        </div>
      </div>
    </div>
  );
}
