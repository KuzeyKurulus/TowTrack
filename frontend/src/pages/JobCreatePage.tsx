import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { customerService } from '../services/customerService';
import { vehicleService } from '../services/vehicleService';
import { towTruckService } from '../services/towTruckService';
import { driverService } from '../services/driverService';
import { jobService } from '../services/jobService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type { Customer, Vehicle, TowTruck, Driver, CreateJobInput, JobType, PaymentStatusValue } from '../types';

const JOB_TYPE_OPTIONS: JobType[] = ['Oto Kurtarma', 'Çekici', 'Yol Yardım', 'Kaza', 'Arıza', 'Diğer'];
const PAYMENT_STATUS_OPTIONS: PaymentStatusValue[] = ['Ödenmedi', 'Kısmen Ödendi', 'Ödendi'];

const emptyForm: CreateJobInput = {
  customerId: 0,
  vehicleId: 0,
  towTruckId: undefined,
  driverId: undefined,
  pickupAddress: '',
  destinationAddress: '',
  jobType: 'Çekici',
  description: '',
  distanceKm: 0,
  price: 0,
  paymentStatus: 'Ödenmedi',
};

export default function JobCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [towTrucks, setTowTrucks] = useState<TowTruck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [form, setForm] = useState<CreateJobInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customerService.getAll().then(setCustomers).catch(() => {});
    towTruckService.getAll().then(setTowTrucks).catch(() => {});
    driverService.getAll().then(setDrivers).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.customerId) {
      vehicleService.getAll(undefined, form.customerId).then(setVehicles).catch(() => {});
    } else {
      setVehicles([]);
    }
  }, [form.customerId]);

  const handleSubmit = async () => {
    if (!form.customerId || !form.vehicleId || !form.pickupAddress.trim() || !form.destinationAddress.trim()) {
      setFormError('Müşteri, araç, alış adresi ve varış adresi alanları zorunludur.');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const created = await jobService.create(form);
      showToast(`İş oluşturuldu: ${created.jobNumber}`, 'success');
      navigate(`/jobs/${created.id}`);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Yeni İş Oluştur">
      <div className="tt-card p-4" style={{ maxWidth: 760 }}>
        {formError && <div className="alert alert-danger">{formError}</div>}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Müşteri *</label>
            <select
              className="form-select"
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: Number(e.target.value), vehicleId: 0 })}
            >
              <option value={0}>Seçiniz...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Araç *</label>
            <select
              className="form-select"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: Number(e.target.value) })}
              disabled={!form.customerId}
            >
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
            <label className="form-label">İş Tipi *</label>
            <select className="form-select" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value as JobType })}>
              {JOB_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
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
          <div className="col-12 mb-3">
            <label className="form-label">Alış Adresi *</label>
            <input
              className="form-control"
              value={form.pickupAddress}
              onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Varış Adresi *</label>
            <input
              className="form-control"
              value={form.destinationAddress}
              onChange={(e) => setForm({ ...form, destinationAddress: e.target.value })}
            />
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
          <button className="btn btn-outline-secondary" onClick={() => navigate('/jobs')} disabled={saving}>
            Vazgeç
          </button>
          <button className="btn tt-btn-accent" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'İşi Oluştur'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
