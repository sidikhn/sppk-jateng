import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, RotateCcw, Activity, CheckCircle2, AlertTriangle, Calendar, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, selectedYear, setSelectedYear, availableYears, ahpResult, resetAllData } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-8 bg-deep/90 backdrop-blur-md border-b border-white/[0.08] transition-colors w-full">
        <div className="flex items-center gap-3">
          {/* Bioluminescent Orb Icon */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00827c] to-[#cbfffc] flex items-center justify-center text-abyss font-bold shadow-[0_0_15px_rgba(203,255,252,0.3)]">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-base md:text-lg text-platinum tracking-[-0.03em]">DSS Stunting Jawa Tengah</span>
            </div>
            <p className="text-[11px] text-silver hidden md:block tracking-normal">Sistem Pendukung Keputusan Prioritas Daerah Berbasis Data Multikriteria</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* AHP Consistency Badge */}
          <div
            title={`Consistency Ratio (CR): ${(ahpResult.cr * 100).toFixed(2)}%`}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border shadow-xs transition-colors ${
              ahpResult.isConsistent ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${ahpResult.isConsistent ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-rose-400'}`} />
            <span>{ahpResult.isConsistent ? `CR ${(ahpResult.cr * 100).toFixed(1)}% • Konsisten` : `CR ${(ahpResult.cr * 100).toFixed(1)}% • Perlu Revisi`}</span>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-[#002422] px-3 py-1.5 rounded-md border border-teal-500/40 hover:border-teal-400/80 text-xs transition-all shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
            <span className="text-slate-300 font-medium hidden sm:inline">Tahun:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} aria-label="Pilih tahun analisis" className="bg-[#002422] text-white font-semibold focus:outline-none cursor-pointer pr-1">
              {availableYears.map((yr) => (
                <option key={yr} value={yr} className="bg-[#002422] text-white font-medium">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-silver hover:text-rose-400 hover:bg-rose-950/30 rounded-buttons border border-transparent hover:border-rose-900/50 transition-colors"
            title="Reset ke Data Default Jawa Tengah"
            aria-label="Reset database"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-abyss/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-deep rounded-cards max-w-md w-full p-6 shadow-2xl border border-white/[0.12]">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-center text-platinum">Reset Semua Data?</h3>
            <p className="text-xs text-silver text-center mt-2 leading-relaxed">Tindakan ini akan mengembalikan data 35 Kabupaten/Kota Jawa Tengah, kriteria penilaian, dan matriks perbandingan ke kondisi awal bawaan.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 px-4 rounded-buttons border border-white/[0.12] text-silver hover:text-platinum hover:bg-kelp/40 text-xs font-medium transition-colors">
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-buttons bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
