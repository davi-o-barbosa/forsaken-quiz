import { BookOpen, ShieldCheck } from 'lucide-react';

interface ModeButtonProps {
  color: 'orange' | 'red';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ICONS = {
  orange: <BookOpen className="w-10 h-10 text-orange-400" strokeWidth={1.5} />,
  red: <ShieldCheck className="w-10 h-10 text-red-400" strokeWidth={1.5} />,
} as const;

const COLOR_CLASSES = {
  orange: {
    bg: 'bg-orange-500/20 hover:bg-orange-500/30',
    ring: 'ring-orange-500/50 hover:ring-orange-400',
    text: 'text-orange-300',
  },
  red: {
    bg: 'bg-red-500/20 hover:bg-red-500/30',
    ring: 'ring-red-500/50 hover:ring-red-400',
    text: 'text-red-300',
  },
} as const;

export default function ModeButton({
  color,
  label,
  onClick,
  disabled,
}: ModeButtonProps) {
  const cls = COLOR_CLASSES[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      suppressHydrationWarning
      className={`flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-xl ring-2 transition-all ${disabled ? 'opacity-40 cursor-not-allowed ring-white/10' : `${cls.bg} ${cls.ring}`}`}
    >
      <div className={disabled ? 'opacity-50' : ''}>{ICONS[color]}</div>
      <span
        className={`text-sm font-mono font-bold ${disabled ? 'text-zinc-500' : cls.text}`}
      >
        {label}
      </span>
    </button>
  );
}
