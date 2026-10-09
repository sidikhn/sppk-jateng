import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Kriteria, CriterionType } from '../../types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';

export const KriteriaView: React.FC = () => {
  const { kriteria, addKriteria, updateKriteria, deleteKriteria, ahpResult } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null);

  const [id, setId] = useState('');
  const [nama, setNama] = useState('');
  const [atribut, setAtribut] = useState<CriterionType>('benefit');
  const [keterangan, setKeterangan] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    const nextNum = kriteria.length + 1;
    setId(`C${nextNum}`);
    setNama('');
    setAtribut('benefit');
    setKeterangan('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: Kriteria) => {
    setEditingItem(item);
    setId(item.id);
    setNama(item.nama);
    setAtribut(item.atribut);
    setKeterangan(item.keterangan || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !nama.trim()) {
      setFormError('Kode dan Nama Kriteria wajib diisi.');
      return;
    }

    const payload: Kriteria = {
      id: id.trim().toUpperCase(),
      nama: nama.trim(),
      atribut,
      keterangan: keterangan.trim(),
    };

    if (editingItem) {
      updateKriteria(payload);
    } else {
      addKriteria(payload);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Konfigurasi Indikator</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Sliders className="w-6 h-6 text-aurora" />
            Kriteria Penilaian Prioritas Stunting
          </h1>
          <p className="text-xs text-silver mt-1">
            Indikator penentu prioritas intervensi (Benefit: nilai tinggi prioritas, Cost: nilai rendah prioritas)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-aurora inline-flex items-center gap-1.5 px-3.5 py-2 text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Kriteria</span>
        </button>
      </div>

      {/* Info card */}
      <div className="card-deep p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-aurora flex-shrink-0 mt-0.5" />
        <div className="text-xs text-silver leading-relaxed">
          <p className="font-medium text-platinum">Prinsip Atribut Kriteria:</p>
          <p className="mt-0.5">
            <strong>Benefit:</strong> Semakin tinggi nilainya di daerah, semakin tinggi kebutuhan penanganan (misal prevalensi & balita stunting).
          </p>
          <p className="mt-0.5">
            <strong>Cost:</strong> Semakin rendah nilainya di daerah, fasilitas makin minim sehingga semakin mendesak untuk diintervensi (misal sanitasi layak & nakes).
          </p>
        </div>
      </div>

      {/* Criteria Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kriteria.map((crit) => {
          const weightInfo = ahpResult.weightsList.find((w) => w.id === crit.id);
          const isBenefit = crit.atribut === 'benefit';

          return (
            <div
              key={crit.id}
              className="card-kelp p-5 flex flex-col justify-between hover:border-aurora/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-base font-bold text-aurora bg-deep px-2.5 py-0.5 rounded-buttons border border-white/[0.08]">
                    {crit.id}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-buttons text-[11px] font-medium tracking-wide uppercase ${
                      isBenefit
                        ? 'bg-deep text-aurora border border-aurora/30'
                        : 'bg-deep text-phosphor border border-phosphor/30'
                    }`}
                  >
                    {isBenefit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isBenefit ? 'BENEFIT' : 'COST'}
                  </span>
                </div>

                <h3 className="font-medium text-platinum text-sm mb-1.5">{crit.nama}</h3>
                <p className="text-xs text-silver leading-relaxed min-h-[36px]">
                  {crit.keterangan || (isBenefit ? 'Semakin tinggi nilai semakin diprioritaskan.' : 'Semakin rendah nilai semakin diprioritaskan.')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="section-label">Bobot AHP:</span>
                  <p className="text-sm font-medium text-phosphor font-mono">
                    {weightInfo ? `${weightInfo.percentage.toFixed(1)}% (${weightInfo.weight.toFixed(4)})` : '-'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(crit)}
                    className="p-1.5 rounded-buttons text-silver hover:text-aurora hover:bg-deep transition-colors"
                    title="Edit Kriteria"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {kriteria.length > 2 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus kriteria ${crit.id}? Matriks AHP akan disesuaikan.`)) {
                          deleteKriteria(crit.id);
                        }
                      }}
                      className="p-1.5 rounded-buttons text-silver hover:text-rose-400 hover:bg-deep transition-colors"
                      title="Hapus Kriteria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-abyss/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-deep rounded-cards max-w-md w-full p-6 shadow-2xl border border-white/[0.12]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-medium text-platinum">
                {editingItem ? 'Edit Kriteria Penilaian' : 'Tambah Kriteria Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-silver hover:text-platinum p-1 rounded-buttons"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-buttons bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-silver mb-1">
                  Kode Kriteria
                </label>
                <input
                  type="text"
                  placeholder="Contoh: C1"
                  value={id}
                  disabled={!!editingItem}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50 font-mono disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-silver mb-1">
                  Nama Kriteria
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Prevalensi Stunting (%)"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-silver mb-1">
                  Jenis Atribut
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAtribut('benefit')}
                    className={`py-2 px-3 rounded-buttons border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      atribut === 'benefit'
                        ? 'bg-kelp border-aurora text-aurora'
                        : 'border-white/[0.12] text-silver'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Benefit
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtribut('cost')}
                    className={`py-2 px-3 rounded-buttons border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      atribut === 'cost'
                        ? 'bg-kelp border-phosphor text-phosphor'
                        : 'border-white/[0.12] text-silver'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    Cost
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-silver mb-1">
                  Keterangan Logika
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan arah indikator terhadap prioritas..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-buttons border border-white/[0.12] text-silver hover:text-platinum text-xs font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-aurora flex-1 py-2 px-4 text-xs font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
