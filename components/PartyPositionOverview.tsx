'use client';

import Image from 'next/image';
import Torre from '@/components/Torre';
import Boss from '@/components/Boss';
import SpreadCircle from '@/components/SpreadCircle';
import ConeEffect from '@/components/ConeEffect';
import { useRole, type Role } from '@/context/RoleContext';
import { useQuiz, type Mechanic } from '@/context/QuizContext';
import { getCorrectPosition, getInsideParty } from '@/lib/quizLogic';
import {
  POSITIONS,
  TORRE_LEFT_X,
  TORRE_RIGHT_X,
  TORRE_Y,
  BOSS_SIZE,
  ARENA_SIZE,
  type PositionKey,
} from '@/data/positions';

type RoleName = 'Tank' | 'Healer' | 'Melee' | 'Ranged';

const ROLE_ICONS: Record<RoleName, string> = {
  Tank: '/Tank.png',
  Healer: '/Healer.png',
  Melee: '/Melee.png',
  Ranged: '/Ranged.png',
};

const ALL_ROLES: Role[] = ['MT', 'OT', 'H1', 'H2', 'M1', 'M2', 'R1', 'R2'];

function getRoleName(role: Role): RoleName {
  if (role === 'MT' || role === 'OT') return 'Tank';
  if (role === 'H1' || role === 'H2') return 'Healer';
  if (role === 'M1' || role === 'M2') return 'Melee';
  return 'Ranged';
}

export default function PartyPositionOverview({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const { assignments, towerNumber, lightParties } = useQuiz();
  const { role: playerRole } = useRole();

  if (!assignments || !lightParties || !playerRole) return null;

  const insideParty = getInsideParty(towerNumber);

  const players = ALL_ROLES.map((r) => {
    const mechanic: Mechanic = assignments[r];
    const lightParty = lightParties[r];
    const isInside = lightParty === insideParty;
    const posKey = getCorrectPosition(
      r,
      mechanic,
      isInside,
      towerNumber,
      assignments,
    );

    return {
      role: r,
      roleName: getRoleName(r),
      mechanic,
      lightParty,
      isInside,
      posKey,
      isPlayer: r === playerRole,
    };
  });

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-lg ring-1 ring-white/10">
      <Image
        src="/arena.png"
        alt="Arena"
        fill
        className="pointer-events-none object-contain"
        unoptimized
        priority
      />
      <Torre x={TORRE_LEFT_X} y={TORRE_Y} />
      <Torre x={TORRE_RIGHT_X} y={TORRE_Y} />
      <Boss size={BOSS_SIZE} />

      {/* Título */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-1.5 rounded-md bg-black/70 ring-1 ring-white/15 text-zinc-200 text-sm font-mono">
          Posições — Torre {towerNumber}
        </div>
      </div>

      {/* Spread circles — players dentro da torre com spread */}
      {players.map(({ role, mechanic, isInside, posKey }) => {
        if (!posKey || mechanic !== 'spread' || !isInside) return null;
        const pos = POSITIONS[posKey];
        return <SpreadCircle key={`spread-${role}`} x={pos.X} y={pos.Y} />;
      })}

      {/* Stack circles — players dentro da torre com stack */}
      {players.map(({ role, mechanic, isInside, posKey }) => {
        if (!posKey || mechanic !== 'stack' || !isInside) return null;
        const pos = POSITIONS[posKey];
        return (
          <SpreadCircle
            key={`stack-${role}`}
            x={pos.X}
            y={pos.Y}
            color="blue"
          />
        );
      })}

      {/* Cone effects — de dentro da torre para o cone baiter */}
      {(() => {
        const isOdd = towerNumber % 2 !== 0;

        const coneToBaiter: Partial<Record<PositionKey, PositionKey>> = isOdd
          ? { ODD_INSIDE_TOWER_CONE: 'ODD_OUTSIDE_CONE_BAITER' }
          : {
              EVEN_INSIDE_TOWER_CONE_1: 'EVEN_OUTSIDE_CONE_BAITER_1',
              EVEN_INSIDE_TOWER_CONE_2: 'EVEN_OUTSIDE_CONE_BAITER_2',
            };

        return players
          .filter(
            (p) =>
              p.posKey &&
              p.mechanic === 'cone' &&
              p.isInside &&
              coneToBaiter[p.posKey],
          )
          .map((p) => {
            const fromPos = POSITIONS[p.posKey!];
            const targetKey = coneToBaiter[p.posKey!];
            if (!targetKey) return null;
            const toPos = POSITIONS[targetKey];
            return (
              <ConeEffect
                key={`cone-${p.role}`}
                fromX={fromPos.X}
                fromY={fromPos.Y}
                toX={toPos.X}
                toY={toPos.Y}
              />
            );
          });
      })()}

      {/* Players */}
      {players.map(({ role, roleName, lightParty, posKey, isPlayer }) => {
        if (!posKey) return null;
        const pos = POSITIONS[posKey];
        const pctX = (pos.X / ARENA_SIZE) * 100;
        const pctY = (pos.Y / ARENA_SIZE) * 100;

        const lpLabel = lightParty;

        return (
          <div
            key={role}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${pctX}%`, top: `${pctY}%` }}
          >
            <div className="relative">
              <Image
                src={ROLE_ICONS[roleName]}
                alt={role}
                width={32}
                height={32}
                className={`pointer-events-none ${isPlayer ? 'ring-2 ring-yellow-400 rounded-full' : ''}`}
                unoptimized
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 ring-1 ring-white/30 flex items-center justify-center">
                <span className="text-[9px] font-mono font-bold text-zinc-200 leading-none">
                  {lpLabel}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-black/60 px-1 rounded">
              {role}
            </span>
          </div>
        );
      })}

      {/* Continue button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onContinue}
          className="px-6 py-2 rounded-lg bg-blue-600/80 text-white ring-1 ring-blue-400/60 hover:bg-blue-500 transition-all text-sm font-mono font-bold cursor-pointer"
        >
          Continuar →
        </button>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2 rounded-md bg-black/70 px-4 py-3 ring-1 ring-white/10">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
          Mecânicas
        </span>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-yellow-400/50" />
          <span className="text-xs font-mono text-zinc-300">Spread</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-blue-400/50" />
          <span className="text-xs font-mono text-zinc-300">Stack</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4"
            style={{
              clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
              backgroundColor: 'rgba(250,150,50,0.6)',
            }}
          />
          <span className="text-xs font-mono text-zinc-300">Cone</span>
        </div>
      </div>
    </div>
  );
}
