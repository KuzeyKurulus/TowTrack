import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import { driverService } from '../services/driverService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type { Driver, CreateDriverInput, DriverStatus } from '../types';

const STATUS_OPTIONS: DriverStatus[] = ['Aktif', 'İzinli', 'Pasif'];

const emptyForm: CreateDriverInput = {
  fullName: '',
  phone: '',
  licenseClass: '',
  hireDate: new Date().toISOString().substring(0, 10),
  status: 'Aktif',
  note: '',
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateDriverInput>(emptyForm);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const load = (status?: string) => {
    setLoading(true);
    setError(null);
    driverService
      .getAll(status)
      .then(setDrivers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

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

  const openEditModal = (driver: Driver) => {
    setEditingId(driver.id);
    setForm({
      fullName: driver.fullName,
      phone: driver.phone,
      licenseClass: driver.licenseClass ?? '',
      hireDate: driver.hireDate.substring(0, 10),
      status: driver.status,
      note: driver.note ?? '',
    });
    setFormErrors(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.phone.trim()) {
      setFormErrors('Ad soyad ve telefon alanları zorunludur.');
      return;
    }

    setSaving(true);
    setFormErrors(null);
    try {
      if (editingId) {
        await driverService.update(editingId, form);
        showToast('Sürücü güncellendi.', 'success');
      } else {
        await driverService.create(form);
        showToast('Sürücü eklendi.', 'success');
      }
      setShowModal(false);
      load(statusFilter);
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
      await driverService.remove(deleteTarget.id);
      showToast('Sürücü silindi.', 'success');
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
    <Layout title="Sürücüler">
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
          + Yeni Sürücü
        </button>
      </div>

      <div className="tt-card p-3">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={() => load(statusFilter)} />}
        {!loading && !error && drivers.length === 0 && (
          <EmptyState message="Kayıtlı sürücü bulunamadı." actionLabel="Yeni Sürücü Ekle" onAction={openCreateModal} />
        )}
        {!loading && !error && drivers.length > 0 && (
          <div className="table-responsive">
            <table className="table tt-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Telefon</th>
                  <th>Ehliyet Sınıfı</th>
                  <th>İşe Giriş</th>
                  <th>İş Sayısı</th>
                  <th>Durum</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id}>
                    <td className="fw-semibold">{d.fullName}</td>
                    <td>{d.phone}</td>
                    <td>{d.licenseClass || '-'}</td>
                    <td>{new Date(d.hireDate).toLocaleDateString('tr-TR')}</td>
                    <td>{d.jobCount}</td>
                    <td>
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(d)}>
                        Düzenle
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(d)}>
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
                  <h5 className="modal-title">{editingId ? 'Sürücü Düzenle' : 'Yeni Sürücü'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {formErrors && <div className="alert alert-danger py-2">{formErrors}</div>}
                  <div className="mb-3">
                    <label className="form-label">Ad Soyad *</label>
                    <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Telefon *</label>
                      <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Ehliyet Sınıfı</label>
                      <input
                        className="form-control"
                        value={form.licenseClass}
                        onChange={(e) => setForm({ ...form, licenseClass: e.target.value })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">İşe Giriş Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.hireDate}
                        onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Durum</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as DriverStatus })}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
        title="Sürücüyü Sil"
        message={`"${deleteTarget?.fullName}" adlı sürücüyü silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
}
