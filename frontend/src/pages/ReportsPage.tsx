import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import { reportsService } from '../services/dashboardService';
import { getErrorMessage } from '../services/apiClient';
import type { Reports } from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    reportsService
      .getReports(start || undefined, end || undefined)
      .then(setReports)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout title="Raporlar">
      <div className="tt-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Başlangıç Tarihi</label>
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Bitiş Tarihi</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <button className="btn tt-btn-accent" onClick={() => load(startDate, endDate)}>
              Filtrele
            </button>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                load();
              }}
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={() => load(startDate, endDate)} />}

      {!loading && !error && reports && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-6 col-lg-3">
              <StatCard label="Günlük Gelir" value={formatCurrency(reports.dailyRevenue)} icon="📆" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Haftalık Gelir" value={formatCurrency(reports.weeklyRevenue)} icon="🗓️" accentColor="var(--tt-info)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Aylık Gelir" value={formatCurrency(reports.monthlyRevenue)} icon="📈" accentColor="var(--tt-success)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Tamamlanan İşler" value={reports.totalCompletedJobs.toString()} icon="✅" />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-lg-8">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">Gelir Grafiği (Son 6 Ay)</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={reports.revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--tt-border)" />
                    <XAxis dataKey="month" stroke="#9298a8" fontSize={12} />
                    <YAxis stroke="#9298a8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1b1e25', border: '1px solid #2c303c', borderRadius: 8 }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="revenue" fill="#ff6b35" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">İş Tipi Dağılımı</div>
                {reports.jobTypeDistribution.length === 0 ? (
                  <EmptyState message="Seçilen aralıkta iş kaydı yok." />
                ) : (
                  <ul className="list-unstyled mb-0">
                    {reports.jobTypeDistribution.map((s) => (
                      <li key={s.status} className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--tt-border)' }}>
                        <span className="tt-muted">{s.status}</span>
                        <span className="fw-semibold">{s.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-lg-4">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">Ödeme Durumları</div>
                {reports.paymentStatusDistribution.length === 0 ? (
                  <EmptyState message="Veri bulunamadı." />
                ) : (
                  <ul className="list-unstyled mb-0">
                    {reports.paymentStatusDistribution.map((s) => (
                      <li key={s.status} className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--tt-border)' }}>
                        <span className="tt-muted">{s.status}</span>
                        <span className="fw-semibold">{s.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">Çekici Kullanım İstatistikleri</div>
                {reports.towTruckUsage.length === 0 ? (
                  <EmptyState message="Veri bulunamadı." />
                ) : (
                  <ul className="list-unstyled mb-0">
                    {reports.towTruckUsage.map((t) => (
                      <li key={t.plate} className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--tt-border)' }}>
                        <span className="tt-muted">{t.plate}</span>
                        <span className="fw-semibold">{t.jobCount} iş</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">Sürücü İstatistikleri</div>
                {reports.driverStats.length === 0 ? (
                  <EmptyState message="Veri bulunamadı." />
                ) : (
                  <ul className="list-unstyled mb-0">
                    {reports.driverStats.map((d) => (
                      <li key={d.fullName} className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--tt-border)' }}>
                        <span className="tt-muted">{d.fullName}</span>
                        <span className="fw-semibold">
                          {d.jobCount} iş · {formatCurrency(d.totalRevenue)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
