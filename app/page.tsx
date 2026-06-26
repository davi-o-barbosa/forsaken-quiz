'use client';

import { useState, useCallback } from 'react';
import { RoleProvider } from '@/context/RoleContext';
import { QuizProvider, useQuiz } from '@/context/QuizContext';
import StartScreen from '@/screens/StartScreen';
import GameView from '@/screens/GameView';
import ResultScreen from '@/screens/ResultScreen';

function GameRouter({
  onRestart,
  onMainMenu,
}: {
  onRestart: () => void;
  onMainMenu: () => void;
}) {
  const { gameStatus } = useQuiz();

  if (gameStatus === 'playing') return <GameView />;
  if (gameStatus === 'won')
    return <ResultScreen onRestart={onRestart} onMainMenu={onMainMenu} />;
  return null;
}

export default function Home() {
  const [mode, setMode] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (m: string) => setMode(m);
  const handleRestart = useCallback(() => setGameKey((k) => k + 1), []);
  const handleMainMenu = useCallback(() => {
    setMode(null);
    setGameKey((k) => k + 1);
  }, []);

  return (
    <RoleProvider>
      <QuizProvider key={`${mode}-${gameKey}`} mode={mode ?? undefined}>
        <div className="flex flex-col items-center min-h-screen bg-zinc-900 select-none px-4 pt-6 pb-4">
          {!mode && (
            <div className="flex flex-col items-center w-full max-w-[min(85vw,85vh)] overflow-hidden flex-1 justify-center">
              <StartScreen onStart={handleStart} />
            </div>
          )}
          {mode && (
            <div className="flex flex-col items-center w-full max-w-[min(85vw,85vh)] overflow-hidden flex-1">
              <GameRouter
                onRestart={handleRestart}
                onMainMenu={handleMainMenu}
              />
            </div>
          )}
        </div>
      </QuizProvider>
    </RoleProvider>
  );
}
