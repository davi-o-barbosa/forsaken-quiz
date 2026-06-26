'use client';

import { memo } from 'react';
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
  const { assignments } = useQuiz();

  if (!role || !assignments) return null;

  const party = getPartyNumber(role);
  const playerRoleName = ROLE_ORDER.find(
    (r) => getPartyRole(r, party) === role,
  )!;

  const members = ROLE_ORDER.map((roleName) => ({
    roleName,
    sigla: getPartyRole(roleName, party),
    isPlayer: roleName === playerRoleName,
  }));

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg bg-black/70 ring-1 ring-white/15">
      {members.map(({ roleName, sigla, isPlayer }) => {
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
            {mechanic && (
              <Image
                src={MECHANIC_ICONS[mechanic]}
                alt={mechanic}
                width={48}
                height={48}
                className="pointer-events-none"
                unoptimized
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

export default PartyDisplay;
