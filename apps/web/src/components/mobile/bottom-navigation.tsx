'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Briefcase, 
  CreditCard, 
  Users, 
  Settings,
  MessageSquare,
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenantStore } from '@/store/use-tenant-store';
import { signOut } from '@/app/(auth)/login/actions';

export function BottomNavigation() {
  const pathname = usePathname();
  const { activeTenant } = useTenantStore();

  const getNavItems = () => {
    const type = activeTenant?.type;
    
    if (type === 'INTEGRATOR') {
      return [
        { label: 'Home', icon: Home, href: '/integrator/dashboard' },
        { label: 'Projetos', icon: Briefcase, href: '/integrator/projects' },
        { label: 'Finanças', icon: CreditCard, href: '/integrator/finance' },
        { label: 'Equipe', icon: Users, href: '/integrator/team' },
      ];
    }

    if (type === 'ENGINEERING_FIRM') {
      return [
        { label: 'Projetos', icon: Briefcase, href: '/engineering/received-projects' },
        { label: 'Reviews', icon: MessageSquare, href: '/engineering/reviews' },
        { label: 'Finanças', icon: CreditCard, href: '/engineering/finance' },
        { label: 'Equipe', icon: Users, href: '/engineering/team' },
      ];
    }

    if (type === 'RESELLER') {
        return [
          { label: 'Vendas', icon: Home, href: '/reseller/dashboard' },
          { label: 'Projetos', icon: Briefcase, href: '/reseller/projects' },
          { label: 'Comissões', icon: CreditCard, href: '/reseller/commissions' },
        ];
    }

    if (type === 'SUPER_ADMIN') {
        return [
          { label: 'Home', icon: Home, href: '/super-admin/dashboard' },
          { label: 'Empresas', icon: Building2, href: '/super-admin/tenants' },
          { label: 'Planos', icon: CreditCard, href: '/super-admin/plans' },
          { label: 'Auditoria', icon: ShieldCheck, href: '/super-admin/audit' },
        ];
    }

    return [
      { label: 'Home', icon: Home, href: '/' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 pb-safe z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-all",
              isActive ? "text-primary scale-110" : "text-slate-400"
            )}
          >
            <div className={cn(
                "p-1 rounded-xl transition-all",
                isActive ? "bg-primary/10" : ""
            )}>
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            </div>
            <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter",
                isActive ? "text-primary" : "text-slate-400"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
      
      <form action={signOut} className="flex flex-col items-center gap-1 min-w-[64px] transition-all text-slate-400 opacity-60 hover:opacity-100">
        <button type="submit" className="p-1 rounded-xl">
           <LogOut className="w-5 h-5 stroke-2" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-tighter">Sair</span>
      </form>
    </nav>
  );
}
