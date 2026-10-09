import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { KabupatenKota, Kriteria, DatasetIndikator, AhpCalculationResult, TopsisCalculationStep } from '../types';
import { loadAllAppData, saveAllAppData, resetData, STORAGE_KEYS, saveData, loadData } from '../utils/storage';
import { calculateAhp, createDefaultAhpMatrix } from '../utils/ahp';
import { calculateTopsis } from '../utils/topsis';

export type NavigationTab = 'dashboard' | 'master-kabupaten' | 'master-kriteria' | 'master-dataset' | 'ahp' | 'topsis' | 'ranking' | 'reports';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & UI
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  ahpSubTab: string;
  setAhpSubTab: (subTab: string) => void;
  topsisSubTab: string;
  setTopsisSubTab: (subTab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data
  kabupaten: KabupatenKota[];
  kriteria: Kriteria[];
  dataset: DatasetIndikator[];
  ahpMatrix: number[][];
  selectedYear: number;
  availableYears: number[];

  // Computed Engine Results
  ahpResult: AhpCalculationResult;
  topsisResult: TopsisCalculationStep;

  // Kabupaten Actions
  addKabupaten: (kab: Omit<KabupatenKota, 'id'>) => void;
  updateKabupaten: (kab: KabupatenKota) => void;
  deleteKabupaten: (id: number) => void;
  batchSetKabupaten: (list: KabupatenKota[]) => void;

  // Kriteria Actions
  addKriteria: (crit: Kriteria) => void;
  updateKriteria: (crit: Kriteria) => void;
  deleteKriteria: (id: string) => void;

  // Dataset Actions
  addDatasetItem: (item: DatasetIndikator) => void;
  updateDatasetItem: (item: DatasetIndikator) => void;
  deleteDatasetItem: (kabupatenId: number, tahun: number) => void;
  batchSetDataset: (items: DatasetIndikator[]) => void;
  setSelectedYear: (year: number) => void;

  // AHP Matrix Actions
  updateAhpCell: (i: number, j: number, value: number) => void;
  resetAhpMatrix: () => void;

  // System Actions
  resetAllData: () => void;

  // Notification Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialData] = useState(() => loadAllAppData());

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [ahpSubTab, setAhpSubTab] = useState<string>('matrix');
  const [topsisSubTab, setTopsisSubTab] = useState<string>('preference');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => window.matchMedia('(min-width: 1024px)').matches);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return loadData<boolean>(STORAGE_KEYS.THEME, false);
  });

  // State
  const [kabupaten, setKabupaten] = useState<KabupatenKota[]>(initialData.kabupaten);
  const [kriteria, setKriteria] = useState<Kriteria[]>(initialData.kriteria);
  const [dataset, setDataset] = useState<DatasetIndikator[]>(initialData.dataset);
  const [ahpMatrix, setAhpMatrix] = useState<number[][]>(initialData.ahpMatrix);
  const [selectedYear, setSelectedYearState] = useState<number>(initialData.selectedYear);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveData(STORAGE_KEYS.THEME, isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    saveAllAppData({
      kabupaten,
      kriteria,
      dataset,
      ahpMatrix,
      selectedYear,
    });
  }, [kabupaten, kriteria, dataset, ahpMatrix, selectedYear]);

  // Available Years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(dataset.map((d) => d.tahun))).sort((a, b) => b - a);
    return years.length > 0 ? years : [2025];
  }, [dataset]);

  // Set selected year
  const setSelectedYear = useCallback((year: number) => {
    setSelectedYearState(year);
  }, []);

  // Synchronize AHP Matrix size if Criteria length changed
  useEffect(() => {
    const n = kriteria.length;
    if (ahpMatrix.length !== n || (ahpMatrix[0] && ahpMatrix[0].length !== n)) {
      const newMat = createDefaultAhpMatrix(n);
      setAhpMatrix(newMat);
    }
  }, [kriteria]);

  // Compute AHP Result
  const ahpResult = useMemo(() => {
    return calculateAhp(ahpMatrix, kriteria);
  }, [ahpMatrix, kriteria]);

  // Compute TOPSIS Result
  const topsisResult = useMemo(() => {
    const yearData = dataset.filter((d) => d.tahun === selectedYear);
    return calculateTopsis(yearData, kabupaten, kriteria, ahpResult.weights);
  }, [dataset, selectedYear, kabupaten, kriteria, ahpResult.weights]);

  // Actions for Kabupaten
  const addKabupaten = useCallback(
    (item: Omit<KabupatenKota, 'id'>) => {
      setKabupaten((prev) => {
        const nextId = prev.length > 0 ? Math.max(...prev.map((k) => k.id)) + 1 : 1;
        const newKab = { ...item, id: nextId };
        return [...prev, newKab];
      });
      addToast('success', 'Kabupaten Ditambahkan', `${item.nama} berhasil didaftarkan.`);
    },
    [addToast],
  );

  const updateKabupaten = useCallback(
    (item: KabupatenKota) => {
      setKabupaten((prev) => prev.map((k) => (k.id === item.id ? item : k)));
      addToast('success', 'Kabupaten Diperbarui', `${item.nama} telah diupdate.`);
    },
    [addToast],
  );

  const deleteKabupaten = useCallback(
    (id: number) => {
      setKabupaten((prev) => prev.filter((k) => k.id !== id));
      setDataset((prev) => prev.filter((d) => d.kabupatenId !== id));
      addToast('info', 'Kabupaten Dihapus', 'Data wilayah dan dataset terkait telah dihapus.');
    },
    [addToast],
  );

  const batchSetKabupaten = useCallback(
    (list: KabupatenKota[]) => {
      setKabupaten(list);
      addToast('success', 'Master Data Diperbarui', `${list.length} wilayah dimuat.`);
    },
    [addToast],
  );

  // Actions for Kriteria
  const addKriteria = useCallback(
    (crit: Kriteria) => {
      setKriteria((prev) => {
        if (prev.some((c) => c.id.toUpperCase() === crit.id.toUpperCase())) {
          return prev;
        }
        return [...prev, crit];
      });
      addToast('success', 'Kriteria Ditambahkan', `Kriteria ${crit.id} (${crit.nama}) berhasil dibuat.`);
    },
    [addToast],
  );

  const updateKriteria = useCallback(
    (crit: Kriteria) => {
      setKriteria((prev) => prev.map((c) => (c.id === crit.id ? crit : c)));
      addToast('success', 'Kriteria Diperbarui', `Kriteria ${crit.id} berhasil disesuaikan.`);
    },
    [addToast],
  );

  const deleteKriteria = useCallback(
    (id: string) => {
      setKriteria((prev) => prev.filter((c) => c.id !== id));
      addToast('info', 'Kriteria Dihapus', `Kriteria ${id} telah dihapus.`);
    },
    [addToast],
  );

  // Actions for Dataset
  const addDatasetItem = useCallback(
    (item: DatasetIndikator) => {
      setDataset((prev) => {
        const existsIndex = prev.findIndex((d) => d.kabupatenId === item.kabupatenId && d.tahun === item.tahun);
        if (existsIndex >= 0) {
          const copy = [...prev];
          copy[existsIndex] = { ...copy[existsIndex], ...item };
          return copy;
        }
        const nextId = prev.length > 0 ? Math.max(...prev.map((d) => d.id || 0)) + 1 : 1;
        return [...prev, { ...item, id: nextId }];
      });
      addToast('success', 'Data Indikator Tersimpan', `Data indikator tahun ${item.tahun} tersimpan.`);
    },
    [addToast],
  );

  const updateDatasetItem = useCallback(
    (item: DatasetIndikator) => {
      setDataset((prev) => prev.map((d) => (d.kabupatenId === item.kabupatenId && d.tahun === item.tahun ? { ...d, ...item } : d)));
      addToast('success', 'Data Indikator Diupdate', `Data tahun ${item.tahun} diperbarui.`);
    },
    [addToast],
  );

  const deleteDatasetItem = useCallback(
    (kabupatenId: number, tahun: number) => {
      setDataset((prev) => prev.filter((d) => !(d.kabupatenId === kabupatenId && d.tahun === tahun)));
      addToast('info', 'Data Indikator Dihapus', 'Data baris berhasil dihapus.');
    },
    [addToast],
  );

  const batchSetDataset = useCallback(
    (items: DatasetIndikator[]) => {
      setDataset((prev) => {
        // Merge or replace by (kabupatenId, tahun)
        const map = new Map<string, DatasetIndikator>();
        prev.forEach((d) => map.set(`${d.kabupatenId}-${d.tahun}`, d));
        items.forEach((item) => {
          map.set(`${item.kabupatenId}-${item.tahun}`, item);
        });
        return Array.from(map.values());
      });
      addToast('success', 'Import Dataset Selesai', `${items.length} baris indikator berhasil dimuat.`);
    },
    [addToast],
  );

  // Actions for AHP Matrix
  const updateAhpCell = useCallback((i: number, j: number, value: number) => {
    setAhpMatrix((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[i][j] = value;
      if (value !== 0) {
        copy[j][i] = Number((1 / value).toFixed(4));
      }
      return copy;
    });
  }, []);

  const resetAhpMatrix = useCallback(() => {
    setAhpMatrix(createDefaultAhpMatrix(kriteria.length));
    addToast('info', 'Matriks Direset', 'Matriks AHP kembali ke nilai default identitas.');
  }, [kriteria.length, addToast]);

  // Actions for Resetting all data
  const resetAllData = useCallback(() => {
    const res = resetData();
    setKabupaten(res.kabupaten);
    setKriteria(res.kriteria);
    setDataset(res.dataset);
    setAhpMatrix(res.ahpMatrix);
    setSelectedYearState(res.selectedYear);
    addToast('info', 'Reset Sukses', 'Semua data kembali ke konfigurasi awal Jawa Tengah.');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        ahpSubTab,
        setAhpSubTab,
        topsisSubTab,
        setTopsisSubTab,
        isDarkMode,
        toggleDarkMode,
        sidebarOpen,
        setSidebarOpen,

        kabupaten,
        kriteria,
        dataset,
        ahpMatrix,
        selectedYear,
        availableYears,

        ahpResult,
        topsisResult,

        addKabupaten,
        updateKabupaten,
        deleteKabupaten,
        batchSetKabupaten,

        addKriteria,
        updateKriteria,
        deleteKriteria,

        addDatasetItem,
        updateDatasetItem,
        deleteDatasetItem,
        batchSetDataset,
        setSelectedYear,

        updateAhpCell,
        resetAhpMatrix,
        resetAllData,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
