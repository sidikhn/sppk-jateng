import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Sliders, Table, Trophy, TrendingUp, AlertCircle, Sparkles, PieChart as PieChartIcon, BarChart2, Radar as RadarIcon, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

export const DashboardView: React.FC = () => {
  const { kabupaten, kriteria, dataset, selectedYear, ahpResult, topsisResult, setActiveTab } = useApp();

  const [radarKab1, setRadarKab1] = useState<number>(() => {
    return topsisResult.rankings[0]?.kabupatenId || 1;
  });
  const [radarKab2, setRadarKab2] = useState<number>(() => {
    return topsisResult.rankings[1]?.kabupatenId || 2;
  });

  const countYearDataset = dataset.filter((d) => d.tahun === selectedYear).length;
  const top10 = topsisResult.rankings.slice(0, 10);

  // Top 10 Bar Chart Data
  const barData = top10.map((item) => ({
    name: item.nama.replace('Kabupaten ', 'Kab. ').replace('Kota ', 'Kota '),
    score: Number(item.preferenceScore.toFixed(4)),
    category: item.priorityCategory,
    rank: item.rank,
  }));

  // Semantic Pie Chart Colors:
  // Benefit criteria: Cyan-Teal hues (indikator kondisi stunting/kemiskinan)
  // Cost criteria: Amber-Rose hues (indikator kekurangan fasilitas kesehatan/sanitasi)
  const semanticColors: Record<string, string> = {
    C1: '#00827c', // Prevalensi Stunting
    C2: '#14b8a6', // Jumlah Balita Stunting
    C3: '#3ee0d6', // Penduduk Miskin
    C4: '#f59e0b', // Sanitasi Layak (Cost)
    C5: '#f97316', // Air Minum Layak (Cost)
    C6: '#ef4444', // Tenaga Kesehatan (Cost)
  };

  const pieData = ahpResult.weightsList.map((w, idx) => ({
    name: `${w.id} - ${w.name}`,
    shortName: w.id,
    value: Number(w.weight.toFixed(4)),
    percentage: w.percentage,
    color: semanticColors[w.id] || ['#00827c', '#14b8a6', '#f59e0b', '#f97316', '#ef4444', '#8df6f0'][idx % 6],
  }));

  // Area Chart Data
  const areaData = topsisResult.rankings.map((r, index) => ({
    rank: index + 1,
    name: r.nama.replace('Kabupaten ', 'Kab. ').replace('Kota ', ''),
    score: Number(r.preferenceScore.toFixed(4)),
  }));

  // Radar Chart Data
  const selectedKab1Item = topsisResult.rankings.find((r) => r.kabupatenId === radarKab1);
  const selectedKab2Item = topsisResult.rankings.find((r) => r.kabupatenId === radarKab2);

  const radarData = kriteria.map((c) => {
    const rawVal1 = selectedKab1Item?.rawValues[c.id] ?? 0;
    const rawVal2 = selectedKab2Item?.rawValues[c.id] ?? 0;

    const allVals = topsisResult.rankings.map((r) => r.rawValues[c.id] || 0);
    const maxVal = Math.max(...allVals, 1);

    return {
      indicator: c.id,
      name: c.nama,
      [selectedKab1Item?.nama || 'Daerah 1']: Number(((rawVal1 / maxVal) * 100).toFixed(1)),
      [selectedKab2Item?.nama || 'Daerah 2']: Number(((rawVal2 / maxVal) * 100).toFixed(1)),
    };
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-cards bg-deep border border-white/[0.08] p-6 md:p-8">
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-80 h-80 rounded-full bg-[#00827c]/20 blur-[90px] pointer-events-none" />
        <div className="absolute top-1/4 right-32 w-48 h-48 rounded-full bg-[#cbfffc]/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-buttons bg-kelp/80 border border-white/[0.08] text-[10px] font-medium tracking-[0.12em] uppercase text-aurora mb-3">
            <Sparkles className="w-3 h-3 text-aurora" />
            SISTEM PENDUKUNG KEPUTUSAN &bull; JAWA TENGAH
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-platinum leading-[1.15]">Prioritas Penanganan Stunting Kabupaten/Kota Tahun {selectedYear}</h1>
          <p className="mt-3 text-xs md:text-sm text-silver leading-relaxed max-w-2xl">
            Sistem pendukung keputusan analitis dengan pembobotan kriteria konsisten <strong>AHP</strong> dan perankingan jarak ideal <strong>TOPSIS</strong> pada 35 Kabupaten/Kota di Jawa Tengah.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={() => setActiveTab('ranking')} className="btn-aurora px-5 py-2.5 text-xs inline-flex items-center gap-2 shadow-[0_0_20px_rgba(203,255,252,0.2)]">
              <span>Buka Ranking Lengkap</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button onClick={() => setActiveTab('ahp')} className="px-4 py-2.5 rounded-buttons bg-kelp text-platinum hover:bg-kelp/80 border border-white/[0.08] text-xs font-normal transition-colors">
              Kustomisasi Matriks AHP
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Kabupaten */}
        <div className="card-kelp p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="section-label">Alternatif Wilayah</span>
            <div className="w-8 h-8 rounded-buttons bg-deep/80 text-aurora flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-medium tracking-tight text-phosphor">{kabupaten.length}</h3>
            <p className="text-[11px] text-silver mt-1">Kabupaten & Kota se-Jateng</p>
          </div>
        </div>

        {/* Card 2: Kriteria */}
        <div className="card-kelp p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="section-label">Kriteria Penilaian</span>
            <div className="w-8 h-8 rounded-buttons bg-deep/80 text-aurora flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-medium tracking-tight text-phosphor">{kriteria.length}</h3>
            <p className="text-[11px] text-silver mt-1">Benefit & Cost Terintegrasi</p>
          </div>
        </div>

        {/* Card 3: Total Dataset */}
        <div className="card-kelp p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="section-label">Dataset Indikator {selectedYear}</span>
            <div className="w-8 h-8 rounded-buttons bg-deep/80 text-aurora flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-medium tracking-tight text-phosphor">{countYearDataset}</h3>
            <p className="text-[11px] text-silver mt-1">Total {dataset.length} entri rekaman</p>
          </div>
        </div>

        {/* Card 4: Konsistensi AHP */}
        <div className="card-kelp p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="section-label">Konsistensi AHP (CR)</span>
            <div className={`w-8 h-8 rounded-buttons flex items-center justify-center ${ahpResult.isConsistent ? 'bg-deep/80 text-aurora' : 'bg-rose-950/80 text-rose-400'}`}>
              {ahpResult.isConsistent ? <span className="w-2.5 h-2.5 rounded-full bg-aurora"></span> : <AlertCircle className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-medium tracking-tight text-phosphor">{(ahpResult.cr * 100).toFixed(1)}%</h3>
            <p className="text-[11px] text-silver mt-1">{ahpResult.isConsistent ? 'Status Matriks: Konsisten (CR ≤ 10%)' : 'Status: Perlu Penyesuaian (CR > 10%)'}</p>
          </div>
        </div>
      </div>

      {/* Charts Section: Row 1 (Bar Chart Top 10 + Pie Chart Bobot AHP) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 10 Prioritas Stunting Bar Chart */}
        <div className="lg:col-span-2 card-kelp p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="section-label">Peringkat Urgensi Intervensi</span>
                <h2 className="text-base font-medium text-platinum flex items-center gap-2 mt-0.5">
                  <BarChart2 className="w-4 h-4 text-aurora" />
                  Top 10 Kabupaten/Kota Prioritas Stunting ({selectedYear})
                </h2>
              </div>
              <button onClick={() => setActiveTab('ranking')} className="text-xs text-aurora hover:underline font-normal">
                Semua {topsisResult.rankings.length} Daerah &rarr;
              </button>
            </div>

            <div className="h-80 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 35, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11, fill: '#bbc7c6' }} />
                  <YAxis dataKey="name" type="category" width={125} tick={{ fontSize: 11, fill: '#bbc7c6' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}`, 'Skor TOPSIS (Vi)']}
                    contentStyle={{
                      backgroundColor: '#002523',
                      borderRadius: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.4)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    }}
                    itemStyle={{ color: '#ffffff', fontWeight: 500, fontSize: '12px' }}
                    labelStyle={{ color: '#2dd4bf', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => {
                      // Semantic urgency coloring:
                      let fill = '#14b8a6'; // Prioritas terkendali
                      if (index === 0)
                        fill = '#ef4444'; // Peringkat 1: Merah (Urgensi Tertinggi)
                      else if (index === 1)
                        fill = '#f97316'; // Peringkat 2: Oranye (Urgensi Sangat Tinggi)
                      else if (index === 2) fill = '#eab308'; // Peringkat 3: Kuning-Emas (Urgensi Tinggi)
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meaningful color legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-silver">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-platinum">Peringkat 1 (Sangat Kritis)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
              <span className="text-platinum">Peringkat 2 (Kritis)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
              <span className="text-platinum">Peringkat 3 (Tinggi)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" />
              <span>Peringkat 4–10 (Terkendali)</span>
            </div>
          </div>
        </div>

        {/* Pie Chart: Bobot AHP Kriteria */}
        <div className="card-kelp p-6 flex flex-col justify-between">
          <div>
            <span className="section-label">Pembobotan Kriteria</span>
            <h2 className="text-base font-medium text-platinum flex items-center gap-2 mt-0.5">
              <PieChartIcon className="w-4 h-4 text-aurora" />
              Bobot AHP Kriteria
            </h2>
          </div>

          <div className="h-52 w-full relative my-2 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
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

          <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
            {pieData.map((item) => (
              <div key={item.shortName} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-silver font-normal">
                    {item.shortName} - {kriteria.find((c) => c.id === item.shortName)?.nama}
                  </span>
                </span>
                <span className="font-mono font-medium text-platinum">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section: Row 2 (Area Chart & Radar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Sebaran Nilai TOPSIS */}
        <div className="card-kelp p-6">
          <div className="mb-4">
            <span className="section-label">Spektrum Preferensi</span>
            <h2 className="text-base font-medium text-platinum flex items-center gap-2 mt-0.5">
              <TrendingUp className="w-4 h-4 text-aurora" />
              Distribusi Nilai Preferensi TOPSIS (35 Wilayah)
            </h2>
          </div>

          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="topsisScoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00827c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00827c" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="rank" tick={{ fontSize: 11, fill: '#bbc7c6' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#bbc7c6' }} />
                <Tooltip
                  formatter={(val: any, name: any, props: any) => [`${val} (Rank #${props.payload.rank})`, props.payload.name]}
                  contentStyle={{
                    backgroundColor: '#002523',
                    borderRadius: '8px',
                    border: '1px solid rgba(20, 184, 166, 0.4)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 500, fontSize: '12px' }}
                  labelStyle={{ color: '#2dd4bf', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#cbfffc" strokeWidth={2} fillOpacity={1} fill="url(#topsisScoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart: Perbandingan Indikator Antar Daerah */}
        <div className="card-kelp p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="section-label">Komparasi Radar</span>
              <h2 className="text-base font-medium text-platinum flex items-center gap-2 mt-0.5">
                <RadarIcon className="w-4 h-4 text-aurora" />
                Perbandingan Indikator Dua Daerah
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={radarKab1}
                onChange={(e) => setRadarKab1(Number(e.target.value))}
                className="text-xs bg-[#012220] border border-teal-500/50 rounded-md px-3 py-1.5 text-teal-200 font-medium min-w-[140px] cursor-pointer focus:ring-1 focus:ring-teal-400"
              >
                {kabupaten.map((k) => (
                  <option key={k.id} value={k.id} className="bg-[#012220] text-white">
                    {k.nama.replace('Kabupaten ', 'Kab. ')}
                  </option>
                ))}
              </select>
              <span className="text-xs text-silver font-semibold">vs</span>
              <select
                value={radarKab2}
                onChange={(e) => setRadarKab2(Number(e.target.value))}
                className="text-xs bg-[#012220] border border-orange-500/50 rounded-md px-3 py-1.5 text-orange-200 font-medium min-w-[140px] cursor-pointer focus:ring-1 focus:ring-orange-400"
              >
                {kabupaten.map((k) => (
                  <option key={k.id} value={k.id} className="bg-[#012220] text-white">
                    {k.nama.replace('Kabupaten ', 'Kab. ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 11, fill: '#bbc7c6' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#707777' }} />
                <Radar name={selectedKab1Item?.nama || 'Daerah 1'} dataKey={selectedKab1Item?.nama || 'Daerah 1'} stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                <Radar name={selectedKab2Item?.nama || 'Daerah 2'} dataKey={selectedKab2Item?.nama || 'Daerah 2'} stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#bbc7c6' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#002523',
                    borderRadius: '8px',
                    border: '1px solid rgba(20, 184, 166, 0.4)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 500, fontSize: '12px' }}
                  labelStyle={{ color: '#2dd4bf', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Top 5 Priority Table with Clean Styling */}
      <div className="card-kelp p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="section-label">Ringkasan Eksekutif</span>
            <h2 className="text-base font-medium text-platinum flex items-center gap-2 mt-0.5">
              <Trophy className="w-4 h-4 text-phosphor" />
              Top 5 Wilayah Prioritas Tertinggi ({selectedYear})
            </h2>
          </div>
          <button onClick={() => setActiveTab('ranking')} className="text-xs text-aurora hover:underline font-normal">
            Lihat Tabel Lengkap &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-deep/70 text-silver uppercase tracking-[0.08em] font-medium border-b border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Kode BPS</th>
                <th className="py-2.5 px-3">Kabupaten / Kota</th>
                <th className="py-2.5 px-3 text-center">Prevalensi (C1)</th>
                <th className="py-2.5 px-3 text-center">Balita Stunting (C2)</th>
                <th className="py-2.5 px-3 text-center">Nilai TOPSIS (Vi)</th>
                <th className="py-2.5 px-3 min-w-[140px] text-center">Prioritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {top10.slice(0, 5).map((row) => {
                let badgeClass = 'bg-teal-500/15 text-teal-300 border border-teal-500/30';
                let rankBadge = 'bg-deep text-silver border border-white/[0.08]';

                if (row.rank === 1) {
                  rankBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold';
                  badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold';
                } else if (row.rank === 2) {
                  rankBadge = 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold';
                  badgeClass = 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold';
                } else if (row.rank === 3) {
                  rankBadge = 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold';
                  badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
                }

                return (
                  <tr key={row.kabupatenId} className="hover:bg-deep/40 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-buttons text-xs ${rankBadge}`}>{row.rank}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-silver">{row.kode}</td>
                    <td className="py-2.5 px-3 font-medium text-platinum">{row.nama}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-phosphor">{row.rawValues['C1']}%</td>
                    <td className="py-2.5 px-3 text-center font-mono text-silver">{Number(row.rawValues['C2']).toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium text-aurora">{row.preferenceScore.toFixed(4)}</td>
                    <td className="py-2.5 px-3 min-w-[140px] text-center">
                      <span className={`inline-flex min-w-[110px] justify-center whitespace-nowrap px-2.5 py-0.5 rounded-buttons text-[10px] ${badgeClass}`}>{row.priorityCategory}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
