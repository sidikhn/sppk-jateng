export type CriterionType = 'benefit' | 'cost';

export interface KabupatenKota {
  id: number;
  kode: string;
  nama: string;
}

export interface Kriteria {
  id: string; // e.g. "C1", "C2", etc.
  nama: string;
  atribut: CriterionType;
  keterangan?: string;
}

export interface DatasetIndikator {
  id?: number;
  kabupatenId: number;
  tahun: number;
  C1: number; // Prevalensi Stunting (%)
  C2: number; // Jumlah Balita Stunting
  C3: number; // Persentase Penduduk Miskin (%)
  C4: number; // Akses Sanitasi Layak (%)
  C5: number; // Akses Air Minum Layak (%)
  C6: number; // Jumlah Tenaga Kesehatan
  [key: string]: any;
}

// AHP Types
export interface AhpComparisonMatrix {
  criteriaIds: string[];
  matrix: number[][]; // size N x N where cell [i][j] is weight of criteriaIds[i] vs criteriaIds[j]
}

export interface AhpCalculationResult {
  columnSums: number[];
  normalizedMatrix: number[][];
  weights: Record<string, number>; // criteriaId -> weight (0 to 1)
  weightsList: { id: string; name: string; weight: number; percentage: number }[];
  lambdaMax: number;
  ci: number; // Consistency Index
  ri: number; // Random Index
  cr: number; // Consistency Ratio
  isConsistent: boolean;
}

// TOPSIS Types
export interface TopsisCalculationStep {
  // 1. Matriks Keputusan
  decisionMatrix: {
    kabupatenId: number;
    nama: string;
    kode: string;
    values: Record<string, number>;
  }[];
  // 2. Pembagi Normalisasi (akar jumlah kuadrat per kriteria)
  divisors: Record<string, number>;
  // 3. Matriks Ternormalisasi R
  normalizedMatrix: {
    kabupatenId: number;
    nama: string;
    kode: string;
    values: Record<string, number>;
  }[];
  // 4. Matriks Ternormalisasi Terbobot Y
  weightedMatrix: {
    kabupatenId: number;
    nama: string;
    kode: string;
    values: Record<string, number>;
  }[];
  // 5. Solusi Ideal Positif & Negatif
  idealPositive: Record<string, number>; // A+
  idealNegative: Record<string, number>; // A-
  // 6. Jarak Ideal D+ & D-
  distances: {
    kabupatenId: number;
    dPlus: number;
    dMinus: number;
  }[];
  // 7. Nilai Preferensi V & Ranking
  rankings: RankingResultItem[];
}

export interface RankingResultItem {
  rank: number;
  kabupatenId: number;
  kode: string;
  nama: string;
  dPlus: number;
  dMinus: number;
  preferenceScore: number; // Vi
  priorityCategory: 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah';
  rawValues: Record<string, number>;
}
