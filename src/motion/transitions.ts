/**
 * Transition Presets
 * Ready-to-use CSS transition strings built from duration and easing tokens.
 * Import and apply directly in className or style props.
 */

import { durations } from './durations';
import { easings } from './easings';

/** Build a CSS transition string from properties, duration, and easing */
function buildTransition(
  properties: string[],
  duration: number,
  easing: string,
): string {
  return properties.map((p) => `${p} ${duration}ms ${easing}`).join(', ');
}

/** Transition presets for common use cases */
export const transitions = {
  /** Subtle color and opacity change */
  colors: `color ${durations.fast}ms ${easings.standard}, background-color ${durations.fast}ms ${durations.fast}ms ${easings.standard}, border-color ${durations.fast}ms ${easings.standard}, box-shadow ${durations.standard}ms ${easings.standard}`,

  /** Standard opacity fade */
  opacity: `opacity ${durations.standard}ms ${easings.standard}`,

  /** Fade in from transparent */
  fadeIn: `opacity ${durations.standard}ms ${easings.enter}`,

  /** Fade out to transparent */
  fadeOut: `opacity ${durations.standard}ms ${easings.exit}`,

  /** Scale entrance — for modals, popovers */
  scaleIn: buildTransition(['opacity', 'transform'], durations.standard, easings.enter),

  /** Scale exit — for modals, popovers */
  scaleOut: buildTransition(['opacity', 'transform'], durations.standard, easings.exit),

  /** Slide in from right — for drawers, panels */
  slideInRight: buildTransition(['transform', 'opacity'], durations.emphasized, easings.decelerate),

  /** Slide out to right — for drawers, panels */
  slideOutRight: buildTransition(['transform', 'opacity'], durations.standard, easings.accelerate),

  /** Slide in from bottom — for toasts, notifications */
  slideInUp: buildTransition(['transform', 'opacity'], durations.emphasized, easings.decelerate),

  /** Slide out to bottom — for toasts, notifications */
  slideOutDown: buildTransition(['transform', 'opacity'], durations.standard, easings.accelerate),

  /** Slide down — for dropdowns, accordions */
  slideDown: buildTransition(['max-height', 'opacity', 'transform'], durations.emphasized, easings.standard),

  /** Slide up — for accordions */
  slideUp: buildTransition(['max-height', 'opacity', 'transform'], durations.standard, easings.standard),

  /** Sidebar width change */
  sidebarWidth: `width ${durations.standard}ms ${easings.standard}`,

  /** Sidebar mobile overlay */
  sidebarMobile: `transform ${durations.standard}ms ${easings.standard}`,

  /** Focus ring and elevation change */
  focus: `box-shadow ${durations.fast}ms ${easings.standard}, outline-offset ${durations.fast}ms ${easings.standard}`,

  /** Card hover elevation */
  cardHover: `transform ${durations.standard}ms ${easings.standard}, box-shadow ${durations.standard}ms ${easings.standard}, border-color ${durations.standard}ms ${easings.standard}`,

  /** Table row hover */
  tableRow: `background-color ${durations.fast}ms ${easings.standard}`,

  /** Button press feedback */
  buttonPress: `transform ${durations.instant}ms ${easings.standard}, background-color ${durations.fast}ms ${easings.standard}`,

  /** Form focus ring */
  formFocus: `border-color ${durations.fast}ms ${easings.standard}, box-shadow ${durations.fast}ms ${easings.standard}`,

  /** Content panel transition */
  content: `opacity ${durations.standard}ms ${easings.standard}, transform ${durations.standard}ms ${easings.standard}`,
} as const;

export type TransitionToken = keyof typeof transitions;
