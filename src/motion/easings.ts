/**
 * Motion Easing Tokens
 * Centralized cubic-bezier curves for consistent enterprise motion.
 * All easings optimized for operational UI: responsive, confident, calm.
 */

export const easings = {
  /** Standard easing — default for most transitions */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Enter easing — elements appearing on screen */
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Exit easing — elements leaving the screen */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Emphasized easing — prominent, attention-guiding motion */
  emphasized: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Decelerate easing — elements coming to rest */
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Accelerate easing — elements departing */
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export type EasingToken = keyof typeof easings;
