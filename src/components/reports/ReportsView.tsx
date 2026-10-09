import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, FileSpreadsheet, Download, Calendar, Scale, FileCheck } from 'lucide-react';
import { exportRankingToPdf, exportAhpToPdf } from '../../utils/pdf';
import { exportRankingToExcel, exportDatasetToExcel } from '../../utils/excel';

export const ReportsView: React.FC = () => {
  const { kabupaten, kriteria, dataset, selectedYear, setSelectedYear, availableYears, ahpMatrix, ahpResult, topsisResult } = useApp();

  const countYearDataset = dataset.filter((d) => d.tahun === selectedYear).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Dokumentasi & Ekspor Berkas</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <FileText className="w-6 h-6 text-aurora" />
            Pusat Unduhan Laporan & Ekspor Data
          </h1>
          <p className="text-xs text-silver mt-1">Unduh berkas resmi hasil analisis SPK Stunting dalam format PDF siap cetak dan Excel spreadsheet</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#002422] border border-teal-500/40 px-3 py-2 rounded-md text-xs">
          <Calendar className="w-3.5 h-3.5 text-teal-300" />
          <span className="text-slate-300 font-medium">Tahun:</span>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-[#002422] font-semibold text-teal-200 focus:outline-none cursor-pointer pr-1">
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-[#002422] text-white">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of 4 Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: PDF Ranking */}
        <div className="card-kelp p-6 flex flex-col justify-between hover:border-aurora/30 transition-all">
          <div>
            <div className="w-12 h-12 rounded-buttons bg-deep text-aurora flex items-center justify-center mb-4 border border-white/[0.08]">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-medium text-platinum">1. Laporan PDF Hasil Ranking Prioritas</h3>
              <span className="shrink-0 text-[10px] bg-deep border border-aurora/30 text-aurora font-mono px-2 py-0.5 rounded-buttons">PDF</span>
            </div>
            <p className="text-sm text-silver mt-2 leading-relaxed">Dokumen resmi Pemerintah Provinsi Jawa Tengah yang memuat daftar lengkap 35 Kabupaten/Kota terurut berdasarkan skor TOPSIS, kategori prioritas, dan ringkasan bobot AHP.</p>
            <div className="mt-4 p-3 bg-deep rounded-buttons text-sm text-silver space-y-1 border border-white/[0.06]">
              <div>
                &bull; Total Wilayah: <strong className="text-platinum">{topsisResult.rankings.length} Kabupaten/Kota</strong>
              </div>
              <div>
                &bull; Tahun Dokumen: <strong className="text-platinum">{selectedYear}</strong>
              </div>
              <div>&bull; Dilengkapi Kop Resmi & Penomoran Halaman</div>
            </div>
          </div>

          <button
            onClick={() => exportRankingToPdf(topsisResult.rankings, kriteria, ahpResult.weights, selectedYear)}
            className="btn-aurora mt-6 w-full py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(203,255,252,0.15)]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Unduh PDF Hasil Ranking</span>
          </button>
        </div>

        {/* Card 2: Excel Ranking */}
        <div className="card-kelp p-6 flex flex-col justify-between hover:border-aurora/30 transition-all">
          <div>
            <div className="w-12 h-12 rounded-buttons bg-deep text-aurora flex items-center justify-center mb-4 border border-white/[0.08]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-medium text-platinum">2. Spreadsheet Excel Hasil Ranking</h3>
              <span className="shrink-0 text-[10px] bg-deep border border-aurora/30 text-aurora font-mono px-2 py-0.5 rounded-buttons">XLSX</span>
            </div>
            <p className="text-sm text-silver mt-2 leading-relaxed">
              Berkas Microsoft Excel (.xlsx) dengan multi-sheet: Sheet 1 berisi hasil perangkingan, nilai preferensi Vi, jarak D+/D-, dan nilai riil kriteria; Sheet 2 berisi rincian bobot AHP.
            </p>
            <div className="mt-4 p-3 bg-deep rounded-buttons text-sm text-silver space-y-1 border border-white/[0.06]">
              <div>
                &bull; Format: <strong className="text-platinum">Microsoft Excel (.xlsx)</strong>
              </div>
              <div>
                &bull; Multi-Sheet: <strong className="text-platinum">Ranking & Bobot Kriteria</strong>
              </div>
              <div>&bull; Kompatibel untuk analisis lanjutan SPSS / Excel</div>
            </div>
          </div>

          <button
            onClick={() => exportRankingToExcel(topsisResult.rankings, kriteria, ahpResult.weights, selectedYear)}
            className="mt-6 w-full py-2.5 px-4 rounded-buttons bg-deep hover:bg-deep/80 text-platinum border border-white/[0.12] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-aurora" />
            <span>Unduh Excel Hasil Ranking</span>
          </button>
        </div>

        {/* Card 3: PDF Bobot AHP */}
        <div className="card-kelp p-6 flex flex-col justify-between hover:border-aurora/30 transition-all">
          <div>
            <div className="w-12 h-12 rounded-buttons bg-deep text-phosphor flex items-center justify-center mb-4 border border-white/[0.08]">
              <Scale className="w-6 h-6" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-medium text-platinum">3. Laporan PDF Perhitungan Bobot AHP</h3>
              <span className="shrink-0 text-[10px] bg-deep border border-phosphor/30 text-phosphor font-mono px-2 py-0.5 rounded-buttons">PDF</span>
            </div>
            <p className="text-sm text-silver mt-2 leading-relaxed">
              Dokumen verifikasi akademis yang memuat matriks pairwise comparison, matriks normalisasi, eigen vector bobot kriteria, serta parameter uji konsistensi (λ max, CI, RI, CR).
            </p>
            <div className="mt-4 p-3 bg-deep rounded-buttons text-sm text-silver space-y-1 border border-white/[0.06]">
              <div>
                &bull; Status CR: <strong className="text-platinum">{ahpResult.isConsistent ? 'Konsisten (≤ 10%)' : 'Perlu Revisi'}</strong>
              </div>
              <div>
                &bull; Jumlah Kriteria: <strong className="text-platinum">{kriteria.length} Indikator</strong>
              </div>
              <div>&bull; Standar Verifikasi Akademik</div>
            </div>
          </div>

          <button
            onClick={() => exportAhpToPdf(kriteria, ahpMatrix, ahpResult)}
            className="mt-6 w-full py-2.5 px-4 rounded-buttons bg-deep hover:bg-deep/80 text-platinum border border-white/[0.12] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-phosphor" />
            <span>Unduh PDF Bobot AHP</span>
          </button>
        </div>

        {/* Card 4: Excel Dataset */}
        <div className="card-kelp p-6 flex flex-col justify-between hover:border-aurora/30 transition-all">
          <div>
            <div className="w-12 h-12 rounded-buttons bg-deep text-aurora flex items-center justify-center mb-4 border border-white/[0.08]">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-medium text-platinum">4. Backup Excel Seluruh Dataset Indikator</h3>
              <span className="shrink-0 text-[10px] bg-deep border border-aurora/30 text-aurora font-mono px-2 py-0.5 rounded-buttons">XLSX</span>
            </div>
            <p className="text-sm text-silver mt-2 leading-relaxed">Ekspor seluruh data mentah indikator C1 s.d. C6 untuk seluruh kabupaten/kota pada tahun terpilih atau database keseluruhan. Kompatibel penuh untuk diimpor kembali.</p>
            <div className="mt-4 p-3 bg-deep rounded-buttons text-sm text-silver space-y-1 border border-white/[0.06]">
              <div>
                &bull; Total Rekaman: <strong className="text-platinum">{countYearDataset} Data</strong>
              </div>
              <div>
                &bull; Format: <strong className="text-platinum">kode_daerah, nama_daerah, C1..C6</strong>
              </div>
              <div>&bull; Kompatibel untuk Restore / Import</div>
            </div>
          </div>

          <button
            onClick={() => exportDatasetToExcel(dataset, kabupaten, kriteria, selectedYear)}
            className="mt-6 w-full py-2.5 px-4 rounded-buttons bg-deep hover:bg-deep/80 text-platinum border border-white/[0.12] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-aurora" />
            <span>Unduh Excel Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
