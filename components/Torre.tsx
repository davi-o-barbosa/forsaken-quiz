import { memo } from 'react';

const Torre = memo(function Torre({
  x = 50,
  y = 50,
}: {
  x?: number;
  y?: number;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 w-[20%] aspect-square"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="absolute inset-[-0.8%] rounded-full bg-transparent border-[5px] border-blue-200/90 blur-xs animate-pulse-glow pointer-events-none" />
      <div className="relative w-full h-full rounded-full bg-transparent border-[5px] border-blue-200" />
    </div>
  );
});

export default Torre;
