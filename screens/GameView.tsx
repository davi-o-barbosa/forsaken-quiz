'use client';

import { useState } from 'react';
import Image from 'next/image';
import Torre from '@/components/Torre';
import Boss from '@/components/Boss';
import PartyDisplay from '@/components/PartyDisplay';
import PositionButtons from '@/components/PositionButtons';
import PartyPositionOverview from '@/components/PartyPositionOverview';
import { RefreshCw, X } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';
import { getInsideParty } from '@/lib/quizLogic';
import {
  TORRE_LEFT_X,
  TORRE_RIGHT_X,
  TORRE_Y,
  BOSS_SIZE,
} from '@/data/positions';

function Arena({
  onShowOverview,
  onRestart,
  onMainMenu,
}: {
  onShowOverview: (tower: number) => void;
  onRestart: () => void;
  onMainMenu: () => void;
}) {
  const { gameStatus, towerNumber, mode } = useQuiz();

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
      <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
        <button
          onClick={onRestart}
          className="w-8 h-8 rounded-md bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
          title="Reiniciar"
        >
          <RefreshCw className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onMainMenu}
          className="w-8 h-8 rounded-md bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Cancelar"
        >
          <X className="w-4 h-4 text-white" strokeWidth={2.5} />
        </button>
      </div>
      {mode !== 'dificil' && (
        <div className="absolute top-2 left-2 z-10 text-white text-base font-mono font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
          Torre {towerNumber}/8 — Party {getInsideParty(towerNumber)}
        </div>
      )}
      {gameStatus === 'playing' && (
        <>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
            <PartyDisplay />
          </div>
          <PositionButtons onShowOverview={onShowOverview} />
        </>
      )}
    </div>
  );
}

export default function GameView({
  onRestart,
  onMainMenu,
}: {
  onRestart: () => void;
  onMainMenu: () => void;
}) {
  const [overviewTower, setOverviewTower] = useState<number | null>(null);
  const { advanceTower } = useQuiz();

  const handleShowOverview = (tower: number) => {
    setOverviewTower(tower);
  };

  const handleContinue = () => {
    setOverviewTower(null);
    advanceTower();
  };

  return (
    <div className="flex flex-col items-center w-full min-h-0 flex-1">
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center">
        {overviewTower !== null ? (
          <PartyPositionOverview onContinue={handleContinue} />
        ) : (
          <Arena
            onShowOverview={handleShowOverview}
            onRestart={onRestart}
            onMainMenu={onMainMenu}
          />
        )}
      </div>
    </div>
  );
}
