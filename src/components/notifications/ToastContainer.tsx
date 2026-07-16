/**
 * ToastContainer Component
 * Stacks active toasts in the bottom-right corner with aria-live region support.
 */

import { memo } from 'react';
import { useNotifications } from '../../notifications/useNotifications';
import ToastItem from './ToastItem';

const ToastContainer = memo(function ToastContainer() {
  const { toasts } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
});

export default ToastContainer;
