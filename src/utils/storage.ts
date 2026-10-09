import { KabupatenKota, Kriteria, DatasetIndikator } from '../types';
import { INITIAL_KABUPATEN, INITIAL_KRITERIA, INITIAL_DATASET_2025, INITIAL_AHP_MATRIX } from '../data/initialData';

const STORAGE_KEYS = {
  KABUPATEN: 'sppk_stunting_kabupaten_v1',
  KRITERIA: 'sppk_stunting_kriteria_v1',
  DATASET: 'sppk_stunting_dataset_v1',
  AHP_MATRIX: 'sppk_stunting_ahp_matrix_v1',
  SELECTED_YEAR: 'sppk_stunting_selected_year_v1',
  THEME: 'sppk_stunting_theme_v1',
};

export interface AppStoredData {
  kabupaten: KabupatenKota[];
  kriteria: Kriteria[];
  dataset: DatasetIndikator[];
  ahpMatrix: number[][];
  selectedYear: number;
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage for key: ${key}`, error);
  }
}

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage for key: ${key}`, error);
    return defaultValue;
  }
}

export function loadAllAppData(): AppStoredData {
  const kabupaten = loadData<KabupatenKota[]>(STORAGE_KEYS.KABUPATEN, INITIAL_KABUPATEN);
  const kriteria = loadData<Kriteria[]>(STORAGE_KEYS.KRITERIA, INITIAL_KRITERIA);
  const dataset = loadData<DatasetIndikator[]>(STORAGE_KEYS.DATASET, INITIAL_DATASET_2025);
  const ahpMatrix = loadData<number[][]>(STORAGE_KEYS.AHP_MATRIX, INITIAL_AHP_MATRIX);
  const selectedYear = loadData<number>(STORAGE_KEYS.SELECTED_YEAR, 2025);

  return {
    kabupaten,
    kriteria,
    dataset,
    ahpMatrix,
    selectedYear,
  };
}

export function saveAllAppData(data: AppStoredData): void {
  saveData(STORAGE_KEYS.KABUPATEN, data.kabupaten);
  saveData(STORAGE_KEYS.KRITERIA, data.kriteria);
  saveData(STORAGE_KEYS.DATASET, data.dataset);
  saveData(STORAGE_KEYS.AHP_MATRIX, data.ahpMatrix);
  saveData(STORAGE_KEYS.SELECTED_YEAR, data.selectedYear);
}

export function resetData(): AppStoredData {
  localStorage.removeItem(STORAGE_KEYS.KABUPATEN);
  localStorage.removeItem(STORAGE_KEYS.KRITERIA);
  localStorage.removeItem(STORAGE_KEYS.DATASET);
  localStorage.removeItem(STORAGE_KEYS.AHP_MATRIX);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_YEAR);

  return {
    kabupaten: INITIAL_KABUPATEN,
    kriteria: INITIAL_KRITERIA,
    dataset: INITIAL_DATASET_2025,
    ahpMatrix: INITIAL_AHP_MATRIX,
    selectedYear: 2025,
  };
}

export { STORAGE_KEYS };
