'use client';

import { useTenantStore } from '@/store/use-tenant-store';
import { useMemo } from 'react';

/**
 * Hook para verificar permissões e roles de forma reativa no frontend.
 * Lê do tenant context do Zustand.
 */
export function usePermissions() {
  const { activeRole, activeTenant } = useTenantStore();

  const permissions = useMemo(() => {
    // Para MVP, as permissões são baseadas na ROLE. 
    // Em produção, isso viria de uma tabela de permissões no Supabase.
    const rolePermissions: Record<string, string[]> = {
      OWNER: ['all', 'manage:team', 'manage:billing', 'manage:projects'],
      MANAGER: ['manage:team', 'manage:projects'],
      ENGINEER: ['manage:projects', 'view:technical'],
      SALES: ['manage:leads', 'view:commercial'],
    };

    return activeRole ? rolePermissions[activeRole] || [] : [];
  }, [activeRole]);

  const hasPermission = (permission: string) => {
    if (permissions.includes('all')) return true;
    return permissions.includes(permission);
  };

  const isRole = (role: string) => {
    return activeRole === role;
  };

  return { permissions, hasPermission, isRole, activeTenant };
}
