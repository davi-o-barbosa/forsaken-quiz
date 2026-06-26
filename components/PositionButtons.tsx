'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useRole } from '@/context/RoleContext';
import { POSITIONS, ARENA_SIZE, type PositionKey } from '@/data/positions';
import { getCorrectPosition, isPlayerInside } from '@/lib/quizLogic';

type ButtonState = 'default' | 'correct' | 'wrong';

export default function PositionButtons({
  onShowOverview,
}: {
  onShowOverview?: (tower: number) => void;
}) {
  const { role } = useRole();
  const {
    assignments,
    towerNumber,
    lightParties,
    gameStatus,
    mode,
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
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const lockedRef = useRef(false);

  // Garante que lockedRef acompanhe locked
  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  // Timer do modo difícil
  useEffect(() => {
    if (mode === 'dificil' && !locked) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return 4;
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Calcula a posição correta para o timeout
      const lp = lightParties![role!];
      const inside = isPlayerInside(towerNumber, lp);
      const mechanic = assignments![role!];
      const expectedPos = getCorrectPosition(
        role!,
        mechanic,
        inside,
        towerNumber,
        assignments!,
      );

      const timeout = setTimeout(() => {
        if (!lockedRef.current) {
          setLocked(true);
          setLastResult('wrong');
          setTimeLeft(null);

          addAnswer({
            towerNumber,
            correct: false,
            clickedPosition: 'timeout',
            expectedPosition: expectedPos,
          });

          setTimeout(() => {
            setButtonStates({});
            setLastResult(null);
            setLocked(false);
            setTimeLeft(null);
            if (onShowOverview) {
              onShowOverview(towerNumber);
            } else {
              advanceTower();
            }
          }, 1200);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [
    mode,
    towerNumber,
    locked,
    addAnswer,
    advanceTower,
    onShowOverview,
    role,
    lightParties,
    assignments,
  ]);

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
        if (onShowOverview) {
          onShowOverview(towerNumber);
        } else {
          advanceTower();
        }
      }, 1200);
    },
    [locked, towerNumber, advanceTower, addAnswer, onShowOverview],
  );

  const isOdd = towerNumber % 2 !== 0;
  const prefix = isOdd ? 'ODD_' : 'EVEN_';

  const entries = useMemo(
    () =>
      (
        Object.entries(POSITIONS) as [PositionKey, { X: number; Y: number }][]
      ).filter(([key]) => key.startsWith(prefix)),
    [prefix],
  );

  if (!assignments || !role || !lightParties || gameStatus !== 'playing')
    return null;

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
        <div className="absolute top-40 left-1/2 -translate-x-1/2 z-20">
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

      {timeLeft !== null && !lastResult && (
        <div className="absolute top-40 left-1/2 -translate-x-1/2 z-20">
          <div className="px-3 py-1 rounded-md bg-black/70 ring-1 ring-white/15 text-zinc-300 text-sm font-mono tabular-nums">
            {timeLeft ?? 5}s
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
