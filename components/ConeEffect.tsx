import { ARENA_SIZE } from '@/data/positions';

const CONE_ANGLE = Math.PI / 5; // ~36° de abertura

export default function ConeEffect({
  fromX,
  fromY,
  toX,
  toY,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  const coneLen = ARENA_SIZE * 2;

  const tipLeft = {
    X: fromX + coneLen * Math.cos(angle - CONE_ANGLE),
    Y: fromY + coneLen * Math.sin(angle - CONE_ANGLE),
  };
  const tipRight = {
    X: fromX + coneLen * Math.cos(angle + CONE_ANGLE),
    Y: fromY + coneLen * Math.sin(angle + CONE_ANGLE),
  };

  const points = `${fromX},${fromY} ${tipLeft.X},${tipLeft.Y} ${tipRight.X},${tipRight.Y}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      viewBox={`0 0 ${ARENA_SIZE} ${ARENA_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <polygon points={points} fill="rgba(250, 150, 50, 0.5)" />
    </svg>
  );
}
