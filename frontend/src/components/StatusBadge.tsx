const colorMap: Record<string, string> = {
  // İş durumları
  Bekliyor: 'var(--tt-warning)',
  Atandı: 'var(--tt-info)',
  Yolda: 'var(--tt-info)',
  İşlemde: 'var(--tt-accent)',
  Tamamlandı: 'var(--tt-success)',
  İptal: 'var(--tt-danger)',
  // Ödeme durumları
  Ödenmedi: 'var(--tt-danger)',
  'Kısmen Ödendi': 'var(--tt-warning)',
  Ödendi: 'var(--tt-success)',
  // Çekici durumları
  Müsait: 'var(--tt-success)',
  Görevde: 'var(--tt-info)',
  Bakımda: 'var(--tt-warning)',
  Pasif: 'var(--tt-text-muted)',
  // Sürücü durumları
  Aktif: 'var(--tt-success)',
  İzinli: 'var(--tt-warning)',
};

export default function StatusBadge({ status }: { status: string }) {
  const color = colorMap[status] ?? 'var(--tt-text-muted)';
  return (
    <span
      className="tt-badge"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {status}
    </span>
  );
}
