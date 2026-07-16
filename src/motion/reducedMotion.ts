/**
 * Reduced Motion Utilities
 * Framework-independent utilities for detecting and respecting
 * the user's prefers-reduced-motion OS setting.
 */

/** Check if the user prefers reduced motion via matchMedia */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Subscribe to changes in reduced motion preference */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

/** Get animation duration based on motion preference */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0,
): number {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
}

/** Get a CSS transition string, respecting reduced motion */
export function getTransition(
  normalTransition: string,
  reducedTransition: string = 'none',
): string {
  return prefersReducedMotion() ? reducedTransition : normalTransition;
}
