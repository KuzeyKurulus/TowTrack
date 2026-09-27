export function LoadingState({ message = 'Yükleniyor...' }: { message?: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 tt-muted">
      <div className="spinner-border mb-3" style={{ color: 'var(--tt-accent)' }} role="status" />
      <div>{message}</div>
    </div>
  );
}

export function EmptyState({
  message = 'Henüz kayıt bulunmuyor.',
  actionLabel,
  onAction,
}: {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div style={{ fontSize: '2rem' }}>📭</div>
      <div className="tt-muted mt-2 mb-3">{message}</div>
      {actionLabel && onAction && (
        <button className="btn tt-btn-accent btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <div className="mt-2 mb-3" style={{ color: 'var(--tt-danger)' }}>
        {message}
      </div>
      {onRetry && (
        <button className="btn btn-outline-secondary btn-sm" onClick={onRetry}>
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
