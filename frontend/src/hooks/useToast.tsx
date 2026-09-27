import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const iconFor = (type: ToastType) => {
    if (type === 'success') return '✓';
    if (type === 'error') return '✕';
    return 'ℹ';
  };

  const colorFor = (type: ToastType) => {
    if (type === 'success') return 'var(--tt-success)';
    if (type === 'error') return 'var(--tt-danger)';
    return 'var(--tt-info)';
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="tt-toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="tt-card d-flex align-items-center gap-2 px-3 py-2"
            style={{ minWidth: 260, borderLeft: `3px solid ${colorFor(t.type)}` }}
          >
            <span style={{ color: colorFor(t.type), fontWeight: 700 }}>{iconFor(t.type)}</span>
            <span style={{ fontSize: '0.9rem' }}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalıdır.');
  return ctx;
}
