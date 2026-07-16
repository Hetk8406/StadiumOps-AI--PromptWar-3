/**
 * Motion Duration Tokens
 * Centralized timing values for all enterprise animations.
 * Values are in milliseconds for CSS and JavaScript use.
 */

export const durations = {
  /** Instant feedback — focus rings, color changes */
  instant: 75,
  /** Fast micro-interactions — hover states, tooltips */
  fast: 120,
  /** Standard transitions — cards, panels, modals */
  standard: 200,
  /** Emphasized transitions — page transitions, major state changes */
  emphasized: 300,
  /** Slow transitions — complex sequences, staggered lists */
  slow: 400,
} as const;

export type DurationToken = keyof typeof durations;

/** Convert duration token to CSS transition/animation duration string */
export function toDuration(token: DurationToken): string {
  return `${durations[token]}ms`;
}
