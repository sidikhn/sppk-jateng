import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DatasetIndikator } from '../../types';
import {
  Table,
  Plus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';
import {
  exportDatasetToExcel,
  downloadDatasetTemplate,
  parseDatasetExcel,
} from '../../utils/excel';

export const DatasetView: React.FC = () => {
  const {
    dataset,
    kabupaten,
    kriteria,
    selectedYear,
    setSelectedYear,
    availableYears,
    addDatasetItem,
    updateDatasetItem,
    deleteDatasetItem,
    batchSetDataset,
    addToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DatasetIndikator | null>(null);

  const [formKabupatenId, setFormKabupatenId] = useState<number>(kabupaten[0]?.id || 1);
  const [formTahun, setFormTahun] = useState<number>(selectedYear);
  const [formValues, setFormValues] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState('');

  const kabMap = useMemo(() => {
    const map = new Map<number, string>();
    kabupaten.forEach((k) => map.set(k.id, k.nama));
    return map;
  }, [kabupaten]);

  const filteredDataset = useMemo(() => {
    const yearFiltered = dataset.filter((d) => d.tahun === selectedYear);
    const q = search.toLowerCase().trim();
    if (!q) return yearFiltered;

    return yearFiltered.filter((d) => {
      const name = (kabMap.get(d.kabupatenId) || '').toLowerCase();
      return name.includes(q);
    });
  }, [dataset, selectedYear, search, kabMap]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormKabupatenId(kabupaten[0]?.id || 1);
    setFormTahun(selectedYear);
    const initialVals: Record<string, number> = {};
    kriteria.forEach((c) => {
      initialVals[c.id] = c.id === 'C1' ? 15.0 : c.id === 'C2' ? 5000 : c.id === 'C3' ? 10.0 : c.id === 'C4' ? 85.0 : c.id === 'C5' ? 88.0 : 300;
    });
    setFormValues(initialVals);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: DatasetIndikator) => {
    setEditingItem(item);
    setFormKabupatenId(item.kabupatenId);
    setFormTahun(item.tahun);
    const vals: Record<string, number> = {};
    kriteria.forEach((c) => {
      vals[c.id] = Number(item[c.id]) || 0;
    });
    setFormValues(vals);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: DatasetIndikator = {
      kabupatenId: Number(formKabupatenId),
      tahun: Number(formTahun),
      C1: Number(formValues['C1']) || 0,
      C2: Number(formValues['C2']) || 0,
      C3: Number(formValues['C3']) || 0,
      C4: Number(formValues['C4']) || 0,
      C5: Number(formValues['C5']) || 0,
      C6: Number(formValues['C6']) || 0,
      ...formValues,
    };

    if (editingItem) {
      updateDatasetItem(payload);
    } else {
      addDatasetItem(payload);
    }

    setModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await parseDatasetExcel(file, kabupaten, kriteria);
    if (res.success && res.data) {
      batchSetDataset(res.data);
    } else {
      addToast('error', 'Gagal Import', res.error || 'Terjadi kesalahan format data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Tabel Observasi Empiris</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Table className="w-6 h-6 text-aurora" />
            Dataset Indikator Stunting Daerah
          </h1>
          <p className="text-xs text-silver mt-1">
            Data empiris indikator per kabupaten/kota yang menjadi input matriks keputusan TOPSIS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Template Download */}
          <button
            onClick={() => downloadDatasetTemplate(kabupaten, kriteria)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors"
            title="Download Template Format Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-aurora" />
            <span>Format Excel</span>
          </button>

          {/* Import Button */}
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors">
            <Upload className="w-3.5 h-3.5 text-aurora" />
            <span>Import Excel</span>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Export Button */}
          <button
            onClick={() => exportDatasetToExcel(dataset, kabupaten, kriteria, selectedYear)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-aurora" />
            <span>Export Excel</span>
          </button>

          {/* Add Button */}
          <button
            onClick={openAddModal}
            className="btn-aurora inline-flex items-center gap-1.5 px-3.5 py-2 text-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Input Data</span>
          </button>
        </div>
      </div>

      {/* Filter and Year Toolbar */}
      <div className="card-kelp p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-300" />
            <input
              type="text"
              placeholder="Cari nama kabupaten..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#012220] border border-teal-500/40 rounded-md text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#002422] border border-teal-500/40 px-3 py-1.5 rounded-md text-xs">
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span className="text-slate-300 font-medium">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-[#002422] font-semibold text-teal-200 focus:outline-none cursor-pointer pr-1"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-[#002422] text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-silver">
          Terdata: <span className="font-medium text-platinum">{filteredDataset.length}</span> daerah ({selectedYear})
        </div>
      </div>

      {/* Dataset Table */}
      <div className="card-kelp overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep/80 text-silver uppercase tracking-[0.08em] font-medium border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-4 min-w-[180px]">Kabupaten / Kota</th>
                <th className="py-3 px-3 text-center w-16">Tahun</th>
                {kriteria.map((c) => (
                  <th key={c.id} className="py-3 px-3 text-center min-w-[90px]" title={c.nama}>
                    <div className="font-mono font-bold text-aurora">{c.id}</div>
                    <div className="text-[10px] text-silver/60 uppercase">{c.atribut}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredDataset.length === 0 ? (
                <tr>
                  <td colSpan={4 + kriteria.length} className="py-8 text-center text-silver/60">
                    Belum ada data indikator untuk tahun {selectedYear}. Klik &quot;Input Data&quot; atau &quot;Import Excel&quot;.
                  </td>
                </tr>
              ) : (
                filteredDataset.map((item, idx) => {
                  const kabName = kabMap.get(item.kabupatenId) || `ID ${item.kabupatenId}`;
                  return (
                    <tr key={`${item.kabupatenId}-${item.tahun}`} className="hover:bg-deep/40 transition-colors">
                      <td className="py-3 px-3 text-center text-silver/70 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-platinum">
                        {kabName}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-silver">
                        {item.tahun}
                      </td>
                      {kriteria.map((c) => {
                        const val = item[c.id];
                        return (
                          <td key={c.id} className="py-3 px-3 text-center font-mono text-silver">
                            {val !== undefined ? Number(val).toLocaleString('id-ID') : '-'}
                          </td>
                        );
                      })}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-buttons text-silver hover:text-aurora hover:bg-deep transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus data ${kabName} tahun ${item.tahun}?`)) {
                                deleteDatasetItem(item.kabupatenId, item.tahun);
                              }
                            }}
                            className="p-1.5 rounded-buttons text-silver hover:text-rose-400 hover:bg-deep transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input/Edit Data */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-abyss/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-deep rounded-cards max-w-lg w-full p-6 shadow-2xl border border-white/[0.12] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-medium text-platinum">
                {editingItem ? 'Edit Data Indikator' : 'Input Data Indikator Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-silver hover:text-platinum p-1 rounded-buttons"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-silver mb-1">
                    Kabupaten / Kota
                  </label>
                  <select
                    value={formKabupatenId}
                    disabled={!!editingItem}
                    onChange={(e) => setFormKabupatenId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50"
                  >
                    {kabupaten.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-silver mb-1">
                    Tahun Data
                  </label>
                  <input
                    type="number"
                    value={formTahun}
                    onChange={(e) => setFormTahun(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-platinum focus:outline-none focus:border-aurora/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08]">
                <p className="text-xs font-medium text-platinum mb-2">
                  Nilai Indikator Penilaian:
                </p>
                <div className="space-y-3">
                  {kriteria.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <span className="font-medium text-xs text-platinum">
                          {c.id} - {c.nama}
                        </span>
                        <span className="ml-2 text-[10px] uppercase font-mono text-silver">
                          ({c.atribut})
                        </span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={formValues[c.id] ?? ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [c.id]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-32 px-3 py-1.5 bg-abyss border border-white/[0.12] rounded-buttons text-xs text-right font-mono text-platinum focus:outline-none focus:border-aurora/50"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
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
