'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRole, type Role } from '@/context/RoleContext';
import { useQuiz } from '@/context/QuizContext';

type RoleName = 'Tank' | 'Healer' | 'Melee' | 'Ranged';

const ROLE_ORDER: RoleName[] = ['Tank', 'Healer', 'Melee', 'Ranged'];

const ROLE_INFO: Record<
  RoleName,
  { label: string; party1: Role; party2: Role }
> = {
  Tank: { label: 'Tank', party1: 'MT', party2: 'OT' },
  Healer: { label: 'Healer', party1: 'H1', party2: 'H2' },
  Melee: { label: 'Melee', party1: 'M1', party2: 'M2' },
  Ranged: { label: 'Ranged', party1: 'R1', party2: 'R2' },
};

const MECHANIC_ICONS: Record<string, string> = {
  stack: '/stack.svg',
  spread: '/prox.svg',
  cone: '/cone.svg',
};

const ROLE_ICONS: Record<RoleName, string> = {
  Tank: '/Tank.png',
  Healer: '/Healer.png',
  Melee: '/Melee.png',
  Ranged: '/Ranged.png',
};

function getPartyNumber(role: Role): 1 | 2 {
  if (role === 'MT') return 1;
  if (role === 'OT') return 2;
  return role.endsWith('1') ? 1 : 2;
}

function getPartyRole(roleName: RoleName, party: 1 | 2): Role {
  return party === 1 ? ROLE_INFO[roleName].party1 : ROLE_INFO[roleName].party2;
}

const PartyDisplay = memo(function PartyDisplay() {
  const { role } = useRole();
  const { assignments, mode } = useQuiz();
  const [hidden, setHidden] = useState(false);
  const [changedRoles, setChangedRoles] = useState<Set<Role>>(new Set());
  const prevAssignmentsRef = useRef<Record<Role, string> | null>(null);

  useEffect(() => {
    if (mode === 'dificil') {
      const prev = prevAssignmentsRef.current;

      if (prev) {
        // Quais roles tiveram a mecânica alterada?
        const changed = new Set<Role>();
        for (const r of Object.keys(assignments ?? {}) as Role[]) {
          if (assignments?.[r] !== prev[r]) {
            changed.add(r);
          }
        }
        setChangedRoles(changed);

        if (changed.size > 0) {
          // Mostra só as que mudaram por 1.5s, depois esconde tudo
          setHidden(false);
          const timer = setTimeout(() => setHidden(true), 1500);
          return () => clearTimeout(timer);
        } else {
          // Nada mudou — já esconde
          setHidden(true);
        }
      } else {
        // Primeira vez — todas são "novas", mostra tudo por 1.5s
        setChangedRoles(new Set(Object.keys(assignments ?? {}) as Role[]));
        setHidden(false);
        const timer = setTimeout(() => setHidden(true), 1500);
        return () => clearTimeout(timer);
      }

      prevAssignmentsRef.current = assignments;
    } else {
      setHidden(false);
      setChangedRoles(new Set());
      prevAssignmentsRef.current = null;
    }
  }, [mode, assignments]);

  if (!role || !assignments) return null;

  const party = getPartyNumber(role);

  const members = ROLE_ORDER.map((roleName) => ({
    roleName,
    sigla: getPartyRole(roleName, party),
  }));

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg bg-black/70 ring-1 ring-white/15">
      {members.map(({ roleName, sigla }) => {
        const mechanic = assignments[sigla];
        return (
          <div key={sigla} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-zinc-300">
              <Image
                src={ROLE_ICONS[roleName]}
                alt={roleName}
                width={20}
                height={20}
                className="pointer-events-none shrink-0"
                unoptimized
              />
              <span className="text-xs font-mono">{roleName}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider opacity-50">
                {sigla}
              </span>
            </div>
            {mechanic &&
              (mode !== 'dificil' || (!hidden && changedRoles.has(sigla))) && (
                <Image
                  src={MECHANIC_ICONS[mechanic]}
                  alt={mechanic}
                  width={48}
                  height={48}
                  className="pointer-events-none"
                  unoptimized
                />
              )}
            {mechanic &&
              mode === 'dificil' &&
              (hidden || !changedRoles.has(sigla)) && (
                <span className="text-2xl font-mono font-bold text-zinc-500">
                  ?
                </span>
              )}
          </div>
        );
      })}
    </div>
  );
});

export default PartyDisplay;
