'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRole, type Role } from './RoleContext';
import {
  shuffleDebuffs,
  getLightPartyRoles,
  getInsideParty,
  shuffle,
  DUOS,
} from '@/lib/quizLogic';

export type Mechanic = 'stack' | 'spread' | 'cone';

const SUPPORTS: Role[] = ['MT', 'OT', 'H1', 'H2'];
const DPS: Role[] = ['M1', 'M2', 'R1', 'R2'];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface Answer {
  towerNumber: number;
  correct: boolean;
  clickedPosition: string;
  expectedPosition: string | null;
}

interface QuizContextType {
  assignments: Record<Role, Mechanic> | null;
  towerNumber: number;
  lightParties: Record<Role, 'A' | 'B'> | null;
  gameStatus: GameStatus;
  answers: Answer[];
  advanceTower: () => void;
  addAnswer: (answer: Answer) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

function generateAssignments(): Record<Role, Mechanic> {
  const supportsGetSpreads = Math.random() < 0.5;

  const supportsSet = supportsGetSpreads ? 'spread' : 'cone';
  const dpsSet = supportsGetSpreads ? 'cone' : 'spread';

  const shuffledSupports = shuffle(SUPPORTS);
  const shuffledDPS = shuffle(DPS);

  const assignments = {} as Record<Role, Mechanic>;

  for (const r of SUPPORTS) {
    assignments[r] = r === shuffledSupports[0] ? 'stack' : supportsSet;
  }
  for (const r of DPS) {
    assignments[r] = r === shuffledDPS[0] ? 'stack' : dpsSet;
  }

  return assignments;
}

function computeLightParties(
  asm: Record<Role, Mechanic>,
): Record<Role, 'A' | 'B'> {
  const result = {} as Record<Role, 'A' | 'B'>;
  for (const [a, b] of DUOS) {
    const isA = asm[a] === 'stack' || asm[b] === 'stack';
    result[a] = isA ? 'A' : 'B';
    result[b] = isA ? 'A' : 'B';
  }
  return result;
}

function QuizProviderInner({ children }: { children: ReactNode }) {
  const [towerNumber, setTowerNumber] = useState(1);
  const [currentAssignments, setCurrentAssignments] = useState<Record<
    Role,
    Mechanic
  > | null>(null);
  const [lightParties, setLightParties] = useState<Record<
    Role,
    'A' | 'B'
  > | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

  // Inicializa uma vez — o componente é recriado ao trocar de role
  const [initDone, setInitDone] = useState(false);
  if (!initDone) {
    const asm = generateAssignments();
    console.log('=== Forsaken Quiz — Initial Assignments ===', asm);
    setCurrentAssignments(asm);
    setLightParties(computeLightParties(asm));
    setInitDone(true);
  }

  const addAnswer = useCallback((answer: Answer) => {
    setAnswers((prev) => [...prev, answer]);
  }, []);

  const advanceTower = useCallback(() => {
    setTowerNumber((prev) => {
      const nextTower = prev + 1;
      if (nextTower > 8) {
        setGameStatus('won');
        return prev;
      }
      return nextTower;
    });
    setCurrentAssignments((cur) => {
      if (!cur || !lightParties) return cur;
      const insideParty = getInsideParty(towerNumber);
      const partyRoles = getLightPartyRoles(insideParty, lightParties);
      const shuffled = shuffleDebuffs(partyRoles, towerNumber);
      return { ...cur, ...shuffled };
    });
  }, [towerNumber, lightParties]);

  return (
    <QuizContext.Provider
      value={{
        assignments: currentAssignments,
        towerNumber,
        lightParties,
        gameStatus,
        answers,
        advanceTower,
        addAnswer,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function QuizProvider({
  children,
  mode: _mode,
}: {
  children: ReactNode;
  mode?: string;
}) {
  const { role } = useRole();

  if (!role || !_mode)
    return (
      <QuizContext.Provider
        value={{
          assignments: null,
          towerNumber: 1,
          lightParties: null,
          gameStatus: 'idle',
          answers: [],
          advanceTower: () => {},
          addAnswer: () => {},
        }}
      >
        {children}
      </QuizContext.Provider>
    );

  return <QuizProviderInner key={role}>{children}</QuizProviderInner>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
