interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = 'Sil',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }} />
      <div className="modal d-block" style={{ zIndex: 1050 }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} />
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
                Vazgeç
              </button>
              <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                {loading ? 'Siliniyor...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
