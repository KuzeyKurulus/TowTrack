import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import ConfirmModal from '../components/ConfirmModal';
import { vehicleService } from '../services/vehicleService';
import { customerService } from '../services/customerService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type { Vehicle, CreateVehicleInput, Customer } from '../types';

const emptyForm: CreateVehicleInput = {
  customerId: 0,
  plate: '',
  brand: '',
  model: '',
  modelYear: new Date().getFullYear(),
  color: '',
  chassisNumber: '',
  mileage: undefined,
  note: '',
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateVehicleInput>(emptyForm);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const load = (searchTerm?: string, customerId?: string) => {
    setLoading(true);
    setError(null);
    vehicleService
      .getAll(searchTerm, customerId ? Number(customerId) : undefined)
      .then(setVehicles)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    customerService.getAll().then(setCustomers).catch(() => {});
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search, customerFilter), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, customerFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, customerId: customers[0]?.id ?? 0 });
    setFormErrors(null);
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      customerId: vehicle.customerId,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      modelYear: vehicle.modelYear,
      color: vehicle.color ?? '',
      chassisNumber: vehicle.chassisNumber ?? '',
      mileage: vehicle.mileage ?? undefined,
      note: vehicle.note ?? '',
    });
    setFormErrors(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.plate.trim() || !form.brand.trim() || !form.model.trim() || !form.customerId) {
      setFormErrors('Müşteri, plaka, marka ve model alanları zorunludur.');
      return;
    }

    setSaving(true);
    setFormErrors(null);
    try {
      if (editingId) {
        await vehicleService.update(editingId, form);
        showToast('Araç güncellendi.', 'success');
      } else {
        await vehicleService.create(form);
        showToast('Araç eklendi.', 'success');
      }
      setShowModal(false);
      load(search, customerFilter);
    } catch (err) {
      setFormErrors(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await vehicleService.remove(deleteTarget.id);
      showToast('Araç silindi.', 'success');
      setDeleteTarget(null);
      load(search, customerFilter);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="Araçlar">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="Plaka, marka veya model ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-select" style={{ maxWidth: 220 }} value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="">Tüm Müşteriler</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
        <button className="btn tt-btn-accent" onClick={openCreateModal}>
          + Yeni Araç
        </button>
      </div>

      <div className="tt-card p-3">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={() => load(search, customerFilter)} />}
        {!loading && !error && vehicles.length === 0 && (
          <EmptyState message="Kayıtlı araç bulunamadı." actionLabel="Yeni Araç Ekle" onAction={openCreateModal} />
        )}
        {!loading && !error && vehicles.length > 0 && (
          <div className="table-responsive">
            <table className="table tt-table">
              <thead>
                <tr>
                  <th>Plaka</th>
                  <th>Marka / Model</th>
                  <th>Yıl</th>
                  <th>Müşteri</th>
                  <th>Km</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td className="fw-semibold">{v.plate}</td>
                    <td>
                      {v.brand} {v.model}
                    </td>
                    <td>{v.modelYear}</td>
                    <td>{v.customerName}</td>
                    <td>{v.mileage ?? '-'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(v)}>
                        Düzenle
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(v)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1040 }} />
          <div className="modal d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Araç Düzenle' : 'Yeni Araç'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {formErrors && <div className="alert alert-danger py-2">{formErrors}</div>}
                  <div className="mb-3">
                    <label className="form-label">Müşteri *</label>
                    <select
                      className="form-select"
                      value={form.customerId}
                      onChange={(e) => setForm({ ...form, customerId: Number(e.target.value) })}
                    >
                      <option value={0}>Seçiniz...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Plaka *</label>
                      <input className="form-control" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Model Yılı *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.modelYear}
                        onChange={(e) => setForm({ ...form, modelYear: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Marka *</label>
                      <input className="form-control" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Model *</label>
                      <input className="form-control" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Renk</label>
                      <input className="form-control" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Kilometre</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.mileage ?? ''}
                        onChange={(e) => setForm({ ...form, mileage: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Şasi No</label>
                      <input
                        className="form-control"
                        value={form.chassisNumber}
                        onChange={(e) => setForm({ ...form, chassisNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Not</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)} disabled={saving}>
                    Vazgeç
                  </button>
                  <button className="btn tt-btn-accent" onClick={handleSave} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        show={!!deleteTarget}
        title="Aracı Sil"
        message={`"${deleteTarget?.plate}" plakalı aracı silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
}
