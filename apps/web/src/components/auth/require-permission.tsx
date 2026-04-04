'use client';

import { usePermissions } from '@/hooks/use-permissions';
import { ReactNode } from 'react';

interface RequirePermissionProps {
  permission?: string;
  role?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Componente Wrapper para esconder ou mostrar UI baseado em permissões.
 * Proteção visual no frontend.
 */
export function RequirePermission({
  permission,
  role,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const { hasPermission, isRole } = usePermissions();

  const hasAccess = 
    (!permission || hasPermission(permission)) && 
    (!role || isRole(role));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
