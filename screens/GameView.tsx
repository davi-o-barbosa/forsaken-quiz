'use client';

import Image from 'next/image';
import Torre from '@/components/Torre';
import Boss from '@/components/Boss';
import PartyDisplay from '@/components/PartyDisplay';
import PositionButtons from '@/components/PositionButtons';
import { useQuiz } from '@/context/QuizContext';
import {
  TORRE_LEFT_X,
  TORRE_RIGHT_X,
  TORRE_Y,
  BOSS_SIZE,
} from '@/data/positions';

function TowerInfo() {
  const { towerNumber } = useQuiz();
  const towerLabel = [1, 2, 3, 8].includes(towerNumber) ? 'A' : 'B';

  return (
    <div className="flex items-center gap-3 self-start text-zinc-500 text-sm font-mono">
      <span className="text-zinc-300">Torre {towerNumber}/8</span>
      <span className="w-px h-3 bg-zinc-700" />
      <span>Party {towerLabel} dentro</span>
    </div>
  );
}

function Arena() {
  const { gameStatus } = useQuiz();

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
      <Boss size={BOSS_SIZE} />
      <Torre x={TORRE_LEFT_X} y={TORRE_Y} />
      <Torre x={TORRE_RIGHT_X} y={TORRE_Y} />
      {gameStatus === 'playing' && (
        <>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <PartyDisplay />
          </div>
          <PositionButtons />
        </>
      )}
    </div>
  );
}

export default function GameView() {
  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-0 flex-1">
      <h1 className="text-zinc-400 text-lg font-mono tracking-wide shrink-0">
        Forsaken Quiz - FFXIV
      </h1>
      <TowerInfo />
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center">
        <Arena />
      </div>
    </div>
  );
}
