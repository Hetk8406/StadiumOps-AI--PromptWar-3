/**
 * Animation Utilities
 * Framework-independent helpers for building animations.
 * Used by hooks and components for consistent motion behavior.
 */

import { durations } from './durations';
import { easings } from './easings';
import { prefersReducedMotion } from './reducedMotion';

/** Compute stagger delay for list items based on index */
export function staggerDelay(index: number, baseDelay: number = 30): number {
  if (prefersReducedMotion()) return 0;
  return index * baseDelay;
}

/** Build a CSS transition string from an array of property names */
export function buildCssTransition(
  properties: string[],
  duration: number = durations.standard,
  easing: string = easings.standard,
): string {
  if (prefersReducedMotion()) return 'none';
  return properties.map((p) => `${p} ${duration}ms ${easing}`).join(', ');
}

/** Build a CSS animation string from keyframe name and timing */
export function buildCssAnimation(
  keyframeName: string,
  duration: number = durations.standard,
  easing: string = easings.standard,
  fillMode: string = 'both',
): string {
  if (prefersReducedMotion()) return 'none';
  return `${keyframeName} ${duration}ms ${easing} ${fillMode}`;
}

/** Clamp a numeric value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build an inline style object for mount animation */
export function mountStyle(options?: {
  duration?: number;
  delay?: number;
  easing?: string;
}): React.CSSProperties {
  if (prefersReducedMotion()) return {};

  return {
    animation: `motionFadeIn ${options?.duration ?? durations.standard}ms ${options?.easing ?? easings.enter} ${options?.delay ?? 0}ms both`,
  };
}

/** Build an inline style object for enter transition */
export function enterStyle(): React.CSSProperties {
  if (prefersReducedMotion()) return { opacity: 1 };

  return {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  };
}

/** Build an inline style object for exit transition */
export function exitStyle(): React.CSSProperties {
  if (prefersReducedMotion()) return { opacity: 0 };

  return {
    opacity: 0,
    transform: 'translateY(8px) scale(0.98)',
  };
}
