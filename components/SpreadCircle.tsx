import { SPREAD_CIRCLE_SIZE, ARENA_SIZE } from '@/data/positions';

const COLOR_CLASSES = {
  yellow: 'bg-yellow-400/50',
  blue: 'bg-blue-400/50',
} as const;

export default function SpreadCircle({
  x,
  y,
  color = 'yellow',
}: {
  x: number;
  y: number;
  color?: keyof typeof COLOR_CLASSES;
}) {
  const pctX = (x / ARENA_SIZE) * 100;
  const pctY = (y / ARENA_SIZE) * 100;
  const sizePct = (SPREAD_CIRCLE_SIZE / ARENA_SIZE) * 100;

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${COLOR_CLASSES[color]}`}
      style={{
        left: `${pctX}%`,
        top: `${pctY}%`,
        width: `${sizePct}%`,
        height: `${sizePct}%`,
      }}
    />
  );
}
