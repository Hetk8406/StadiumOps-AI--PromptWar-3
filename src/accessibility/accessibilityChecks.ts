/**
 * Reusable Accessibility Validation Utilities
 * Focus trapping, keyboard navigation shortcuts, ARIA labels, and live announcement utilities.
 */

/** Traces and traps focus inside a container element (useful for Dialogs and Palette modals) */
export function trapFocus(element: HTMLElement, event: KeyboardEvent): void {
  const focusables = element.querySelectorAll<HTMLElement>(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );
  
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}

/** Announces screen reader text dynamically using an aria-live region */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  let announcer = document.getElementById('stadiumops-sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'stadiumops-sr-announcer';
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  // Timeout ensures screen readers catch the DOM mutation correctly
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
}

/** Safely verifies if a keypress corresponds to activation keys (Enter or Space) */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}
