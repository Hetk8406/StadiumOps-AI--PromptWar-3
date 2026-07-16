/**
 * Custom Keyframe Definitions
 * CSS-compatible keyframe objects for use with React style or CSS-in-JS.
 * These complement Tailwind's built-in animate-* utilities.
 */

export const keyframes = {
  /** Fade in from fully transparent */
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },

  /** Fade out to fully transparent */
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },

  /** Scale in from 95% with slight upward offset */
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
    to: { opacity: '1', transform: 'scale(1) translateY(0)' },
  },

  /** Scale out to 95% */
  scaleOut: {
    from: { opacity: '1', transform: 'scale(1) translateY(0)' },
    to: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
  },

  /** Slide in from right edge */
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },

  /** Slide out to right edge */
  slideOutRight: {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(100%)' },
  },

  /** Slide in from bottom */
  slideInUp: {
    from: { transform: 'translateY(16px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },

  /** Slide out to bottom */
  slideOutDown: {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(16px)', opacity: '0' },
  },

  /** Subtle pulse for live indicators */
  pulseSubtle: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.6' },
  },

  /** Progress bar shimmer */
  shimmer: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(100%)' },
  },
} as const;

export type KeyframeName = keyof typeof keyframes;
