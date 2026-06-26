interface ModeButtonProps {
  color: 'orange' | 'red';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ICONS = {
  orange: (
    <svg
      className="w-10 h-10 text-orange-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  ),
  red: (
    <svg
      className="w-10 h-10 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
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
