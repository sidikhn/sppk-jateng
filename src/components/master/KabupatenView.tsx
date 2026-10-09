import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KabupatenKota } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { exportKabupatenToExcel } from '../../utils/excel';
import * as XLSX from 'xlsx';

export const KabupatenView: React.FC = () => {
  const { kabupaten, addKabupaten, updateKabupaten, deleteKabupaten, batchSetKabupaten, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KabupatenKota | null>(null);

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [formError, setFormError] = useState('');

  const filteredKabupaten = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return kabupaten;
    return kabupaten.filter(
      (k) => k.nama.toLowerCase().includes(q) || k.kode.toLowerCase().includes(q)
    );
  }, [kabupaten, search]);

  const openAddModal = () => {
    setEditingItem(null);
    setKode('');
    setNama('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: KabupatenKota) => {
    setEditingItem(item);
    setKode(item.kode);
    setNama(item.nama);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim() || !nama.trim()) {
      setFormError('Kode dan Nama Kabupaten/Kota wajib diisi.');
      return;
    }

    if (editingItem) {
      updateKabupaten({
        id: editingItem.id,
        kode: kode.trim(),
        nama: nama.trim(),
      });
    } else {
      addKabupaten({
        kode: kode.trim(),
        nama: nama.trim(),
      });
    }

    setModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);

      if (!rows || rows.length === 0) {
        addToast('error', 'File Kosong', 'Tidak ada baris data dalam file Excel.');
        return;
      }

      const imported: KabupatenKota[] = [];
      let nextId = 1;

      rows.forEach((row) => {
        const k = String(row['kode_daerah'] || row['Kode BPS'] || row['kode'] || row['Kode'] || '').trim();
        const n = String(row['nama_daerah'] || row['Nama Kabupaten / Kota'] || row['nama'] || row['Nama'] || '').trim();
        if (n) {
          imported.push({
            id: nextId++,
            kode: k || `33${String(nextId).padStart(2, '0')}`,
            nama: n,
          });
        }
      });

      if (imported.length > 0) {
        batchSetKabupaten(imported);
      } else {
        addToast('warning', 'Format Tidak Sesuai', 'Pastikan kolom kode dan nama tersedia.');
      }
    } catch (err: any) {
      addToast('error', 'Gagal Import Excel', err?.message || 'Format tidak valid');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Master Data Alternatif</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Building2 className="w-6 h-6 text-aurora" />
            Kabupaten / Kota Jawa Tengah
          </h1>
          <p className="text-xs text-silver mt-1">
            Daftar 35 wilayah administratif sebagai alternatif keputusan intervensi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import Button */}
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum hover:bg-kelp/80 text-xs font-normal transition-colors">
            <Upload className="w-3.5 h-3.5 text-aurora" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Export Button */}
          <button
            onClick={() => exportKabupatenToExcel(kabupaten)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum hover:bg-kelp/80 text-xs font-normal transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-aurora" />
            <span>Export Excel</span>
          </button>

          {/* Add Button with Aurora gradient */}
          <button
            onClick={openAddModal}
            className="btn-aurora inline-flex items-center gap-1.5 px-3.5 py-2 text-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Kabupaten</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-kelp p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-300" />
          <input
            type="text"
            placeholder="Cari nama atau kode daerah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#012220] border border-teal-500/40 rounded-md text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
          />
        </div>

        <div className="text-xs text-silver">
          Menampilkan <span className="font-medium text-platinum">{filteredKabupaten.length}</span> dari {kabupaten.length} daerah
        </div>
      </div>

      {/* Table List */}
      <div className="card-kelp overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep/80 text-silver uppercase tracking-[0.08em] font-medium border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4 text-center w-16">No</th>
                <th className="py-3 px-4 w-32">Kode BPS</th>
                <th className="py-3 px-4">Nama Kabupaten / Kota</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredKabupaten.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-silver/60">
                    Tidak ditemukan data kabupaten yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredKabupaten.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-deep/40 transition-colors">
                    <td className="py-3 px-4 text-center text-silver/70 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-silver">
                      <span className="px-2 py-0.5 rounded-buttons bg-deep border border-white/[0.06] text-aurora">
                        {item.kode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-platinum">
                      {item.nama}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-buttons text-silver hover:text-aurora hover:bg-deep transition-colors"
                          title="Edit Kabupaten"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus ${item.nama}? Data indikator terkait juga akan terhapus.`)) {
                              deleteKabupaten(item.id);
                            }
                          }}
                          className="p-1.5 rounded-buttons text-silver hover:text-rose-400 hover:bg-deep transition-colors"
                          title="Hapus Kabupaten"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-abyss/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-deep rounded-cards max-w-md w-full p-6 shadow-2xl border border-white/[0.12]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-medium text-platinum">
                {editingItem ? 'Edit Kabupaten / Kota' : 'Tambah Kabupaten / Kota Baru'}
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
                  Kode Wilayah (BPS)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 3301"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-silver mb-1">
                  Nama Kabupaten / Kota
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kabupaten Cilacap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50"
                  required
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
