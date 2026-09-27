interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accentColor?: string;
}

export default function StatCard({ label, value, icon, accentColor = 'var(--tt-accent)' }: StatCardProps) {
  return (
    <div className="tt-card p-3 h-100 d-flex align-items-center gap-3">
      <div
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{ width: 46, height: 46, backgroundColor: `${accentColor}22`, fontSize: '1.3rem' }}
      >
        {icon}
      </div>
      <div>
        <div className="tt-muted" style={{ fontSize: '0.8rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}
