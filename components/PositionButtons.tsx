'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useRole } from '@/context/RoleContext';
import { POSITIONS, type PositionKey } from '@/data/positions';
import { getCorrectPosition, isPlayerInside } from '@/lib/quizLogic';

const ARENA_SIZE = 4000;

type ButtonState = 'default' | 'correct' | 'wrong';

export default function PositionButtons() {
  const { role } = useRole();
  const {
    assignments,
    towerNumber,
    lightParties,
    gameStatus,
    advanceTower,
    addAnswer,
  } = useQuiz();
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>(
    {},
  );
  const [locked, setLocked] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(
    null,
  );

  const handleClick = useCallback(
    (key: PositionKey, correctPos: PositionKey | null) => {
      if (locked) return;

      const isCorrect = key === correctPos;
      const newStates: Record<string, ButtonState> = {
        [key]: isCorrect ? 'correct' : 'wrong',
      };
      if (!isCorrect && correctPos) {
        newStates[correctPos] = 'correct';
      }
      setButtonStates(newStates);
      setLastResult(isCorrect ? 'correct' : 'wrong');
      setLocked(true);

      addAnswer({
        towerNumber,
        correct: isCorrect,
        clickedPosition: key,
        expectedPosition: correctPos,
      });

      setTimeout(() => {
        setButtonStates({});
        setLastResult(null);
        setLocked(false);
        advanceTower();
      }, 1200);
    },
    [locked, towerNumber, advanceTower, addAnswer],
  );

  if (!assignments || !role || !lightParties || gameStatus !== 'playing')
    return null;

  const isOdd = towerNumber % 2 !== 0;
  const prefix = isOdd ? 'ODD_' : 'EVEN_';

  const entries = useMemo(
    () =>
      (
        Object.entries(POSITIONS) as [PositionKey, { X: number; Y: number }][]
      ).filter(([key]) => key.startsWith(prefix)),
    [prefix],
  );

  const lightParty = lightParties[role];
  const inside = isPlayerInside(towerNumber, lightParty);
  const myMechanic = assignments[role];
  const correctPos = getCorrectPosition(
    role,
    myMechanic,
    inside,
    towerNumber,
    assignments,
  );

  return (
    <>
      {lastResult && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
          <div
            className={`px-4 py-1.5 rounded-md text-sm font-mono font-bold ${
              lastResult === 'correct'
                ? 'bg-green-500/80 text-white'
                : 'bg-red-500/80 text-white'
            }`}
          >
            {lastResult === 'correct' ? '✓ Correto!' : '✗ Errado!'}
          </div>
        </div>
      )}

      {entries.map(([key, pos]) => {
        const pctX = (pos.X / ARENA_SIZE) * 100;
        const pctY = (pos.Y / ARENA_SIZE) * 100;
        const state = buttonStates[key] || 'default';

        const borderColor =
          state === 'correct'
            ? 'border-green-400 bg-green-500/20'
            : state === 'wrong'
              ? 'border-red-400 bg-red-500/20'
              : 'border-white/50 bg-white/5 group-hover:bg-white/15 group-hover:border-white/80';

        return (
          <button
            key={key}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group w-12 h-12 ${locked ? 'pointer-events-none' : ''}`}
            style={{ left: `${pctX}%`, top: `${pctY}%` }}
            onClick={() => handleClick(key, correctPos)}
          >
            <div
              className={`w-full h-full rounded-full border-[3px] transition-all ${borderColor}`}
            />
          </button>
        );
      })}
    </>
  );
}
