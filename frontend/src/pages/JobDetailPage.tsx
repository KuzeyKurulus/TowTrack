import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { LoadingState, ErrorState } from '../components/StatusViews';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { jobService } from '../services/jobService';
import { customerService } from '../services/customerService';
import { vehicleService } from '../services/vehicleService';
import { towTruckService } from '../services/towTruckService';
import { driverService } from '../services/driverService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type {
  JobDetail,
  Customer,
  Vehicle,
  TowTruck,
  Driver,
  UpdateJobInput,
  JobType,
  PaymentStatusValue,
  JobStatusValue,
} from '../types';

const JOB_TYPE_OPTIONS: JobType[] = ['Oto Kurtarma', 'Çekici', 'Yol Yardım', 'Kaza', 'Arıza', 'Diğer'];
const PAYMENT_STATUS_OPTIONS: PaymentStatusValue[] = ['Ödenmedi', 'Kısmen Ödendi', 'Ödendi'];
const JOB_STATUS_OPTIONS: JobStatusValue[] = ['Bekliyor', 'Atandı', 'Yolda', 'İşlemde', 'Tamamlandı', 'İptal'];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

function formatDateTime(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [towTrucks, setTowTrucks] = useState<TowTruck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form, setForm] = useState<UpdateJobInput | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    jobService
      .getById(Number(id))
      .then(setJob)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startEditing = () => {
    if (!job) return;
    setForm({
      customerId: job.customerId,
      vehicleId: job.vehicleId,
      towTruckId: job.towTruckId ?? undefined,
      driverId: job.driverId ?? undefined,
      pickupAddress: job.pickupAddress,
      destinationAddress: job.destinationAddress,
      jobType: job.jobType,
      description: job.description ?? '',
      distanceKm: job.distanceKm,
      price: job.price,
      paymentStatus: job.paymentStatus,
      jobStatus: job.jobStatus,
    });
    customerService.getAll().then(setCustomers).catch(() => {});
    towTruckService.getAll().then(setTowTrucks).catch(() => {});
    driverService.getAll().then(setDrivers).catch(() => {});
    vehicleService.getAll(undefined, job.customerId).then(setVehicles).catch(() => {});
    setFormError(null);
    setEditing(true);
  };

  const handleFormCustomerChange = (customerId: number) => {
    if (!form) return;
    setForm({ ...form, customerId, vehicleId: 0 });
    vehicleService.getAll(undefined, customerId).then(setVehicles).catch(() => {});
  };

  const handleSave = async () => {
    if (!form || !job) return;
    if (!form.pickupAddress.trim() || !form.destinationAddress.trim() || !form.vehicleId) {
      setFormError('Araç, alış adresi ve varış adresi alanları zorunludur.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const updated = await jobService.update(job.id, form);
      setJob(updated);
      setEditing(false);
      showToast('İş güncellendi.', 'success');
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: JobStatusValue) => {
    if (!job) return;
    try {
      const updated = await jobService.updateStatus(job.id, status);
      setJob(updated);
      showToast('İş durumu güncellendi.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    setDeleting(true);
    try {
      await jobService.remove(job.id);
      showToast('İş silindi.', 'success');
      navigate('/jobs');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="İş Detayı">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/jobs')}>
          ← İşlere Dön
        </button>
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && job && !editing && (
        <div className="tt-card p-4 tt-print-area">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h4 className="mb-1">{job.jobNumber}</h4>
              <div className="tt-muted">Talep Tarihi: {formatDateTime(job.requestDate)}</div>
            </div>
            <div className="d-flex gap-2 align-items-center no-print">
              <StatusBadge status={job.paymentStatus} />
              <StatusBadge status={job.jobStatus} />
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Müşteri
              </div>
              <div className="fw-semibold">{job.customerName}</div>
              <div className="tt-muted">{job.customerPhone}</div>
            </div>
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Araç
              </div>
              <div className="fw-semibold">{job.vehiclePlate}</div>
              <div className="tt-muted">{job.vehicleBrandModel}</div>
            </div>
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Çekici
              </div>
              <div>{job.towTruckPlate || 'Henüz atanmadı'}</div>
            </div>
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Sürücü
              </div>
              <div>{job.driverName || 'Henüz atanmadı'}</div>
            </div>
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Alış Adresi
              </div>
              <div>{job.pickupAddress}</div>
            </div>
            <div className="col-md-6">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Varış Adresi
              </div>
              <div>{job.destinationAddress}</div>
            </div>
            <div className="col-md-3">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Mesafe
              </div>
              <div>{job.distanceKm} km</div>
            </div>
            <div className="col-md-3">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Ücret
              </div>
              <div className="fw-semibold">{formatCurrency(job.price)}</div>
            </div>
            <div className="col-md-3">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Başlangıç
              </div>
              <div>{formatDateTime(job.startDate)}</div>
            </div>
            <div className="col-md-3">
              <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                Tamamlanma
              </div>
              <div>{formatDateTime(job.completedDate)}</div>
            </div>
            {job.description && (
              <div className="col-12">
                <div className="tt-muted mb-1" style={{ fontSize: '0.8rem' }}>
                  Açıklama
                </div>
                <div>{job.description}</div>
              </div>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 no-print">
            <button className="btn btn-outline-secondary" onClick={startEditing}>
              Düzenle
            </button>
            <button className="btn btn-outline-danger" onClick={() => setShowDeleteModal(true)}>
              Sil
            </button>
            <button className="btn btn-outline-secondary" onClick={() => window.print()}>
              Yazdır
            </button>
            <select
              className="form-select w-auto"
              value={job.jobStatus}
              onChange={(e) => handleStatusChange(e.target.value as JobStatusValue)}
            >
              {JOB_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!loading && !error && job && editing && form && (
        <div className="tt-card p-4" style={{ maxWidth: 760 }}>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Müşteri</label>
              <select className="form-select" value={form.customerId} onChange={(e) => handleFormCustomerChange(Number(e.target.value))}>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Araç</label>
              <select className="form-select" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: Number(e.target.value) })}>
                <option value={0}>Seçiniz...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} - {v.brand} {v.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Çekici</label>
              <select
                className="form-select"
                value={form.towTruckId ?? ''}
                onChange={(e) => setForm({ ...form, towTruckId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Henüz atanmadı</option>
                {towTrucks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.plate} ({t.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Sürücü</label>
              <select
                className="form-select"
                value={form.driverId ?? ''}
                onChange={(e) => setForm({ ...form, driverId: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Henüz atanmadı</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} ({d.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">İş Tipi</label>
              <select className="form-select" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value as JobType })}>
                {JOB_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">İş Durumu</label>
              <select
                className="form-select"
                value={form.jobStatus}
                onChange={(e) => setForm({ ...form, jobStatus: e.target.value as JobStatusValue })}
              >
                {JOB_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Ödeme Durumu</label>
              <select
                className="form-select"
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as PaymentStatusValue })}
              >
                {PAYMENT_STATUS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Mesafe (km)</label>
              <input
                type="number"
                className="form-control"
                value={form.distanceKm}
                onChange={(e) => setForm({ ...form, distanceKm: Number(e.target.value) })}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Alış Adresi</label>
              <input
                className="form-control"
                value={form.pickupAddress}
                onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Varış Adresi</label>
              <input
                className="form-control"
                value={form.destinationAddress}
                onChange={(e) => setForm({ ...form, destinationAddress: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Ücret (₺)</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Açıklama</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setEditing(false)} disabled={saving}>
              Vazgeç
            </button>
            <button className="btn tt-btn-accent" onClick={handleSave} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDeleteModal}
        title="İşi Sil"
        message={`"${job?.jobNumber}" numaralı işi silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      />
    </Layout>
  );
}
