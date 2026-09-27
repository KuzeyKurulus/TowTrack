import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import { dashboardService } from '../services/dashboardService';
import { getErrorMessage } from '../services/apiClient';
import type { DashboardSummary } from '../types';

const PIE_COLORS = ['#f5b942', '#4d9bf0', '#4d9bf0', '#ff6b35', '#34c77b', '#f0554d'];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    dashboardService
      .getSummary()
      .then(setSummary)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout title="Dashboard">
      {loading && <LoadingState message="Dashboard verileri yükleniyor..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && summary && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-6 col-lg-3">
              <StatCard label="Toplam İş" value={summary.totalJobs.toString()} icon="🚛" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Bugünkü İşler" value={summary.todaysJobs.toString()} icon="📅" accentColor="var(--tt-info)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Bekleyen İşler" value={summary.pendingJobs.toString()} icon="⏳" accentColor="var(--tt-warning)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Tamamlanan İşler" value={summary.completedJobs.toString()} icon="✅" accentColor="var(--tt-success)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Toplam Gelir" value={formatCurrency(summary.totalRevenue)} icon="💰" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Bu Ayki Gelir" value={formatCurrency(summary.monthlyRevenue)} icon="📈" accentColor="var(--tt-success)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Aktif Çekiciler" value={summary.activeTowTrucks.toString()} icon="🛻" accentColor="var(--tt-info)" />
            </div>
            <div className="col-6 col-lg-3">
              <StatCard label="Kayıtlı Müşteriler" value={summary.registeredCustomers.toString()} icon="👥" />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-lg-8">
              <div className="tt-card p-3 h-100">
                <div className="fw-semibold mb-3">Aylık Gelir Grafiği</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={summary.monthlyRevenueChart}>
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
                <div className="fw-semibold mb-3">İş Durumu Dağılımı</div>
                {summary.jobStatusDistribution.length === 0 ? (
                  <EmptyState message="Henüz iş kaydı yok." />
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={summary.jobStatusDistribution}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={45}
                        outerRadius={80}
                      >
                        {summary.jobStatusDistribution.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1b1e25', border: '1px solid #2c303c', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {summary.jobStatusDistribution.map((s, index) => (
                    <div key={s.status} className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                          display: 'inline-block',
                        }}
                      />
                      <span className="tt-muted">
                        {s.status} ({s.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="tt-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="fw-semibold">Son İşler</div>
              <Link to="/jobs" className="btn btn-sm btn-outline-secondary">
                Tümünü Gör
              </Link>
            </div>
            {summary.recentJobs.length === 0 ? (
              <EmptyState message="Henüz iş kaydı bulunmuyor." />
            ) : (
              <div className="table-responsive">
                <table className="table tt-table">
                  <thead>
                    <tr>
                      <th>İş No</th>
                      <th>Tarih</th>
                      <th>Müşteri</th>
                      <th>Plaka</th>
                      <th>İş Tipi</th>
                      <th>Ücret</th>
                      <th>Ödeme</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentJobs.map((job) => (
                      <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                        <td>
                          <Link to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>
                            {job.jobNumber}
                          </Link>
                        </td>
                        <td>{formatDateTime(job.requestDate)}</td>
                        <td>{job.customerName}</td>
                        <td>{job.plate}</td>
                        <td>{job.jobType}</td>
                        <td>{formatCurrency(job.price)}</td>
                        <td>
                          <StatusBadge status={job.paymentStatus} />
                        </td>
                        <td>
                          <StatusBadge status={job.jobStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
