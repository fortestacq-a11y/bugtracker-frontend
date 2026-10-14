import { AlertCircle, CheckCircle, X } from 'lucide-react';

/**
 * Corner notification, styled off the toast's `type`.
 *
 * <p>Error and success get distinct surfaces so the two are told apart without
 * reading the text; anything else falls back to the neutral panel.
 */
export function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const surfaces = {
    error: 'bg-[#fdf2f2] border-[#f5c6cb] text-[#b53333]',
    success: 'bg-[#f0f7ed] border-[#c8e6c9] text-[#2e7d32]',
    info: 'bg-[#faf9f5] border-[#e8e6dc] text-[#141413]',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs sm:text-sm font-medium ${surfaces[toast.type] || surfaces.info}`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-[#b53333] shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-[#2e7d32] shrink-0" />
        )}
        <span>{toast.message}</span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="p-0.5 rounded hover:bg-black/5 text-[#87867f] hover:text-[#141413]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}