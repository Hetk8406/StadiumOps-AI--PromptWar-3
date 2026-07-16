/**
 * Enterprise Motion System — Barrel Export
 * Central access point for all motion tokens, utilities, and constants.
 */

export { durations, toDuration } from './durations';
export type { DurationToken } from './durations';

export { easings } from './easings';
export type { EasingToken } from './easings';

export { transitions } from './transitions';
export type { TransitionToken } from './transitions';

export { keyframes } from './keyframes';
export type { KeyframeName } from './keyframes';

export {
  prefersReducedMotion,
  onReducedMotionChange,
  getAnimationDuration,
  getTransition,
} from './reducedMotion';

export {
  staggerDelay,
  buildCssTransition,
  buildCssAnimation,
  clamp,
  mountStyle,
  enterStyle,
  exitStyle,
} from './animationUtils';
