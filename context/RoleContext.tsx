'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'MT' | 'OT' | 'H1' | 'H2' | 'M1' | 'M2' | 'R1' | 'R2';

const ROLES: Role[] = ['MT', 'OT', 'H1', 'H2', 'M1', 'M2', 'R1', 'R2'];

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  allRoles: Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <RoleContext.Provider value={{ role, setRole, allRoles: ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
