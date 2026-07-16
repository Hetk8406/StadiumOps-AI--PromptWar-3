/**
 * Seedable Deterministic Random Helpers and Date Generators
 * Consumers: All mock datasets needing consistent, non-random outputs.
 */

// LCG (Linear Congruential Generator) state
let seed = 42; // Constant seed

export function setSeed(s: number): void {
  seed = s;
}

/**
 * Returns a number between [0, 1) deterministically based on seed
 */
export function seededRandom(): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Returns a random integer in range [min, max]
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

/**
 * Selects a random element from an array deterministically
 */
export function pickRandom<T>(arr: readonly T[] | T[]): T {
  const idx = Math.floor(seededRandom() * arr.length);
  return arr[idx];
}

/**
 * Generates an ISO timestamp with minute offsets from current time
 */
export function getRelativeTime(minutesOffset: number): string {
  // Static match base date: 2026-06-15T18:00:00.000Z
  const base = new Date('2026-06-15T18:00:00.000Z');
  base.setMinutes(base.getMinutes() + minutesOffset);
  return base.toISOString();
}
