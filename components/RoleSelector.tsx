'use client';

import { useState, useRef, useEffect } from 'react';
import { useRole } from '@/context/RoleContext';

const ROLES = [
  { sigla: 'MT' as const, nome: 'Main Tank' },
  { sigla: 'OT' as const, nome: 'Off Tank' },
  { sigla: 'H1' as const, nome: 'Healer 1' },
  { sigla: 'H2' as const, nome: 'Healer 2' },
  { sigla: 'M1' as const, nome: 'Melee 1' },
  { sigla: 'M2' as const, nome: 'Melee 2' },
  { sigla: 'R1' as const, nome: 'Ranged 1' },
  { sigla: 'R2' as const, nome: 'Ranged 2' },
];

export default function RoleSelector() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = ROLES.find((r) => r.sigla === role);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono bg-white/5 text-zinc-200 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
      >
        <span>
          {role ? `${selected?.nome} (${role})` : 'Selecione sua role'}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-44 rounded-md bg-zinc-800 ring-1 ring-white/10 overflow-y-auto max-h-60 z-50">
          {ROLES.map(({ sigla, nome }) => (
            <button
              key={sigla}
              onClick={() => {
                setRole(sigla);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors ${
                role === sigla
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-zinc-300 hover:bg-white/10'
              }`}
            >
              {nome} ({sigla})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
