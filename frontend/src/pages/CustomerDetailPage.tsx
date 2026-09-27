import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import StatusBadge from '../components/StatusBadge';
import { customerService } from '../services/customerService';
import { getErrorMessage } from '../services/apiClient';
import type { CustomerDetail } from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    customerService
      .getById(Number(id))
      .then(setCustomer)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout title="Müşteri Detayı">
      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate('/customers')}>
        ← Müşterilere Dön
      </button>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && customer && (
        <>
          <div className="tt-card p-4 mb-3">
            <div className="row">
              <div className="col-md-6">
                <h4 className="mb-1">{customer.fullName}</h4>
                <div className="tt-muted">Kayıt Tarihi: {new Date(customer.createdAt).toLocaleDateString('tr-TR')}</div>
              </div>
              <div className="col-md-6">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="tt-muted" style={{ fontSize: '0.8rem' }}>
                      Telefon
                    </div>
                    <div>{customer.phone}</div>
                  </div>
                  <div className="col-6">
                    <div className="tt-muted" style={{ fontSize: '0.8rem' }}>
                      E-posta
                    </div>
                    <div>{customer.email || '-'}</div>
                  </div>
                  <div className="col-12">
                    <div className="tt-muted" style={{ fontSize: '0.8rem' }}>
                      Adres
                    </div>
                    <div>{customer.address || '-'}</div>
                  </div>
                  {customer.note && (
                    <div className="col-12">
                      <div className="tt-muted" style={{ fontSize: '0.8rem' }}>
                        Not
                      </div>
                      <div>{customer.note}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="tt-card p-3 mb-3">
            <div className="fw-semibold mb-3">Araçlar ({customer.vehicles.length})</div>
            {customer.vehicles.length === 0 ? (
              <EmptyState message="Bu müşteriye ait araç bulunmuyor." />
            ) : (
              <div className="table-responsive">
                <table className="table tt-table">
                  <thead>
                    <tr>
                      <th>Plaka</th>
                      <th>Marka / Model</th>
                      <th>Yıl</th>
                      <th>Renk</th>
                      <th>Km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.vehicles.map((v) => (
                      <tr key={v.id}>
                        <td>{v.plate}</td>
                        <td>
                          {v.brand} {v.model}
                        </td>
                        <td>{v.modelYear}</td>
                        <td>{v.color || '-'}</td>
                        <td>{v.mileage ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="tt-card p-3">
            <div className="fw-semibold mb-3">Geçmiş İşler ({customer.jobs.length})</div>
            {customer.jobs.length === 0 ? (
              <EmptyState message="Bu müşteriye ait iş kaydı bulunmuyor." />
            ) : (
              <div className="table-responsive">
                <table className="table tt-table">
                  <thead>
                    <tr>
                      <th>İş No</th>
                      <th>Tarih</th>
                      <th>Plaka</th>
                      <th>İş Tipi</th>
                      <th>Ücret</th>
                      <th>Ödeme</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.jobs.map((j) => (
                      <tr key={j.id}>
                        <td>
                          <Link to={`/jobs/${j.id}`}>{j.jobNumber}</Link>
                        </td>
                        <td>{new Date(j.requestDate).toLocaleDateString('tr-TR')}</td>
                        <td>{j.plate}</td>
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
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
