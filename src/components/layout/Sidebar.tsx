import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { LayoutDashboard, Database, Building2, Sliders, Table, Scale, Compass, Trophy, FileSpreadsheet, ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, ahpSubTab, setAhpSubTab, topsisSubTab, setTopsisSubTab, sidebarOpen, setSidebarOpen, kabupaten, kriteria, dataset, selectedYear } = useApp();

  const [masterExpanded, setMasterExpanded] = useState(true);
  const [ahpExpanded, setAhpExpanded] = useState(true);
  const [topsisExpanded, setTopsisExpanded] = useState(true);
  const [reportsExpanded, setReportsExpanded] = useState(true);

  const handleNav = (tab: NavigationTab, subTab?: string) => {
    setActiveTab(tab);
    if (tab === 'ahp' && subTab) {
      setAhpSubTab(subTab);
    }
    if (tab === 'topsis' && subTab) {
      setTopsisSubTab(subTab);
    }
    // Only auto-close on mobile/tablet view (< 1024px)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const countYearDataset = dataset.filter((d) => d.tahun === selectedYear).length;

  return (
    <>
      {/* Mobile Backdrop Overlay (only below lg) */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer" />}

      {/* Floating Toggle Arrow saat Sidebar Ditutup (Tepi kiri layar) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[70] w-7 h-10 rounded-r-full bg-[#003734] border border-l-0 border-teal-400/50 text-teal-300 hover:text-white hover:bg-teal-600 flex items-center justify-center shadow-[2px_0_12px_rgba(0,130,124,0.4)] transition-all cursor-pointer group"
          title="Tampilkan Menu Navigasi"
          aria-label="Tampilkan Menu Navigasi"
        >
          <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Sidebar Container:
          - On Desktop (lg): Sticky side panel alongside content. When open, it sits side-by-side (does not cover). When closed, collapses smoothly.
          - On Mobile (<lg): Off-canvas slide-out drawer.
      */}
      <aside
        className={`bg-[#011d1c] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'w-72 fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] shadow-2xl lg:sticky lg:top-16 lg:self-start lg:z-auto lg:flex-shrink-0 lg:shadow-none'
            : 'w-72 -translate-x-full border-none overflow-hidden opacity-0 pointer-events-none fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:w-0 lg:translate-x-0 lg:self-start lg:z-auto lg:flex-shrink-0'
        }`}
      >
        {/* Tombol Hide Panah di Sisi Kanan Sidebar (Persis seperti referensi ULD UGM: setengah lingkaran/lingkaran dengan icon <<) */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-0 top-[48%] translate-x-1/2 -translate-y-1/2 z-[70] w-8 h-8 rounded-full bg-[#003734] border border-teal-400/60 text-teal-300 hover:text-white hover:bg-teal-600 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
            title="Sembunyikan Menu Navigasi"
            aria-label="Sembunyikan Menu Navigasi"
          >
            <ChevronsLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Scrollable Navigation Items */}
        <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto w-72">
          {/* Main Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'dashboard' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/50 shadow-sm' : 'text-slate-100 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-teal-300" />
            <span>Dashboard</span>
          </button>

          {/* Group 1: Data Master */}
          <div className="pt-2">
            <button onClick={() => setMasterExpanded(!masterExpanded)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300 hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Data Master
              </span>
              {masterExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {masterExpanded && (
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-teal-500/20 ml-3">
                <button
                  onClick={() => handleNav('master-kabupaten')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'master-kabupaten' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-teal-300" />
                    Kabupaten / Kota
                  </span>
                  <span className="text-xs bg-teal-950/90 px-2 py-0.5 rounded font-mono font-semibold text-teal-300 border border-teal-700/60">{kabupaten.length}</span>
                </button>

                <button
                  onClick={() => handleNav('master-kriteria')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'master-kriteria' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-teal-300" />
                    Kriteria Penilaian
                  </span>
                  <span className="text-xs bg-teal-950/90 px-2 py-0.5 rounded font-mono font-semibold text-teal-300 border border-teal-700/60">{kriteria.length}</span>
                </button>

                <button
                  onClick={() => handleNav('master-dataset')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'master-dataset' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Table className="w-3.5 h-3.5 text-teal-300" />
                    Dataset Indikator
                  </span>
                  <span className="text-xs bg-teal-950/90 px-2 py-0.5 rounded font-mono font-semibold text-teal-300 border border-teal-700/60">{countYearDataset}</span>
                </button>
              </div>
            )}
          </div>

          {/* Group 2: Modul AHP */}
          <div className="pt-2">
            <button onClick={() => setAhpExpanded(!ahpExpanded)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300 hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-teal-400" />
                Modul AHP
              </span>
              {ahpExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {ahpExpanded && (
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-teal-500/20 ml-3">
                <button
                  onClick={() => handleNav('ahp', 'matrix')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'ahp' && ahpSubTab === 'matrix' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Matriks Perbandingan
                </button>

                <button
                  onClick={() => handleNav('ahp', 'normalized')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'ahp' && ahpSubTab === 'normalized' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Normalisasi & Jumlah
                </button>

                <button
                  onClick={() => handleNav('ahp', 'eigen')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'ahp' && ahpSubTab === 'eigen' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Eigen Vector
                </button>

                <button
                  onClick={() => handleNav('ahp', 'consistency')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'ahp' && ahpSubTab === 'consistency' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Uji Konsistensi (CR)
                </button>

                <button
                  onClick={() => handleNav('ahp', 'weights')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'ahp' && ahpSubTab === 'weights' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Hasil Bobot & Grafik
                </button>
              </div>
            )}
          </div>

          {/* Group 3: Modul TOPSIS */}
          <div className="pt-2">
            <button onClick={() => setTopsisExpanded(!topsisExpanded)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300 hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                Modul TOPSIS
              </span>
              {topsisExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {topsisExpanded && (
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-teal-500/20 ml-3">
                <button
                  onClick={() => handleNav('topsis', 'matrix')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'matrix' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  1. Matriks Keputusan
                </button>

                <button
                  onClick={() => handleNav('topsis', 'normalized')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'normalized' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  2. Normalisasi (R)
                </button>

                <button
                  onClick={() => handleNav('topsis', 'weighted')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'weighted' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  3. Matriks Terbobot (Y)
                </button>

                <button
                  onClick={() => handleNav('topsis', 'ideal')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'ideal' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  4. Solusi Ideal (A+ / A-)
                </button>

                <button
                  onClick={() => handleNav('topsis', 'distance')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'distance' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  5. Jarak Ideal (D+ / D-)
                </button>

                <button
                  onClick={() => handleNav('topsis', 'preference')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'topsis' && topsisSubTab === 'preference' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  6. Preferensi & Ranking
                </button>
              </div>
            )}
          </div>

          {/* Group 4: Hasil & Ranking */}
          <div className="pt-2">
            <button
              onClick={() => handleNav('ranking')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'ranking' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/50 shadow-sm' : 'text-slate-100 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-amber-300" />
                Hasil Ranking Prioritas
              </span>
            </button>
          </div>

          {/* Group 5: Laporan & Ekspor */}
          <div className="pt-2">
            <button onClick={() => setReportsExpanded(!reportsExpanded)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300 hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                Laporan & Ekspor
              </span>
              {reportsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-300" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {reportsExpanded && (
              <div className="mt-1 space-y-1 pl-3 border-l-2 border-teal-500/20 ml-3">
                <button
                  onClick={() => handleNav('reports')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'reports' ? 'bg-teal-500/25 text-white font-semibold border border-teal-400/40' : 'text-slate-200 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-teal-300" />
                  Pusat Unduhan Laporan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10 bg-[#001716] flex-shrink-0 w-72">
          <div className="rounded-lg p-3 bg-teal-950/60 border border-teal-800/40 text-xs">
            <div className="flex items-center gap-2 text-teal-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              DSS Stunting Jawa Tengah
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">Kombinasi metode AHP & TOPSIS untuk penetapan prioritas intervensi daerah.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
