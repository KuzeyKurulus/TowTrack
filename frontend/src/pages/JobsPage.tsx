import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import StatusBadge from '../components/StatusBadge';
import { jobService } from '../services/jobService';
import { getErrorMessage } from '../services/apiClient';
import type { JobListItem, JobFilter } from '../types';

const JOB_STATUS_OPTIONS = ['Bekliyor', 'Atandı', 'Yolda', 'İşlemde', 'Tamamlandı', 'İptal'];
const PAYMENT_STATUS_OPTIONS = ['Ödenmedi', 'Kısmen Ödendi', 'Ödendi'];
const JOB_TYPE_OPTIONS = ['Oto Kurtarma', 'Çekici', 'Yol Yardım', 'Kaza', 'Arıza', 'Diğer'];

const initialFilter: JobFilter = { page: 1, pageSize: 20 };

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<JobFilter>(initialFilter);
  const navigate = useNavigate();

  const load = (f: JobFilter) => {
    setLoading(true);
    setError(null);
    jobService
      .getAll(f)
      .then((res) => {
        setJobs(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => load(filter), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateFilter = (patch: Partial<JobFilter>) => {
    setFilter((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  const pageSize = filter.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = filter.page ?? 1;

  return (
    <Layout title="İşler">
      <div className="tt-card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="İş numarası"
              value={filter.jobNumber ?? ''}
              onChange={(e) => updateFilter({ jobNumber: e.target.value || undefined })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Plaka"
              value={filter.plate ?? ''}
              onChange={(e) => updateFilter({ plate: e.target.value || undefined })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Müşteri adı"
              value={filter.customerName ?? ''}
              onChange={(e) => updateFilter({ customerName: e.target.value || undefined })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filter.jobStatus ?? ''}
              onChange={(e) => updateFilter({ jobStatus: e.target.value || undefined })}
            >
              <option value="">Tüm Durumlar</option>
              {JOB_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filter.paymentStatus ?? ''}
              onChange={(e) => updateFilter({ paymentStatus: e.target.value || undefined })}
            >
              <option value="">Tüm Ödemeler</option>
              {PAYMENT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filter.jobType ?? ''}
              onChange={(e) => updateFilter({ jobType: e.target.value || undefined })}
            >
              <option value="">Tüm İş Tipleri</option>
              {JOB_TYPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={filter.startDate ?? ''}
              onChange={(e) => updateFilter({ startDate: e.target.value || undefined })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={filter.endDate ?? ''}
              onChange={(e) => updateFilter({ endDate: e.target.value || undefined })}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-outline-secondary w-100" onClick={() => setFilter(initialFilter)}>
              Filtreleri Temizle
            </button>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn tt-btn-accent w-100" onClick={() => navigate('/jobs/new')}>
              + Yeni İş
            </button>
          </div>
        </div>
      </div>

      <div className="tt-card p-3">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={() => load(filter)} />}
        {!loading && !error && jobs.length === 0 && (
          <EmptyState message="Kriterlere uygun iş bulunamadı." actionLabel="Yeni İş Oluştur" onAction={() => navigate('/jobs/new')} />
        )}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table tt-table">
                <thead>
                  <tr>
                    <th>İş No</th>
                    <th>Tarih</th>
                    <th>Müşteri</th>
                    <th>Plaka</th>
                    <th>Çekici</th>
                    <th>Sürücü</th>
                    <th>İş Tipi</th>
                    <th>Ücret</th>
                    <th>Ödeme</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${j.id}`)}>
                      <td className="fw-semibold">{j.jobNumber}</td>
                      <td>{new Date(j.requestDate).toLocaleDateString('tr-TR')}</td>
                      <td>{j.customerName}</td>
                      <td>{j.plate}</td>
                      <td>{j.towTruckPlate || '-'}</td>
                      <td>{j.driverName || '-'}</td>
                      <td>{j.jobType}</td>
                      <td>{formatCurrency(j.price)}</td>
                      <td>
                        <StatusBadge status={j.paymentStatus} />
                      </td>
                      <td>
                        <StatusBadge status={j.jobStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="tt-muted" style={{ fontSize: '0.85rem' }}>
                Toplam {totalCount} kayıt · Sayfa {currentPage} / {totalPages}
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage <= 1}
                  onClick={() => updateFilter({ page: currentPage - 1 })}
                >
                  ← Önceki
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateFilter({ page: currentPage + 1 })}
                >
                  Sonraki →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
