import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import { towTruckService } from '../services/towTruckService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type { TowTruck, CreateTowTruckInput, TowTruckStatus } from '../types';

const STATUS_OPTIONS: TowTruckStatus[] = ['Müsait', 'Görevde', 'Bakımda', 'Pasif'];

const emptyForm: CreateTowTruckInput = {
  plate: '',
  brand: '',
  model: '',
  modelYear: new Date().getFullYear(),
  vehicleType: '',
  capacity: 0,
  status: 'Müsait',
  lastMaintenanceDate: '',
  note: '',
};

export default function TowTrucksPage() {
  const [trucks, setTrucks] = useState<TowTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateTowTruckInput>(emptyForm);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TowTruck | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const load = (status?: string) => {
    setLoading(true);
    setError(null);
    towTruckService
      .getAll(status)
      .then(setTrucks)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors(null);
    setShowModal(true);
  };

  const openEditModal = (truck: TowTruck) => {
    setEditingId(truck.id);
    setForm({
      plate: truck.plate,
      brand: truck.brand,
      model: truck.model,
      modelYear: truck.modelYear,
      vehicleType: truck.vehicleType,
      capacity: truck.capacity,
      status: truck.status,
      lastMaintenanceDate: truck.lastMaintenanceDate ? truck.lastMaintenanceDate.substring(0, 10) : '',
      note: truck.note ?? '',
    });
    setFormErrors(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.plate.trim() || !form.brand.trim() || !form.model.trim() || !form.vehicleType.trim()) {
      setFormErrors('Plaka, marka, model ve araç tipi alanları zorunludur.');
      return;
    }

    setSaving(true);
    setFormErrors(null);
    try {
      if (editingId) {
        await towTruckService.update(editingId, form);
        showToast('Çekici güncellendi.', 'success');
      } else {
        await towTruckService.create(form);
        showToast('Çekici eklendi.', 'success');
      }
      setShowModal(false);
      load(statusFilter);
    } catch (err) {
      setFormErrors(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (truck: TowTruck, status: TowTruckStatus) => {
    try {
      await towTruckService.updateStatus(truck.id, status);
      showToast('Çekici durumu güncellendi.', 'success');
      load(statusFilter);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await towTruckService.remove(deleteTarget.id);
      showToast('Çekici silindi.', 'success');
      setDeleteTarget(null);
      load(statusFilter);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="Çekiciler">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <select className="form-select" style={{ maxWidth: 220 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tüm Durumlar</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn tt-btn-accent" onClick={openCreateModal}>
          + Yeni Çekici
        </button>
      </div>

      <div className="row g-3">
        {loading && (
          <div className="col-12">
            <LoadingState />
          </div>
        )}
        {!loading && error && (
          <div className="col-12">
            <ErrorState message={error} onRetry={() => load(statusFilter)} />
          </div>
        )}
        {!loading && !error && trucks.length === 0 && (
          <div className="col-12">
            <EmptyState message="Kayıtlı çekici bulunamadı." actionLabel="Yeni Çekici Ekle" onAction={openCreateModal} />
          </div>
        )}
        {!loading &&
          !error &&
          trucks.map((t) => (
            <div className="col-md-6 col-lg-4" key={t.id}>
              <div className="tt-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '1.05rem' }}>
                      {t.plate}
                    </div>
                    <div className="tt-muted" style={{ fontSize: '0.85rem' }}>
                      {t.brand} {t.model} ({t.modelYear})
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <div className="tt-muted mb-1" style={{ fontSize: '0.85rem' }}>
                  Tip: {t.vehicleType} · Kapasite: {t.capacity} kg
                </div>
                {t.lastMaintenanceDate && (
                  <div className="tt-muted mb-2" style={{ fontSize: '0.85rem' }}>
                    Son Bakım: {new Date(t.lastMaintenanceDate).toLocaleDateString('tr-TR')}
                  </div>
                )}
                <div className="d-flex gap-2 mt-2">
                  <select
                    className="form-select form-select-sm"
                    value={t.status}
                    onChange={(e) => handleStatusChange(t, e.target.value as TowTruckStatus)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditModal(t)}>
                    Düzenle
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(t)}>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ zIndex: 1040 }} />
          <div className="modal d-block" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Çekici Düzenle' : 'Yeni Çekici'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {formErrors && <div className="alert alert-danger py-2">{formErrors}</div>}
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
                      <label className="form-label">Araç Tipi *</label>
                      <input
                        className="form-control"
                        placeholder="Platform, Vinç..."
                        value={form.vehicleType}
                        onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Kapasite (kg) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Durum</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as TowTruckStatus })}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Son Bakım Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.lastMaintenanceDate}
                        onChange={(e) => setForm({ ...form, lastMaintenanceDate: e.target.value })}
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
        title="Çekiciyi Sil"
        message={`"${deleteTarget?.plate}" plakalı çekiciyi silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
}
