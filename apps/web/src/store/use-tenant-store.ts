import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TenantType = 'SUPER_ADMIN' | 'INTEGRATOR' | 'ENGINEERING_FIRM' | 'RESELLER';
export type UserRole = 'OWNER' | 'MANAGER' | 'ENGINEER' | 'DRAFTSMAN' | 'FINANCE' | 'SALES' | 'ASSISTANT_DESIGNER';

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  fantasy_name?: string;
}

export interface Membership {
  tenant_id: string;
  user_id: string;
  role: UserRole;
  tenant: Tenant;
}

interface TenantState {
  activeTenant: Tenant | null;
  activeRole: UserRole | null;
  memberships: Membership[];
  setMemberships: (memberships: Membership[]) => void;
  setActiveTenant: (tenant: Tenant, role: UserRole) => void;
  clear: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      activeTenant: null,
      activeRole: null,
      memberships: [],
      setMemberships: (memberships) => set({ memberships }),
      setActiveTenant: (tenant, role) => set({ activeTenant: tenant, activeRole: role }),
      clear: () => set({ activeTenant: null, activeRole: null, memberships: [] }),
    }),
    {
      name: 'fluxoo-tenant-storage',
    }
  )
)
