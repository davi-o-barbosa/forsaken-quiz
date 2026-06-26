import type { Role } from "@/context/RoleContext";
import type { Mechanic } from "@/context/QuizContext";
import { POSITIONS } from "@/data/positions";

export const DUOS: [Role, Role][] = [
  ["MT", "H1"],
  ["OT", "H2"],
  ["M1", "R1"],
  ["M2", "R2"],
];

// Torres 1-3 e 8 → party A dentro; 4-7 → party B dentro
export function getInsideParty(towerNumber: number): "A" | "B" {
  return [1, 2, 3, 8].includes(towerNumber) ? "A" : "B";
}

// Se o jogador está dentro ou fora
export function isPlayerInside(
  towerNumber: number,
  lightParty: "A" | "B",
): boolean {
  return getInsideParty(towerNumber) === lightParty;
}

function getDuoPartner(role: Role): Role | undefined {
  return DUOS.find((pair) => pair.includes(role))?.find((r) => r !== role);
}

function isSupport(role: Role): boolean {
  return ["MT", "OT", "H1", "H2"].includes(role);
}

function isDPS(role: Role): boolean {
  return ["M1", "M2", "R1", "R2"].includes(role);
}

function isTank(role: Role): boolean {
  return role === "MT" || role === "OT";
}

function isHealer(role: Role): boolean {
  return role === "H1" || role === "H2";
}

function isMelee(role: Role): boolean {
  return role === "M1" || role === "M2";
}

/**
 * Resolve o sufixo (_1 ou _2) baseado na prioridade.
 * Suporte = _1, DPS = _2.
 * Se a dupla tem a mesma mecânica e o jogador é Tank/Melee → troca.
 */
function resolvePrioritySuffix(
  role: Role,
  mechanic: Mechanic,
  assignments: Record<Role, Mechanic>,
): "1" | "2" {
  const partner = getDuoPartner(role);
  const partnerMechanic = partner ? assignments[partner] : null;

  if (partnerMechanic === mechanic && (isTank(role) || isMelee(role))) {
    return isSupport(role) ? "2" : "1";
  }

  return isSupport(role) ? "1" : "2";
}

export function getOddTowerPosition(
  role: Role,
  mechanic: Mechanic,
  insideParty: boolean,
  assignments: Record<Role, Mechanic>,
): keyof typeof POSITIONS | null {
  if (!insideParty) {
    if (isDPS(role)) return "ODD_OUTSIDE_STACK_2";
    if (isTank(role)) return "ODD_OUTSIDE_STACK_1";
    if (isHealer(role)) return "ODD_OUTSIDE_CONE_BAITER";
    return null;
  }

  if (mechanic === "cone") return "ODD_INSIDE_TOWER_CONE";
  if (mechanic === "spread") return "ODD_INSIDE_TOWER_SPREAD_1";

  if (mechanic === "stack") {
    const suffix = resolvePrioritySuffix(role, mechanic, assignments);
    return suffix === "1"
      ? "ODD_INSIDE_TOWER_STACK_1"
      : "ODD_INSIDE_TOWER_STACK_2";
  }

  return null;
}

export function getEvenTowerPosition(
  role: Role,
  mechanic: Mechanic,
  insideParty: boolean,
  assignments: Record<Role, Mechanic>,
): keyof typeof POSITIONS | null {
  if (!insideParty) {
    if (isRanged(role)) return "EVEN_OUTSIDE_CONE_BAITER_2";
    if (isMelee(role)) return "EVEN_OUTSIDE_NORTH_2";
    if (isTank(role)) return "EVEN_OUTSIDE_NORTH_1";
    if (isHealer(role)) return "EVEN_OUTSIDE_CONE_BAITER_1";
    return null;
  }

  if (mechanic === "cone") {
    const suffix = resolvePrioritySuffix(role, mechanic, assignments);
    return suffix === "1" ? "EVEN_INSIDE_TOWER_CONE_1" : "EVEN_INSIDE_TOWER_CONE_2";
  }

  if (mechanic === "spread") {
    const suffix = resolvePrioritySuffix(role, mechanic, assignments);
    return suffix === "1" ? "EVEN_INSIDE_TOWER_SPREAD_1" : "EVEN_INSIDE_TOWER_SPREAD_2";
  }

  if (mechanic === "stack") {
    const suffix = resolvePrioritySuffix(role, mechanic, assignments);
    return suffix === "1" ? "EVEN_INSIDE_TOWER_STACK_1" : "EVEN_INSIDE_TOWER_STACK_2";
  }

  return null;
}

function isRanged(role: Role): boolean {
  return role === "R1" || role === "R2";
}

/** Retorna as 4 roles de uma light party. */
export function getLightPartyRoles(
  lightParty: "A" | "B",
  lightParties: Record<Role, "A" | "B">,
): [Role, Role, Role, Role] {
  const roles = (Object.keys(lightParties) as Role[]).filter(
    (r) => lightParties[r] === lightParty,
  );
  return roles as [Role, Role, Role, Role];
}

export function getCorrectPosition(
  role: Role,
  mechanic: Mechanic,
  insideParty: boolean,
  towerNumber: number,
  assignments: Record<Role, Mechanic>,
): keyof typeof POSITIONS | null {
  const isOdd = towerNumber % 2 !== 0;
  if (isOdd) {
    return getOddTowerPosition(role, mechanic, insideParty, assignments);
  }
  return getEvenTowerPosition(role, mechanic, insideParty, assignments);
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Embaralha as mecânicas de um grupo de 4 jogadores após uma torre.
 * - Torre ÍMPAR: 2 spreads + 2 cones
 * - Torre PAR:   2 stacks + 1 cone + 1 spread
 */
export function shuffleDebuffs(
  roles: [Role, Role, Role, Role],
  towerNumber: number,
): Record<Role, Mechanic> {
  const isOdd = towerNumber % 2 !== 0;

  const pool: Mechanic[] = isOdd
    ? ["spread", "spread", "cone", "cone"]
    : ["stack", "stack", "cone", "spread"];

  const shuffled = shuffle(pool);
  const result = {} as Record<Role, Mechanic>;

  for (let i = 0; i < roles.length; i++) {
    result[roles[i]] = shuffled[i];
  }

  return result;
}
