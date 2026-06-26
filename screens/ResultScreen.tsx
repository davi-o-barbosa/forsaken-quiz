"use client";

import { useQuiz } from "@/context/QuizContext";

export default function ResultScreen({
  onRestart,
  onMainMenu,
}: {
  onRestart: () => void;
  onMainMenu: () => void;
}) {
  const { answers } = useQuiz();
  const correct = answers.filter((a) => a.correct).length;

  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1 min-h-0">
      <div className="flex flex-col items-center gap-2">
        <p className="text-emerald-400 text-3xl font-mono font-bold">
          Quiz Completo!
        </p>
        <p className="text-zinc-300 text-5xl font-mono font-bold tabular-nums">
          {correct}
          <span className="text-zinc-500 text-3xl">/8</span>
        </p>
        <p className="text-zinc-500 text-sm font-mono text-center max-w-xs">
          {correct === 8
            ? "Perfeito! Você acertou todas as posições!"
            : correct >= 6
              ? "Quase lá! Continue praticando."
              : "Tente novamente para melhorar sua pontuação."}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-lg bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40 hover:bg-blue-500/30 transition-all text-sm font-mono font-bold"
        >
          Recomeçar
        </button>
        <button
          onClick={onMainMenu}
          className="px-6 py-3 rounded-lg bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 transition-all text-sm font-mono"
        >
          Menu Principal
        </button>
      </div>
    </div>
  );
}
