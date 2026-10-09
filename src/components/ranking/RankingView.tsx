import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RankingResultItem } from '../../types';
import { Trophy, Medal, Download, Search, Filter, FileSpreadsheet, FileText, Calendar, Eye, X, Building2 } from 'lucide-react';
import { exportRankingToExcel } from '../../utils/excel';
import { exportRankingToPdf } from '../../utils/pdf';

export const RankingView: React.FC = () => {
  const { kriteria, selectedYear, setSelectedYear, availableYears, ahpResult, topsisResult } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailModalItem, setDetailModalItem] = useState<RankingResultItem | null>(null);

  const { rankings } = topsisResult;

  const filteredRankings = useMemo(() => {
    return rankings.filter((r) => {
      const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || r.kode.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || r.priorityCategory === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [rankings, search, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Hasil Perangkingan Akhir</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Trophy className="w-6 h-6 text-phosphor" />
            Ranking Prioritas Penanganan Stunting
          </h1>
          <p className="text-xs text-silver mt-1">Urutan prioritas penanganan stunting Kabupaten/Kota se-Jawa Tengah tahun {selectedYear}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
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

          {/* Export Excel */}
          <button
            onClick={() => exportRankingToExcel(rankings, kriteria, ahpResult.weights, selectedYear)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-aurora" />
            <span>Export Excel</span>
          </button>

          {/* Export PDF */}
          <button onClick={() => exportRankingToPdf(rankings, kriteria, ahpResult.weights, selectedYear)} className="btn-aurora inline-flex items-center gap-1.5 px-3.5 py-2 text-xs">
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards with Semantic Urgency Coloring */}
      {rankings.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Kritis - Orange Urgency) */}
          <div className="order-2 md:order-1 card-kelp p-6 flex flex-col justify-between border border-orange-500/40 bg-gradient-to-b from-orange-950/20 to-kelp shadow-[0_0_20px_rgba(249,115,22,0.12)]">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-buttons text-[11px] font-bold bg-orange-500/20 border border-orange-500/40 text-orange-400 uppercase tracking-wider">Peringkat 2 &bull; Kritis</span>
              <Medal className="w-5 h-5 text-orange-400" />
            </div>
            <div className="my-4">
              <h3 className="text-lg font-medium text-platinum">{rankings[1].nama}</h3>
              <p className="text-xs text-silver font-mono mt-0.5">Kode BPS: {rankings[1].kode}</p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="section-label">Skor TOPSIS (Vi):</span>
                <p className="text-xl font-mono font-bold text-orange-400 mt-0.5">{rankings[1].preferenceScore.toFixed(4)}</p>
              </div>
              <button
                onClick={() => setDetailModalItem(rankings[1])}
                className="px-2.5 py-1 text-xs text-silver hover:text-orange-300 hover:bg-deep rounded-buttons flex items-center gap-1 font-normal transition-colors cursor-pointer border border-white/[0.08]"
              >
                <Eye className="w-3.5 h-3.5" /> Detail
              </button>
            </div>
          </div>

          {/* Rank 1 (Sangat Kritis - Red Crimson Urgency) */}
          <div className="order-1 md:order-2 card-kelp p-6 border-2 border-rose-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)] bg-gradient-to-b from-rose-950/25 to-kelp relative transform md:-translate-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-[11px] font-bold bg-rose-600 text-white rounded-buttons shadow-sm uppercase tracking-wider">PRIORITAS UTAMA #1 &bull; SANGAT KRITIS</span>
              <Trophy className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div className="my-4">
              <h3 className="text-xl font-medium text-platinum tracking-tight">{rankings[0].nama}</h3>
              <p className="text-xs text-silver font-mono mt-0.5">Kode BPS: {rankings[0].kode}</p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="section-label">Skor Preferensi TOPSIS:</span>
                <p className="text-2xl font-mono font-bold text-rose-400 mt-0.5">{rankings[0].preferenceScore.toFixed(4)}</p>
              </div>
              <button onClick={() => setDetailModalItem(rankings[0])} className="px-3 py-1.5 text-xs text-white font-semibold bg-rose-600 hover:bg-rose-500 rounded-buttons flex items-center gap-1 transition-colors cursor-pointer shadow-md">
                <Eye className="w-3.5 h-3.5" /> Rincian
              </button>
            </div>
          </div>

          {/* Rank 3 (Tinggi - Amber/Gold Urgency) */}
          <div className="order-3 md:order-3 card-kelp p-6 flex flex-col justify-between border border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-kelp shadow-[0_0_20px_rgba(234,179,8,0.12)]">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-buttons text-[11px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider">Peringkat 3 &bull; Tinggi</span>
              <Medal className="w-5 h-5 text-amber-400" />
            </div>
            <div className="my-4">
              <h3 className="text-lg font-medium text-platinum">{rankings[2].nama}</h3>
              <p className="text-xs text-silver font-mono mt-0.5">Kode BPS: {rankings[2].kode}</p>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="section-label">Skor TOPSIS (Vi):</span>
                <p className="text-xl font-mono font-bold text-amber-300 mt-0.5">{rankings[2].preferenceScore.toFixed(4)}</p>
              </div>
              <button
                onClick={() => setDetailModalItem(rankings[2])}
                className="px-2.5 py-1 text-xs text-silver hover:text-amber-300 hover:bg-deep rounded-buttons flex items-center gap-1 font-normal transition-colors cursor-pointer border border-white/[0.08]"
              >
                <Eye className="w-3.5 h-3.5" /> Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card-kelp p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-300" />
            <input
              type="text"
              placeholder="Cari nama kabupaten/kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#012220] border border-teal-500/40 rounded-md text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#002422] border border-teal-500/40 px-3 py-1.5 rounded-md text-xs">
            <Filter className="w-3.5 h-3.5 text-teal-300" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#002422] font-medium text-white focus:outline-none cursor-pointer pr-1">
              <option value="all" className="bg-[#002422] text-white">
                Semua Kategori
              </option>
              <option value="Sangat Tinggi" className="bg-[#002422] text-white">
                Prioritas Sangat Tinggi
              </option>
              <option value="Tinggi" className="bg-[#002422] text-white">
                Prioritas Tinggi
              </option>
              <option value="Sedang" className="bg-[#002422] text-white">
                Prioritas Sedang
              </option>
              <option value="Rendah" className="bg-[#002422] text-white">
                Prioritas Rendah
              </option>
            </select>
          </div>
        </div>

        <div className="text-xs text-silver">
          Menampilkan <span className="font-medium text-platinum">{filteredRankings.length}</span> daerah
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="card-kelp overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep/80 text-silver uppercase tracking-[0.08em] font-medium border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-3 text-center w-14">Rank</th>
                <th className="py-3 px-3 w-28">Kode BPS</th>
                <th className="py-3 px-4 min-w-[200px]">Kabupaten / Kota</th>
                <th className="py-3 px-3 text-center">Skor TOPSIS (Vi)</th>
                <th className="py-3 px-3 text-center">Jarak D+</th>
                <th className="py-3 px-3 text-center">Jarak D-</th>
                <th className="py-3 px-3 min-w-[140px] text-center">Kategori Prioritas</th>
                <th className="py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredRankings.map((r) => {
                let rankBadge = 'bg-deep text-silver border border-white/[0.08]';
                let catBadge = 'bg-teal-500/15 text-teal-300 border border-teal-500/30';

                if (r.rank === 1) {
                  rankBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold';
                } else if (r.rank === 2) {
                  rankBadge = 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold';
                } else if (r.rank === 3) {
                  rankBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold';
                }

                if (r.priorityCategory === 'Sangat Tinggi') {
                  catBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold';
                } else if (r.priorityCategory === 'Tinggi') {
                  catBadge = 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold';
                } else if (r.priorityCategory === 'Sedang') {
                  catBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold';
                } else {
                  catBadge = 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold';
                }

                return (
                  <tr key={r.kabupatenId} className="hover:bg-deep/40 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-buttons text-xs font-mono ${rankBadge}`}>{r.rank}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-silver">{r.kode}</td>
                    <td className="py-3 px-4 font-medium text-platinum">{r.nama}</td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-aurora">{r.preferenceScore.toFixed(4)}</td>
                    <td className="py-3 px-3 text-center font-mono text-silver">{r.dPlus.toFixed(4)}</td>
                    <td className="py-3 px-3 text-center font-mono text-silver">{r.dMinus.toFixed(4)}</td>
                    <td className="py-3 px-3 min-w-[140px] text-center">
                      <span className={`inline-flex min-w-[110px] justify-center px-2.5 py-0.5 rounded-buttons text-[11px] font-medium border whitespace-nowrap ${catBadge}`}>{r.priorityCategory}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button onClick={() => setDetailModalItem(r)} className="p-1 rounded-buttons text-silver hover:text-aurora hover:bg-deep transition-colors" title="Lihat Detail Indikator">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Daerah */}
      {detailModalItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-abyss/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-deep rounded-cards max-w-lg w-full p-6 shadow-2xl border border-white/[0.12] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-buttons bg-kelp flex items-center justify-center text-aurora">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-platinum">{detailModalItem.nama}</h3>
                  <p className="text-[11px] text-silver font-mono">Kode Wilayah: {detailModalItem.kode}</p>
                </div>
              </div>
              <button onClick={() => setDetailModalItem(null)} className="text-silver hover:text-platinum p-1 rounded-buttons cursor-pointer hover:bg-kelp transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Summary stat */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-buttons bg-abyss border border-white/[0.08] text-center">
                <div>
                  <span className="section-label">Peringkat</span>
                  <p className={`text-base font-mono font-bold mt-0.5 ${detailModalItem.rank === 1 ? 'text-rose-400' : detailModalItem.rank === 2 ? 'text-orange-400' : detailModalItem.rank === 3 ? 'text-amber-300' : 'text-platinum'}`}>
                    #{detailModalItem.rank}
                  </p>
                </div>
                <div>
                  <span className="section-label">Skor TOPSIS</span>
                  <p className="text-base font-mono font-medium text-aurora mt-0.5">{detailModalItem.preferenceScore.toFixed(4)}</p>
                </div>
                <div>
                  <span className="section-label">Prioritas</span>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      detailModalItem.priorityCategory === 'Sangat Tinggi'
                        ? 'text-rose-300'
                        : detailModalItem.priorityCategory === 'Tinggi'
                          ? 'text-orange-300'
                          : detailModalItem.priorityCategory === 'Sedang'
                            ? 'text-amber-300'
                            : 'text-teal-300'
                    }`}
                  >
                    {detailModalItem.priorityCategory}
                  </p>
                </div>
              </div>

              {/* Indicator values */}
              <div>
                <h4 className="section-label mb-2">Nilai Indikator Penilaian Stunting ({selectedYear}):</h4>
                <div className="space-y-2">
                  {kriteria.map((c) => {
                    const raw = detailModalItem.rawValues[c.id];
                    const weight = ahpResult.weights[c.id] || 0;
                    return (
                      <div key={c.id} className="p-2.5 rounded-buttons bg-abyss border border-white/[0.08] flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-aurora">{c.id}</span>
                            <span className="font-medium text-platinum">{c.nama}</span>
                          </div>
                          <p className="text-[10px] text-silver/70 font-mono">
                            Atribut: {c.atribut.toUpperCase()} &bull; Bobot: {(weight * 100).toFixed(1)}%
                          </p>
                        </div>
                        <span className="font-mono font-medium text-platinum">{Number(raw).toLocaleString('id-ID')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Distances */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                  <span className="text-[11px] text-silver">Jarak Solusi Positif (D+):</span>
                  <p className="font-mono font-medium text-aurora text-sm mt-0.5">{detailModalItem.dPlus.toFixed(4)}</p>
                </div>
                <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                  <span className="text-[11px] text-silver">Jarak Solusi Negatif (D-):</span>
                  <p className="font-mono font-medium text-phosphor text-sm mt-0.5">{detailModalItem.dMinus.toFixed(4)}</p>
                </div>
              </div>

              <button onClick={() => setDetailModalItem(null)} className="w-full py-2.5 rounded-buttons bg-kelp hover:bg-kelp/80 text-platinum font-medium text-xs border border-white/[0.08] transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
