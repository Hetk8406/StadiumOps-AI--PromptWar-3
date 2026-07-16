/**
 * usePageTransition Hook
 * Manages page enter/exit animation state.
 * Returns animation styles and class names for route transitions.
 */

import { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface PageTransitionState {
  /** Whether the page is currently entering */
  isEntering: boolean;
  /** CSS class name to apply to the transitioning element */
  className: string;
  /** Inline styles for the transitioning element */
  style: React.CSSProperties;
}

export function usePageTransition(): PageTransitionState {
  const reduced = useReducedMotion();
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    if (reduced) {
      setIsEntering(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  if (reduced) {
    return {
      isEntering: false,
      className: '',
      style: {},
    };
  }

  return {
    isEntering,
    className: isEntering ? 'motion-page-enter' : 'motion-page-enter-active',
    style: {
      opacity: isEntering ? 0 : 1,
      transform: isEntering ? 'translateY(6px)' : 'translateY(0)',
      transition: 'opacity 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1)',
    },
  };
}

/**
 * useAnimatedMount Hook
 * Controls mount/unmount animation for components.
 * Returns isMounted and animation styles.
 */
export function useAnimatedMount(isOpen: boolean, duration: number = 200): {
  isMounted: boolean;
  style: React.CSSProperties;
} {
  const reduced = useReducedMotion();
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else if (!reduced) {
      const timer = setTimeout(() => setIsMounted(false), duration);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isOpen, duration, reduced]);

  const style: React.CSSProperties = reduced
    ? { opacity: isOpen ? 1 : 0 }
    : {
        opacity: isOpen ? 1 : 0,
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };

  return { isMounted, style };
}

/**
 * useStaggeredMount Hook
 * Returns an array of booleans indicating which items in a list
 * have completed their staggered entrance animation.
 */
export function useStaggeredMount(count: number, delay: number = 30): boolean[] {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState<boolean[]>(() => new Array(count).fill(reduced));

  useEffect(() => {
    if (reduced) {
      setVisible(new Array(count).fill(true));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * delay),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [count, delay, reduced]);

  return visible;
}

/**
 * useAnimationEnd Hook
 * Fires a callback when a CSS animation ends on the given element.
 */
export function useAnimationEnd(
  ref: React.RefObject<HTMLElement | null>,
  onEnd: () => void,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => onEnd();
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, [ref, onEnd]);
}
