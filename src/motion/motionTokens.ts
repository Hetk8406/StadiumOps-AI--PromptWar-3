/**
 * Motion Tokens
 * Centralized design tokens for durations, easings, transitions, and reduced motion utilities.
 */

export const DURATIONS = {
  instant: 0,
  fast: 150,     // micro-interactions, hovers, active states
  standard: 250, // dialogs, drawer panels, layout adjustments
  slow: 400,     // page/view slide transitions
} as const;

export const EASINGS = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',   // Fluent/Material standard
  enter: 'cubic-bezier(0, 0, 0.2, 1)',        // deceleration for entrance
  exit: 'cubic-bezier(0.4, 0, 1, 1)',         // acceleration for exit
  emphasized: 'cubic-bezier(0.4, 0, 0.1, 1)', // dramatic yet clean focus curve
} as const;

export const TRANSITION_PRESETS = {
  fade: `opacity ${DURATIONS.fast}ms ${EASINGS.standard}`,
  fadeSlide: `opacity ${DURATIONS.standard}ms ${EASINGS.enter}, transform ${DURATIONS.standard}ms ${EASINGS.enter}`,
  collapse: `max-height ${DURATIONS.standard}ms ${EASINGS.standard}, opacity ${DURATIONS.standard}ms ${EASINGS.standard}`,
  fastTransition: `all ${DURATIONS.fast}ms ${EASINGS.standard}`,
} as const;
