import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusViews';
import ConfirmModal from '../components/ConfirmModal';
import { customerService } from '../services/customerService';
import { getErrorMessage } from '../services/apiClient';
import { useToast } from '../hooks/useToast';
import type { Customer, CreateCustomerInput } from '../types';

const emptyForm: CreateCustomerInput = { fullName: '', phone: '', email: '', address: '', note: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCustomerInput>(emptyForm);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const load = (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    customerService
      .getAll(searchTerm)
      .then(setCustomers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => load(search), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors(null);
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email ?? '',
      address: customer.address ?? '',
      note: customer.note ?? '',
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
        await customerService.update(editingId, form);
        showToast('Müşteri güncellendi.', 'success');
      } else {
        await customerService.create(form);
        showToast('Müşteri eklendi.', 'success');
      }
      setShowModal(false);
      load(search);
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
      await customerService.remove(deleteTarget.id);
      showToast('Müşteri silindi.', 'success');
      setDeleteTarget(null);
      load(search);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="Müşteriler">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Ad, telefon veya e-posta ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn tt-btn-accent" onClick={openCreateModal}>
          + Yeni Müşteri
        </button>
      </div>

      <div className="tt-card p-3">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={() => load(search)} />}
        {!loading && !error && customers.length === 0 && (
          <EmptyState message="Kayıtlı müşteri bulunamadı." actionLabel="Yeni Müşteri Ekle" onAction={openCreateModal} />
        )}
        {!loading && !error && customers.length > 0 && (
          <div className="table-responsive">
            <table className="table tt-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Telefon</th>
                  <th>E-posta</th>
                  <th>Araç Sayısı</th>
                  <th>İş Sayısı</th>
                  <th className="text-end">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        role="button"
                        className="fw-semibold"
                        onClick={() => navigate(`/customers/${c.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {c.fullName}
                      </span>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.email || '-'}</td>
                    <td>{c.vehicleCount}</td>
                    <td>{c.jobCount}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(`/customers/${c.id}`)}>
                        Görüntüle
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEditModal(c)}>
                        Düzenle
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(c)}>
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
                  <h5 className="modal-title">{editingId ? 'Müşteri Düzenle' : 'Yeni Müşteri'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {formErrors && <div className="alert alert-danger py-2">{formErrors}</div>}
                  <div className="mb-3">
                    <label className="form-label">Ad Soyad *</label>
                    <input
                      className="form-control"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefon *</label>
                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-posta</label>
                    <input
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adres</label>
                    <input
                      className="form-control"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <div className="mb-1">
                    <label className="form-label">Not</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
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
        title="Müşteriyi Sil"
        message={`"${deleteTarget?.fullName}" adlı müşteriyi silmek istediğinize emin misiniz?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Layout>
  );
}
