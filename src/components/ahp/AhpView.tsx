import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, CheckCircle2, AlertTriangle, RotateCcw, Download, Info, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SAATY_SCALE } from '../../utils/ahp';
import { exportAhpToPdf } from '../../utils/pdf';

export const AhpView: React.FC = () => {
  const { kriteria, ahpMatrix, updateAhpCell, resetAhpMatrix, ahpResult, ahpSubTab, setAhpSubTab } = useApp();

  const activeTab = (ahpSubTab as 'matrix' | 'normalized' | 'eigen' | 'consistency' | 'weights') || 'matrix';

  const setTab = (tab: 'matrix' | 'normalized' | 'eigen' | 'consistency' | 'weights') => {
    setAhpSubTab(tab);
  };

  const n = kriteria.length;

  const semanticCriteriaColors: Record<string, string> = {
    C1: '#00827c',
    C2: '#14b8a6',
    C3: '#3ee0d6',
    C4: '#f59e0b',
    C5: '#f97316',
    C6: '#ef4444',
  };

  const fallbackColors = ['#00827c', '#14b8a6', '#f59e0b', '#f97316', '#ef4444', '#8df6f0'];
  const pieData = ahpResult.weightsList.map((w, idx) => ({
    name: `${w.id} - ${w.name}`,
    shortName: w.id,
    value: Number(w.weight.toFixed(4)),
    percentage: w.percentage,
    color: semanticCriteriaColors[w.id] || fallbackColors[idx % fallbackColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-label">Pembobotan Kriteria</span>
          <h1 className="text-2xl font-medium tracking-tight text-platinum flex items-center gap-2.5 mt-0.5">
            <Scale className="w-6 h-6 text-aurora" />
            Modul Analytical Hierarchy Process (AHP)
          </h1>
          <p className="text-xs text-silver mt-1">Penentuan bobot prioritas kriteria menggunakan perbandingan berpasangan skala Saaty (1-9)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAhpToPdf(kriteria, ahpMatrix, ahpResult)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-aurora" />
            <span>Export PDF AHP</span>
          </button>

          <button
            onClick={resetAhpMatrix}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-buttons bg-kelp border border-white/[0.08] text-silver hover:text-platinum text-xs font-normal transition-colors"
            title="Reset Matriks ke 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-silver" />
            <span>Reset Matriks</span>
          </button>
        </div>
      </div>

      {/* Consistency Banner: Abyssal Lifted Surface */}
      <div className={`p-5 rounded-cards border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ahpResult.isConsistent ? 'bg-kelp/90 border-aurora/30 text-platinum' : 'bg-rose-950/60 border-rose-800 text-rose-200'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${ahpResult.isConsistent ? 'bg-aurora shadow-[0_0_8px_rgba(203,255,252,0.6)]' : 'bg-rose-400 animate-pulse'}`} />
          <div>
            <h4 className="font-medium text-sm text-platinum flex items-center gap-2">
              Status Konsistensi Matriks:
              <span className={`text-xs px-2 py-0.5 rounded-buttons font-medium ${ahpResult.isConsistent ? 'bg-deep/80 text-aurora border border-aurora/30' : 'bg-rose-900/60 text-rose-300 border border-rose-700'}`}>
                {ahpResult.isConsistent ? 'Konsisten (CR ≤ 10%)' : 'Perlu Revisi (CR > 10%)'}
              </span>
            </h4>
            <p className="text-xs text-silver mt-1 leading-relaxed">
              {ahpResult.isConsistent
                ? `Rasio Konsistensi (CR) = ${(ahpResult.cr * 100).toFixed(2)}% ≤ 10%. Perbandingan berpasangan logis dan valid digunakan sebagai bobot TOPSIS.`
                : `Rasio Konsistensi (CR) = ${(ahpResult.cr * 100).toFixed(2)}% > 10%. Silakan sesuaikan kembali nilai perbandingan berpasangan agar konsisten.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-deep/90 p-3 rounded-buttons border border-white/[0.08]">
          <div>
            <span className="text-silver">λ max:</span> <strong className="text-aurora">{ahpResult.lambdaMax.toFixed(3)}</strong>
          </div>
          <div>
            <span className="text-silver">CI:</span> <strong className="text-platinum">{ahpResult.ci.toFixed(4)}</strong>
          </div>
          <div>
            <span className="text-silver">CR:</span> <strong className={ahpResult.isConsistent ? 'text-aurora' : 'text-rose-400'}>{(ahpResult.cr * 100).toFixed(2)}%</strong>
          </div>
        </div>
      </div>

      {/* Tabs Steps Navigation: 6px radius buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-deep rounded-buttons text-xs border border-white/[0.08]">
        <button
          onClick={() => setTab('matrix')}
          className={`px-3.5 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'matrix' ? 'bg-kelp text-platinum border border-white/[0.12] shadow-xs' : 'text-silver hover:text-platinum'}`}
        >
          1. Matriks Perbandingan
        </button>
        <button
          onClick={() => setTab('normalized')}
          className={`px-3.5 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'normalized' ? 'bg-kelp text-platinum border border-white/[0.12] shadow-xs' : 'text-silver hover:text-platinum'}`}
        >
          2. Normalisasi & Jumlah Kolom
        </button>
        <button
          onClick={() => setTab('eigen')}
          className={`px-3.5 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'eigen' ? 'bg-kelp text-platinum border border-white/[0.12] shadow-xs' : 'text-silver hover:text-platinum'}`}
        >
          3. Eigen Vector (Bobot)
        </button>
        <button
          onClick={() => setTab('consistency')}
          className={`px-3.5 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'consistency' ? 'bg-kelp text-platinum border border-white/[0.12] shadow-xs' : 'text-silver hover:text-platinum'}`}
        >
          4. Uji Konsistensi
        </button>
        <button
          onClick={() => setTab('weights')}
          className={`px-3.5 py-2 rounded-buttons font-medium transition-all whitespace-nowrap ${activeTab === 'weights' ? 'bg-kelp text-platinum border border-white/[0.12] shadow-xs' : 'text-silver hover:text-platinum'}`}
        >
          5. Ringkasan & Grafik Bobot
        </button>
      </div>

      {/* Tab 1: Matriks Perbandingan & Interactive Saaty Inputs */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="card-kelp p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="section-label">Langkah 1</span>
                <h3 className="text-base font-medium text-platinum mt-0.5">Matriks Perbandingan Berpasangan (Pairwise Comparison)</h3>
                <p className="text-xs text-silver">Ubah nilai perbandingan pada sel di atas diagonal. Nilai resiprokal otomatis dihitung (1/x).</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-silver bg-deep px-3 py-1.5 rounded-buttons border border-white/[0.08]">
                <Info className="w-3.5 h-3.5 text-aurora" />
                <span>Skala Saaty: 1 (Sama) s.d. 9 (Mutlak Penting)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-deep/90 text-silver">
                    <th className="p-3 text-left border border-white/[0.08]">Kriteria</th>
                    {kriteria.map((c) => (
                      <th key={c.id} className="p-3 font-mono font-bold text-aurora border border-white/[0.08] min-w-[90px]" title={c.nama}>
                        {c.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((rowCrit, i) => (
                    <tr key={rowCrit.id} className="hover:bg-deep/40 transition-colors">
                      <td className="p-3 font-medium text-left text-platinum border border-white/[0.08] bg-deep/60">
                        <span className="font-bold text-aurora mr-1.5">{rowCrit.id}</span>
                        <span className="text-silver font-normal">({rowCrit.nama})</span>
                      </td>

                      {kriteria.map((colCrit, j) => {
                        const val = ahpMatrix[i]?.[j] ?? 1;
                        const isDiagonal = i === j;
                        const isUpper = i < j;

                        return (
                          <td key={colCrit.id} className={`p-2 border border-white/[0.08] font-mono ${isDiagonal ? 'bg-deep/80 font-bold text-silver/60' : isUpper ? 'bg-deep/40' : 'bg-deep/20 text-silver'}`}>
                            {isDiagonal ? (
                              <span>1.00</span>
                            ) : isUpper ? (
                              <select
                                value={val}
                                onChange={(e) => updateAhpCell(i, j, parseFloat(e.target.value))}
                                className="w-full bg-abyss border border-white/[0.15] rounded-buttons p-1 font-mono text-aurora focus:outline-none focus:border-aurora cursor-pointer"
                              >
                                {SAATY_SCALE.map((s) => (
                                  <option key={s.value} value={s.value} className="bg-deep text-platinum">
                                    {s.value}
                                  </option>
                                ))}
                                <option value={1 / 2} className="bg-deep text-platinum">
                                  1/2 (0.50)
                                </option>
                                <option value={1 / 3} className="bg-deep text-platinum">
                                  1/3 (0.33)
                                </option>
                                <option value={1 / 4} className="bg-deep text-platinum">
                                  1/4 (0.25)
                                </option>
                                <option value={1 / 5} className="bg-deep text-platinum">
                                  1/5 (0.20)
                                </option>
                                <option value={1 / 6} className="bg-deep text-platinum">
                                  1/6 (0.17)
                                </option>
                                <option value={1 / 7} className="bg-deep text-platinum">
                                  1/7 (0.14)
                                </option>
                                <option value={1 / 8} className="bg-deep text-platinum">
                                  1/8 (0.13)
                                </option>
                                <option value={1 / 9} className="bg-deep text-platinum">
                                  1/9 (0.11)
                                </option>
                              </select>
                            ) : (
                              <span>{val.toFixed(2)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Row Jumlah Kolom */}
                  <tr className="bg-deep/90 font-medium text-aurora">
                    <td className="p-3 text-left border border-white/[0.08]">Jumlah Kolom (Σ)</td>
                    {ahpResult.columnSums.map((sum, j) => (
                      <td key={j} className="p-3 border border-white/[0.08] font-mono text-phosphor">
                        {sum.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Saaty Scale Reference Table */}
          <div className="card-deep p-6">
            <h4 className="section-label mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-aurora" />
              Panduan Skala Perbandingan Saaty (1-9)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">1 - Sama Penting:</span>
                <p className="text-silver mt-1">Kedua kriteria menyumbang pengaruh sama besar.</p>
              </div>
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">3 - Sedikit Lebih Penting:</span>
                <p className="text-silver mt-1">Sedikit memihak pada kriteria ini.</p>
              </div>
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">5 - Jelas Lebih Penting:</span>
                <p className="text-silver mt-1">Kriteria ini terbukti sangat krusial.</p>
              </div>
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">7 - Sangat Jelas Lebih Penting:</span>
                <p className="text-silver mt-1">Kriteria ini sangat dominan pengaruhnya.</p>
              </div>
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">9 - Mutlak Lebih Penting:</span>
                <p className="text-silver mt-1">Tingkat dominasi tertinggi.</p>
              </div>
              <div className="p-3 rounded-buttons bg-abyss border border-white/[0.08]">
                <span className="font-medium text-aurora">2, 4, 6, 8 - Nilai Antara:</span>
                <p className="text-silver mt-1">Nilai kompromi antara dua pertimbangan berdekatan.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Normalisasi Matriks & Jumlah Kolom */}
      {activeTab === 'normalized' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Langkah 2</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Matriks Normalisasi AHP</h3>
            <p className="text-xs text-silver">
              Formula: Setiap sel <code>M[i][j]</code> dibagi dengan total kolom ke-j (<code>Σ Kolom j</code>).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-deep/90 text-silver">
                  <th className="p-3 text-left border border-white/[0.08]">Kriteria</th>
                  {kriteria.map((c) => (
                    <th key={c.id} className="p-3 font-mono font-bold text-aurora border border-white/[0.08]">
                      {c.id}
                    </th>
                  ))}
                  <th className="p-3 font-bold bg-deep text-phosphor border border-white/[0.08]">Jumlah Baris (Σ)</th>
                </tr>
              </thead>
              <tbody>
                {kriteria.map((rowCrit, i) => {
                  const rowSum = (ahpResult.normalizedMatrix[i] || []).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={rowCrit.id} className="hover:bg-deep/40 transition-colors">
                      <td className="p-3 font-medium text-left text-platinum border border-white/[0.08]">
                        {rowCrit.id} ({rowCrit.nama})
                      </td>
                      {(ahpResult.normalizedMatrix[i] || []).map((normVal, j) => (
                        <td key={j} className="p-2 border border-white/[0.08] font-mono text-silver">
                          {normVal.toFixed(4)}
                        </td>
                      ))}
                      <td className="p-2 border border-white/[0.08] font-mono font-medium text-phosphor bg-deep/50">{rowSum.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Eigen Vector (Bobot Kriteria) */}
      {activeTab === 'eigen' && (
        <div className="card-kelp p-6 space-y-4">
          <div>
            <span className="section-label">Langkah 3</span>
            <h3 className="text-base font-medium text-platinum mt-0.5">Perhitungan Eigen Vector (Prioritas Bobot Relatif)</h3>
            <p className="text-xs text-silver">
              Formula: <code>Bobot Wi = (Jumlah Baris Ternormalisasi) / n</code>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-deep/90 text-silver">
                  <th className="p-3 text-center w-14 border border-white/[0.08]">No</th>
                  <th className="p-3 w-28 border border-white/[0.08]">Kode</th>
                  <th className="p-3 border border-white/[0.08]">Nama Indikator</th>
                  <th className="p-3 text-center border border-white/[0.08]">Atribut</th>
                  <th className="p-3 text-center border border-white/[0.08]">Bobot (Wi)</th>
                  <th className="p-3 text-center border border-white/[0.08]">Persentase (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {ahpResult.weightsList.map((item, idx) => {
                  const crit = kriteria.find((c) => c.id === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-deep/40 transition-colors">
                      <td className="p-3 text-center font-mono text-silver/60 border border-white/[0.08]">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-aurora border border-white/[0.08]">{item.id}</td>
                      <td className="p-3 font-medium text-platinum border border-white/[0.08]">{item.name}</td>
                      <td className="p-3 text-center border border-white/[0.08]">
                        <span className="px-2 py-0.5 rounded-buttons text-[10px] uppercase font-mono bg-deep text-silver border border-white/[0.06]">{crit?.atribut}</span>
                      </td>
                      <td className="p-3 text-center font-mono font-medium text-phosphor border border-white/[0.08]">{item.weight.toFixed(4)}</td>
                      <td className="p-3 text-center font-mono font-medium text-aurora border border-white/[0.08]">{item.percentage.toFixed(2)}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-deep/80 font-medium text-platinum">
                  <td colSpan={4} className="p-3 text-right border border-white/[0.08]">
                    Total Bobot (Σ Wi):
                  </td>
                  <td className="p-3 text-center font-mono text-phosphor border border-white/[0.08]">{ahpResult.weightsList.reduce((acc, curr) => acc + curr.weight, 0).toFixed(4)}</td>
                  <td className="p-3 text-center font-mono text-aurora border border-white/[0.08]">100.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Uji Konsistensi (Lambda Max, CI, CR) */}
      {activeTab === 'consistency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-kelp p-6 space-y-4">
            <div>
              <span className="section-label">Langkah 4</span>
              <h3 className="text-base font-medium text-platinum mt-0.5">Detail Uji Konsistensi Logis</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="font-medium text-platinum">Jumlah Kriteria (n)</span>
                  <p className="text-[11px] text-silver">Ordo matriks perbandingan</p>
                </div>
                <span className="font-mono font-bold text-sm text-platinum">{n}</span>
              </div>

              <div className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="font-medium text-platinum">Lambda Max (λ max)</span>
                  <p className="text-[11px] text-silver">Nilai eigen terbesar matriks</p>
                </div>
                <span className="font-mono font-bold text-sm text-aurora">{ahpResult.lambdaMax.toFixed(4)}</span>
              </div>

              <div className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="font-medium text-platinum">Consistency Index (CI)</span>
                  <p className="text-[11px] text-silver">Rumus: (λ max - n) / (n - 1)</p>
                </div>
                <span className="font-mono font-bold text-sm text-platinum">{ahpResult.ci.toFixed(4)}</span>
              </div>

              <div className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="font-medium text-platinum">Random Index (RI)</span>
                  <p className="text-[11px] text-silver">Indeks acak Saaty untuk ordo {n}</p>
                </div>
                <span className="font-mono font-bold text-sm text-platinum">{ahpResult.ri.toFixed(2)}</span>
              </div>

              <div className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="font-medium text-platinum">Consistency Ratio (CR)</span>
                  <p className="text-[11px] text-silver">Rumus: CI / RI (Batas toleransi ≤ 0.10)</p>
                </div>
                <span className={`font-mono font-bold text-sm ${ahpResult.isConsistent ? 'text-aurora' : 'text-rose-400'}`}>
                  {(ahpResult.cr * 100).toFixed(2)}% ({ahpResult.cr.toFixed(4)})
                </span>
              </div>
            </div>
          </div>

          {/* Random Index Saaty Reference */}
          <div className="card-deep p-6 space-y-4">
            <div>
              <span className="section-label">Tabel Acuan Saaty</span>
              <h3 className="text-base font-medium text-platinum mt-0.5">Random Index (RI) Ordo 1 s.d. 10</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-abyss text-silver">
                    <th className="p-2 border border-white/[0.08]">Ordo (n)</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <th key={num} className={`p-2 border border-white/[0.08] ${num === n ? 'bg-kelp text-aurora font-bold' : ''}`}>
                        {num}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-bold border border-white/[0.08] text-silver">RI</td>
                    {[0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49].map((val, idx) => (
                      <td key={idx} className={`p-2 border border-white/[0.08] font-mono ${idx + 1 === n ? 'bg-kelp font-bold text-aurora' : 'text-silver'}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-buttons bg-abyss border border-white/[0.08] text-xs text-silver leading-relaxed mt-4">
              <p className="font-medium text-platinum">Kaidah Evaluasi:</p>
              <p className="mt-1">
                Jika nilai <strong>CR ≤ 0.1 (10%)</strong>, maka derajat inkonsistensi penilaian masih dalam toleransi rasional yang dapat diterima secara ilmiah.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Ringkasan & Grafik Bobot */}
      {activeTab === 'weights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-kelp p-6">
            <span className="section-label">Hasil Pembobotan</span>
            <h3 className="text-base font-medium text-platinum mt-0.5 mb-4">Vektor Bobot Akhir Kriteria</h3>
            <div className="space-y-3">
              {ahpResult.weightsList.map((w, idx) => (
                <div key={w.id} className="p-3 rounded-buttons bg-deep border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: semanticCriteriaColors[w.id] || fallbackColors[idx % fallbackColors.length] }} />
                    <div>
                      <h4 className="font-medium text-xs text-platinum">
                        {w.id} - {w.name}
                      </h4>
                      <p className="text-[10px] text-silver/70 font-mono">Atribut: {kriteria.find((c) => c.id === w.id)?.atribut.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-aurora">{w.percentage.toFixed(2)}%</span>
                    <p className="text-[10px] text-silver/60 font-mono">w = {w.weight.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-kelp p-6 flex flex-col items-center justify-center">
            <span className="section-label self-start">Visualisasi Donut</span>
            <h3 className="text-base font-medium text-platinum mt-0.5 mb-2 self-start">Proporsi Bobot Kriteria</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [`${item.payload.percentage.toFixed(1)}% (Bobot: ${val})`, item.payload.shortName]}
                    contentStyle={{
                      backgroundColor: '#002523',
                      borderRadius: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.4)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    }}
                    itemStyle={{ color: '#ffffff', fontWeight: 500, fontSize: '12px' }}
                    labelStyle={{ color: '#2dd4bf', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
