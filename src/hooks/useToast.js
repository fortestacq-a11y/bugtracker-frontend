import { useState, useCallback } from 'react';

/**
 * Transient notification, shown in the corner and auto-dismissed.
 *
 * <p>The id guards against a stale timeout clearing a newer toast: each call
 * stamps a fresh id, and the timer only clears if it still owns the current one.
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}