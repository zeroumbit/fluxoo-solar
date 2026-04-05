'use client';

import React from 'react';
import { Check, Mail } from 'lucide-react';

// --- INJEÇÃO DE ESTILOS GLOBAIS E FONTES ---
export const GlobalAuthStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #f7f9fb;
      color: #191c1e;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6, .font-headline {
      font-family: 'Manrope', sans-serif;
    }

    .text-kinetic-sun {
      background: linear-gradient(135deg, #705d00 0%, #e9c400 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f7f9fb; }
    ::-webkit-scrollbar-thumb { background: #d0c6ab; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #7e775f; }
  `}} />
);

// --- COMPONENTES DE UI REUTILIZÁVEIS ---
export const TextInput = ({ label, type = "text", placeholder, value, onChange, required, hint, icon, action, readOnly, maxLength, as = 'input' as const, children, error, name }: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  hint?: React.ReactNode;
  icon?: React.ReactElement;
  action?: React.ReactNode;
  readOnly?: boolean;
  maxLength?: number;
  as?: 'input' | 'select';
  children?: React.ReactNode;
  error?: string;
  name?: string;
}) => (
  <div className="space-y-2 group w-full">
    <div className="flex justify-between items-end">
      <label className="block text-[0.75rem] font-bold text-[#545f73] uppercase tracking-wider ml-1 transition-colors group-focus-within:text-[#705d00]">
        {label} {required && <span className="text-[#ba1a1a]">*</span>}
      </label>
      {hint && <span className="text-[0.65rem] font-bold text-[#705d00] flex items-center gap-1 uppercase">{hint}</span>}
    </div>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: 'w-5 h-5 text-[#7e775f]' } as any)}
        </div>
      )}
      {as === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-[#f2f4f6] rounded-xl py-4 text-sm font-medium text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:bg-white transition-all duration-200 border ${error ? 'border-[#ba1a1a]' : 'border-transparent'} appearance-none cursor-pointer ${icon ? 'pl-12' : 'px-5'}`}
        >
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          readOnly={readOnly}
          maxLength={maxLength}
          required={required}
          className={`w-full bg-[#f2f4f6] rounded-xl py-4 text-sm font-medium text-[#191c1e] placeholder:text-[#d0c6ab] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:bg-white transition-all duration-200 border ${readOnly ? 'opacity-70 cursor-not-allowed border-transparent' : error ? 'border-[#ba1a1a]' : 'border-transparent'} ${icon ? 'pl-12' : 'px-5'} ${action ? 'pr-12' : 'pr-5'}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      {action && <div className="absolute inset-y-0 right-2 flex items-center">{action}</div>}
    </div>
    {error && <p className="text-xs text-[#ba1a1a] font-bold mt-1.5 ml-1">{error}</p>}
  </div>
);

export const Checkbox = ({ label, checked, onChange, required, name }: {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
}) => (
  <label className="flex items-start gap-3 group cursor-pointer">
    <div className={`mt-0.5 flex flex-shrink-0 items-center justify-center w-5 h-5 border-2 rounded transition-colors bg-white ${checked ? 'border-[#ffd700]' : 'border-[#d0c6ab] group-hover:border-[#ffd700]'}`}>
      <input name={name} type="checkbox" className="hidden" checked={checked} onChange={onChange} required={required} />
      <Check className={`w-3.5 h-3.5 text-[#705e00] transition-transform ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
    </div>
    <span className="text-sm font-medium text-[#545f73] leading-snug group-hover:text-[#191c1e] transition-colors">
      {label}
    </span>
  </label>
);

export const SelectableCard = ({ title, description, icon, isSelected, onClick, tag }: {
  title: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  tag?: string;
}) => (
  <div 
    onClick={onClick}
    className={`relative cursor-pointer transition-all duration-200 border-2 rounded-xl p-5 flex flex-col items-start gap-4 hover:-translate-y-1 ${
      isSelected ? 'border-[#705d00] bg-[#fffbeb] shadow-[0_4px_12px_rgba(112,93,0,0.08)]' : 'border-[#d0c6ab]/30 bg-[#ffffff] hover:border-[#d0c6ab]'
    }`}
  >
    {tag && (
      <div className="absolute -top-3 left-4 bg-[#705d00] text-white text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
        {tag}
      </div>
    )}
    <div className={`transition-colors ${isSelected ? 'text-[#705d00]' : 'text-[#545f73]'}`}>
      {icon}
    </div>
    <div className="w-full">
      <div className="font-['Manrope',sans-serif] font-bold text-[#191c1e] text-lg leading-tight">{title}</div>
      <div className="text-[0.75rem] text-[#545f73] mt-1 w-full">{description}</div>
    </div>
  </div>
);

// --- FUNÇÕES DE MÁSCARA ---
export const applyMaskCNPJ = (val: string) => {
  return val.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

export const applyMaskCEP = (val: string) => {
  return val.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
};

export const applyMaskCPF = (val: string) => {
  return val.replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .substring(0, 14);
};

export const applyMaskPhone = (val: string) => {
  let v = val.replace(/\D/g, '');
  if (v.length <= 10) {
    return v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 14);
  }
  return v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
};
