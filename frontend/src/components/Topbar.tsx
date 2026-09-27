interface TopbarProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function Topbar({ title, onToggleSidebar }: TopbarProps) {
  return (
    <header className="tt-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-secondary tt-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Menüyü aç/kapat"
        >
          ☰
        </button>
        <h1 className="tt-page-title">{title}</h1>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 36,
            height: 36,
            backgroundColor: 'var(--tt-accent)',
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
          title="Yönetici"
        >
          YN
        </div>
      </div>
    </header>
  );
}
