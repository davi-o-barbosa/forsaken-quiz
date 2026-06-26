'use client';

import Image from 'next/image';

import { memo } from 'react';

const Boss = memo(function Boss({ size = 10 }: { size?: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: `${size}%`, height: `${size}%` }}
    >
      <Image
        src="/boss.svg"
        alt="Boss"
        fill
        className="object-contain pointer-events-none"
        unoptimized
        priority
      />
    </div>
  );
});

export default Boss;
