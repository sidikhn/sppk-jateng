import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ArrowRight, TrendingUp, TrendingDown, Calendar, ArrowUpRight } from 'lucide-react';

export const TopsisView: React.FC = () => {
  const { kriteria, selectedYear, setSelectedYear, availableYears, ahpResult, topsisResult, topsisSubTab, setTopsisSubTab, setActiveTab } = useApp();

  const activeTab = topsisSubTab || 'matrix';

  const setTab = (tab: string) => {
    setTopsisSubTab(tab);
  };

  const { decisionMatrix, divisors, normalizedMatrix, weightedMatrix, idealPositive, idealNegative, distances, rankings } = topsisResult;

  const distMap = new Map<number, { dPlus: number; dMinus: number }>();
  distances.forEach((d) => distMap.set(d.kabupatenId, d));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Komputasi Jarak Ideal</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Compass className="w-6 h-6 text-aurora" />
            Modul Perhitungan TOPSIS Transparan
          </h1>
          <p className="text-xs text-silver mt-1">Tahapan perhitungan Similarity to Ideal Solution berbasis bobot AHP Saaty</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#002422] border border-teal-500/40 px-3 py-1.5 rounded-md text-xs">
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

          <button onClick={() => setActiveTab('ranking')} className="btn-aurora inline-flex items-center gap-1.5 px-3.5 py-2 text-xs">
            <span>Hasil Ranking Final</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-deep rounded-buttons text-xs border border-white/[0.08]">
        <button
          onClick={() => setTab('matrix')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'matrix' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          1. Matriks Keputusan (X)
        </button>
        <button
          onClick={() => setTab('normalized')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'normalized' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          2. Normalisasi (R)
        </button>
        <button
          onClick={() => setTab('weighted')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'weighted' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          3. Matriks Terbobot (Y)
        </button>
        <button
          onClick={() => setTab('ideal')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'ideal' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          4. Solusi Ideal (A+ / A-)
        </button>
        <button
          onClick={() => setTab('distance')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'distance' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          5. Jarak Ideal (D+ / D-)
        </button>
        <button
          onClick={() => setTab('preference')}
          className={`px-3 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'preference' ? 'bg-kelp text-platinum border border-white/[0.12]' : 'text-silver hover:text-platinum'}`}
        >
          6. Preferensi (Vi) & Ranking
        </button>
      </div>

      {/* Tahap 1: Matriks Keputusan */}
      {activeTab === 'matrix' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Tahap 1</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Matriks Keputusan (X)</h3>
            <p className="text-xs text-silver">Matriks 35 daerah × 6 kriteria dari data empiris tahun {selectedYear}</p>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left border-separate border-spacing-0">
              <thead className="bg-deep text-silver font-medium border-b border-white/[0.08]">
                <tr>
                  <th className="sticky left-0 z-30 bg-deep p-3 text-center w-12 border border-white/[0.08]">No</th>
                  <th className="sticky left-12 z-20 bg-deep p-3 border border-white/[0.08] min-w-[200px]">Kabupaten / Kota</th>
                  {kriteria.map((c) => (
                    <th key={c.id} className="p-3 text-center border border-white/[0.08] min-w-[90px]">
                      <div className="font-mono font-bold text-aurora">{c.id}</div>
                      <div className="text-[10px] text-silver/60 uppercase">{c.atribut}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {decisionMatrix.map((row, idx) => (
                  <tr key={row.kabupatenId} className="hover:bg-deep/40 transition-colors">
                    <td className="sticky left-0 z-20 bg-[#003734] p-2.5 text-center font-mono text-silver/60 border border-white/[0.08]">{idx + 1}</td>
                    <td className="sticky left-12 z-10 bg-[#003734] p-2.5 font-medium text-platinum border border-white/[0.08]">{row.nama}</td>
                    {kriteria.map((c) => (
                      <td key={c.id} className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">
                        {Number(row.values[c.id]).toLocaleString('id-ID')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tahap 2: Normalisasi Matriks R */}
      {activeTab === 'normalized' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Tahap 2</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Matriks Normalisasi (R)</h3>
            <p className="text-xs text-silver">
              Formula matematis: <code>Rij = Xij / √[ Σ (Xkj)² ]</code>
            </p>
          </div>

          <div className="card-deep p-4">
            <span className="section-label text-aurora">Nilai Pembagi Euclidean (√ΣX² per kriteria):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
              {kriteria.map((c) => (
                <div key={c.id} className="bg-abyss p-2 rounded-buttons border border-white/[0.08] text-center">
                  <div className="text-[11px] font-mono font-bold text-aurora">{c.id}</div>
                  <div className="font-mono text-xs text-phosphor">{divisors[c.id]?.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left border-separate border-spacing-0">
              <thead className="bg-deep text-silver font-medium border-b border-white/[0.08]">
                <tr>
                  <th className="sticky left-0 z-30 bg-deep p-3 text-center w-12 border border-white/[0.08]">No</th>
                  <th className="sticky left-12 z-20 bg-deep p-3 border border-white/[0.08] min-w-[200px]">Kabupaten / Kota</th>
                  {kriteria.map((c) => (
                    <th key={c.id} className="p-3 text-center border border-white/[0.08] min-w-[90px]">
                      <div className="font-mono font-bold text-aurora">{c.id}</div>
                      <div className="text-[10px] text-silver/60">R_{c.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {normalizedMatrix.map((row, idx) => (
                  <tr key={row.kabupatenId} className="hover:bg-deep/40 transition-colors">
                    <td className="sticky left-0 z-20 bg-[#003734] p-2.5 text-center font-mono text-silver/60 border border-white/[0.08]">{idx + 1}</td>
                    <td className="sticky left-12 z-10 bg-[#003734] p-2.5 font-medium text-platinum border border-white/[0.08]">{row.nama}</td>
                    {kriteria.map((c) => (
                      <td key={c.id} className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">
                        {row.values[c.id]?.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tahap 3: Matriks Terbobot Y */}
      {activeTab === 'weighted' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Tahap 3</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Matriks Normalisasi Terbobot (Y)</h3>
            <p className="text-xs text-silver">
              Formula matematis: <code>Yij = Wij × Rij</code> (di mana bobot Wij diperoleh dari eigen vector AHP)
            </p>
          </div>

          <div className="card-deep p-4">
            <span className="section-label text-aurora">Bobot AHP Kriteria (W):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
              {kriteria.map((c) => (
                <div key={c.id} className="bg-abyss p-2 rounded-buttons border border-white/[0.08] text-center">
                  <div className="text-[11px] font-mono font-bold text-aurora">{c.id}</div>
                  <div className="font-mono text-xs text-phosphor">{(ahpResult.weights[c.id] || 0).toFixed(4)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left border-separate border-spacing-0">
              <thead className="bg-deep text-silver font-medium border-b border-white/[0.08]">
                <tr>
                  <th className="sticky left-0 z-30 bg-deep p-3 text-center w-12 border border-white/[0.08]">No</th>
                  <th className="sticky left-12 z-20 bg-deep p-3 border border-white/[0.08] min-w-[200px]">Kabupaten / Kota</th>
                  {kriteria.map((c) => (
                    <th key={c.id} className="p-3 text-center border border-white/[0.08] min-w-[90px]">
                      <div className="font-mono font-bold text-aurora">{c.id}</div>
                      <div className="text-[10px] text-silver/60">Y_{c.id}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {weightedMatrix.map((row, idx) => (
                  <tr key={row.kabupatenId} className="hover:bg-deep/40 transition-colors">
                    <td className="sticky left-0 z-20 bg-[#003734] p-2.5 text-center font-mono text-silver/60 border border-white/[0.08]">{idx + 1}</td>
                    <td className="sticky left-12 z-10 bg-[#003734] p-2.5 font-medium text-platinum border border-white/[0.08]">{row.nama}</td>
                    {kriteria.map((c) => (
                      <td key={c.id} className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">
                        {row.values[c.id]?.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tahap 4: Solusi Ideal Positif (A+) & Negatif (A-) */}
      {activeTab === 'ideal' && (
        <div className="card-kelp p-6 space-y-6">
          <div>
            <span className="section-label">Tahap 4 & 5</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)</h3>
            <p className="text-xs text-silver">Penentuan nilai ekstrem berdasarkan sifat kriteria (Benefit vs Cost)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* A+ */}
            <div className="card-deep p-5 border border-teal-500/40">
              <div className="flex items-center gap-2 mb-1 text-teal-300 font-medium text-sm">
                <TrendingUp className="w-4 h-4" />
                Solusi Ideal Positif (A+)
              </div>
              <p className="text-xs text-silver leading-relaxed mb-4">Benefit = Max(Yij) &bull; Cost = Min(Yij)</p>
              <div className="space-y-2">
                {kriteria.map((c) => (
                  <div key={c.id} className="bg-abyss p-2.5 rounded-buttons border border-white/[0.08] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-teal-300 mr-2">{c.id}</span>
                      <span className="text-platinum">{c.nama}</span>
                      <span className="ml-2 text-[10px] text-silver/60 uppercase">({c.atribut})</span>
                    </div>
                    <span className="font-mono font-bold text-teal-300">{idealPositive[c.id]?.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* A- */}
            <div className="card-deep p-5 border border-rose-500/40">
              <div className="flex items-center gap-2 mb-1 text-rose-300 font-medium text-sm">
                <TrendingDown className="w-4 h-4" />
                Solusi Ideal Negatif (A-)
              </div>
              <p className="text-xs text-silver leading-relaxed mb-4">Benefit = Min(Yij) &bull; Cost = Max(Yij)</p>
              <div className="space-y-2">
                {kriteria.map((c) => (
                  <div key={c.id} className="bg-abyss p-2.5 rounded-buttons border border-white/[0.08] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-rose-300 mr-2">{c.id}</span>
                      <span className="text-platinum">{c.nama}</span>
                      <span className="ml-2 text-[10px] text-silver/60 uppercase">({c.atribut})</span>
                    </div>
                    <span className="font-mono font-bold text-rose-300">{idealNegative[c.id]?.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tahap 5: Jarak Solusi Ideal D+ & D- */}
      {activeTab === 'distance' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Tahap 6</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Jarak ke Solusi Ideal (D+ dan D-)</h3>
            <p className="text-xs text-silver">Jarak Euclidean daerah terhadap solusi ideal positif (D+) dan solusi ideal negatif (D-)</p>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left border-separate border-spacing-0">
              <thead className="bg-deep text-silver font-medium border-b border-white/[0.08]">
                <tr>
                  <th className="sticky left-0 z-30 bg-deep p-3 text-center w-12 border border-white/[0.08]">No</th>
                  <th className="sticky left-12 z-20 bg-deep p-3 border border-white/[0.08] min-w-[220px]">Kabupaten / Kota</th>
                  <th className="p-3 text-center border border-white/[0.08]">Jarak Positif (D+)</th>
                  <th className="p-3 text-center border border-white/[0.08]">Jarak Negatif (D-)</th>
                  <th className="p-3 text-center border border-white/[0.08]">Total Jarak (D+ + D-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {decisionMatrix.map((item, idx) => {
                  const dist = distMap.get(item.kabupatenId) || { dPlus: 0, dMinus: 0 };
                  return (
                    <tr key={item.kabupatenId} className="hover:bg-deep/40 transition-colors">
                      <td className="sticky left-0 z-20 bg-[#003734] p-2.5 text-center font-mono text-silver/60 border border-white/[0.08]">{idx + 1}</td>
                      <td className="sticky left-12 z-10 bg-[#003734] p-2.5 font-medium text-platinum border border-white/[0.08]">{item.nama}</td>
                      <td className="p-2.5 text-center font-mono font-medium text-teal-300 border border-white/[0.08]">{dist.dPlus.toFixed(4)}</td>
                      <td className="p-2.5 text-center font-mono font-medium text-rose-300 border border-white/[0.08]">{dist.dMinus.toFixed(4)}</td>
                      <td className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">{(dist.dPlus + dist.dMinus).toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tahap 6: Nilai Preferensi Vi & Ranking */}
      {activeTab === 'preference' && (
        <div className="card-kelp p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="section-label">Tahap 7 & 8</span>
              <h3 className="text-base font-medium text-platinum mt-0.5">Nilai Preferensi (Vi) dan Perangkingan</h3>
              <p className="text-xs text-silver">
                Formula matematis: <code>Vi = D- / (D+ + D-)</code> (Daerah dengan nilai Vi tertinggi menjadi prioritas utama)
              </p>
            </div>
            <button onClick={() => setActiveTab('ranking')} className="text-xs text-aurora font-medium hover:underline">
              Lihat Tampilan Kartu & Ekspor Laporan &rarr;
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left border-separate border-spacing-0">
              <thead className="bg-deep text-silver font-medium border-b border-white/[0.08]">
                <tr>
                  <th className="sticky left-0 z-30 bg-deep p-3 text-center w-[56px] min-w-[56px] max-w-[56px] border border-white/[0.08]">Rank</th>
                  <th className="sticky left-[56px] z-20 bg-deep p-3 w-[112px] min-w-[112px] max-w-[112px] border border-white/[0.08]">Kode BPS</th>
                  <th className="sticky left-[168px] z-10 bg-deep p-3 border border-white/[0.08] min-w-[200px]">Kabupaten / Kota</th>
                  <th className="p-3 text-center border border-white/[0.08]">D+</th>
                  <th className="p-3 text-center border border-white/[0.08]">D-</th>
                  <th className="p-3 text-center border border-white/[0.08]">Preferensi (Vi)</th>
                  <th className="p-3 min-w-[140px] text-center border border-white/[0.08]">Kategori Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {rankings.map((r) => {
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
                      <td className="sticky left-0 z-20 bg-[#003734] p-2.5 text-center font-bold w-[56px] min-w-[56px] max-w-[56px] border border-white/[0.08]">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-buttons text-xs font-mono ${rankBadge}`}>{r.rank}</span>
                      </td>
                      <td className="sticky left-[56px] z-10 bg-[#003734] p-2.5 font-mono text-silver w-[112px] min-w-[112px] max-w-[112px] border border-white/[0.08]">{r.kode}</td>
                      <td className="sticky left-[168px] z-10 bg-[#003734] p-2.5 font-medium text-platinum border border-white/[0.08]">{r.nama}</td>
                      <td className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">{r.dPlus.toFixed(4)}</td>
                      <td className="p-2.5 text-center font-mono text-silver border border-white/[0.08]">{r.dMinus.toFixed(4)}</td>
                      <td className="p-2.5 text-center font-mono font-medium text-aurora border border-white/[0.08]">{r.preferenceScore.toFixed(4)}</td>
                      <td className="p-2.5 min-w-[140px] text-center border border-white/[0.08]">
                        <span className={`inline-flex min-w-[110px] justify-center px-2.5 py-0.5 rounded-buttons text-[10px] font-medium border whitespace-nowrap ${catBadge}`}>{r.priorityCategory}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
