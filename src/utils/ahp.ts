import { Kriteria, AhpCalculationResult } from '../types';

// Saaty's Random Index (RI) table for matrix sizes 1 to 10
export const SAATY_RI: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export const SAATY_SCALE = [
  { value: 1, label: '1 - Sama penting (Equal)' },
  { value: 2, label: '2 - Mendekati sedikit lebih penting' },
  { value: 3, label: '3 - Sedikit lebih penting (Moderate)' },
  { value: 4, label: '4 - Mendekati lebih penting' },
  { value: 5, label: '5 - Lebih penting (Strong)' },
  { value: 6, label: '6 - Mendekati sangat penting' },
  { value: 7, label: '7 - Sangat lebih penting (Very strong)' },
  { value: 8, label: '8 - Mendekati mutlak lebih penting' },
  { value: 9, label: '9 - Mutlak lebih penting (Extreme)' },
];

/**
 * Calculates AHP weights and consistency checks
 * @param matrix Pairwise comparison matrix (n x n)
 * @param criteria List of criteria
 */
export function calculateAhp(matrix: number[][], criteria: Kriteria[]): AhpCalculationResult {
  const n = matrix.length;
  if (n === 0) {
    return {
      columnSums: [],
      normalizedMatrix: [],
      weights: {},
      weightsList: [],
      lambdaMax: 0,
      ci: 0,
      ri: 0,
      cr: 0,
      isConsistent: true,
    };
  }

  // 1. Hitung Jumlah Kolom
  const columnSums: number[] = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      columnSums[j] += matrix[i][j];
    }
  }

  // 2. Normalisasi Matriks (tiap elemen dibagi jumlah kolomnya)
  const normalizedMatrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const colSum = columnSums[j] || 1;
      row.push(matrix[i][j] / colSum);
    }
    normalizedMatrix.push(row);
  }

  // 3. Eigen Vector (Rata-rata tiap baris matriks normalisasi -> Bobot Kriteria)
  const weights: Record<string, number> = {};
  const weightsArray: number[] = [];
  for (let i = 0; i < n; i++) {
    const rowSum = normalizedMatrix[i].reduce((acc, val) => acc + val, 0);
    const weight = rowSum / n;
    weightsArray.push(weight);
    const criterionId = criteria[i]?.id ?? `C${i + 1}`;
    weights[criterionId] = weight;
  }

  // 4. Hitung Konsistensi (Lambda Max, CI, CR)
  // Matriks M * W
  const weightedSumVector: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * weightsArray[j];
    }
    weightedSumVector.push(sum);
  }

  // Rasio konsistensi per baris ( (M * W)_i / W_i )
  const ratioVector: number[] = [];
  for (let i = 0; i < n; i++) {
    const w = weightsArray[i];
    ratioVector.push(w > 0 ? weightedSumVector[i] / w : 0);
  }

  const lambdaMax = ratioVector.reduce((a, b) => a + b, 0) / n;
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0;
  const ri = SAATY_RI[n] ?? 1.49;
  const cr = ri > 0 ? ci / ri : 0;
  const isConsistent = cr <= 0.10;

  const weightsList = criteria.map((c, i) => {
    const weight = weightsArray[i] ?? 0;
    return {
      id: c.id,
      name: c.nama,
      weight,
      percentage: Number((weight * 100).toFixed(2)),
    };
  });

  return {
    columnSums,
    normalizedMatrix,
    weights,
    weightsList,
    lambdaMax,
    ci,
    ri,
    cr,
    isConsistent,
  };
}

/**
 * Creates default identity-like matrix or consistent matrix for given criteria count
 */
export function createDefaultAhpMatrix(size: number): number[][] {
  const mat: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(i === j ? 1 : 1);
    }
    mat.push(row);
  }
  return mat;
}
