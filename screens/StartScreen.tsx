'use client';

import RoleSelector from '@/components/RoleSelector';
import ModeButton from '@/components/ModeButton';

export default function StartScreen({
  onStart,
}: {
  onStart: (mode: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 flex-1 min-h-0">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-zinc-200 text-2xl font-mono font-bold tracking-wide">
          Forsaken Quiz
        </h1>
        <p className="text-zinc-500 text-xs font-mono">
          FFXIV — Quiz da mecânica Forsaken da P2 de DMU
        </p>
      </div>

      <RoleSelector />

      <div className="flex gap-4">
        <ModeButton
          color="orange"
          label="TREINO"
          onClick={() => onStart('treino')}
        />
        <ModeButton
          color="red"
          label="DIFÍCIL"
          onClick={() => onStart('dificil')}
        />
      </div>
    </div>
  );
}
