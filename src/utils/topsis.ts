import { KabupatenKota, Kriteria, DatasetIndikator, TopsisCalculationStep, RankingResultItem } from '../types';

/**
 * Calculates TOPSIS steps and final ranking
 * @param dataset Array of indicators for the selected year
 * @param kabupaten List of districts
 * @param criteria List of criteria
 * @param weights AHP weights (record of criterion id to weight 0..1)
 */
export function calculateTopsis(
  dataset: DatasetIndikator[],
  kabupaten: KabupatenKota[],
  criteria: Kriteria[],
  weights: Record<string, number>
): TopsisCalculationStep {
  if (dataset.length === 0 || criteria.length === 0) {
    return {
      decisionMatrix: [],
      divisors: {},
      normalizedMatrix: [],
      weightedMatrix: [],
      idealPositive: {},
      idealNegative: {},
      distances: [],
      rankings: [],
    };
  }

  const kabMap = new Map<number, KabupatenKota>();
  kabupaten.forEach((k) => kabMap.set(k.id, k));

  // 1. Matriks Keputusan X
  const decisionMatrix = dataset.map((d) => {
    const kab = kabMap.get(d.kabupatenId);
    const values: Record<string, number> = {};
    criteria.forEach((c) => {
      values[c.id] = Number(d[c.id]) || 0;
    });
    return {
      kabupatenId: d.kabupatenId,
      nama: kab?.nama ?? `Kabupaten ID ${d.kabupatenId}`,
      kode: kab?.kode ?? '-',
      values,
    };
  });

  // 2. Pembagi Normalisasi: sqrt(sum(x^2)) per kriteria
  const divisors: Record<string, number> = {};
  criteria.forEach((c) => {
    let sumSq = 0;
    decisionMatrix.forEach((row) => {
      const val = row.values[c.id] || 0;
      sumSq += val * val;
    });
    divisors[c.id] = Math.sqrt(sumSq) || 1; // avoid division by zero
  });

  // 3. Matriks Ternormalisasi R: Rij = Xij / Pembagi_j
  const normalizedMatrix = decisionMatrix.map((row) => {
    const values: Record<string, number> = {};
    criteria.forEach((c) => {
      values[c.id] = row.values[c.id] / divisors[c.id];
    });
    return {
      kabupatenId: row.kabupatenId,
      nama: row.nama,
      kode: row.kode,
      values,
    };
  });

  // 4. Matriks Ternormalisasi Terbobot Y: Yij = Wij * Rij
  const weightedMatrix = normalizedMatrix.map((row) => {
    const values: Record<string, number> = {};
    criteria.forEach((c) => {
      const w = weights[c.id] ?? (1 / criteria.length);
      values[c.id] = row.values[c.id] * w;
    });
    return {
      kabupatenId: row.kabupatenId,
      nama: row.nama,
      kode: row.kode,
      values,
    };
  });

  // 5. Solusi Ideal Positif A+ & Negatif A-
  const idealPositive: Record<string, number> = {};
  const idealNegative: Record<string, number> = {};

  criteria.forEach((c) => {
    const columnValues = weightedMatrix.map((row) => row.values[c.id]);
    const maxVal = Math.max(...columnValues);
    const minVal = Math.min(...columnValues);

    if (c.atribut === 'benefit') {
      idealPositive[c.id] = maxVal;
      idealNegative[c.id] = minVal;
    } else {
      // cost
      idealPositive[c.id] = minVal;
      idealNegative[c.id] = maxVal;
    }
  });

  // 6. Jarak Ideal D+ dan D-
  const distances = weightedMatrix.map((row) => {
    let sumSqPlus = 0;
    let sumSqMinus = 0;

    criteria.forEach((c) => {
      const yVal = row.values[c.id];
      const diffPlus = yVal - idealPositive[c.id];
      const diffMinus = yVal - idealNegative[c.id];

      sumSqPlus += diffPlus * diffPlus;
      sumSqMinus += diffMinus * diffMinus;
    });

    const dPlus = Math.sqrt(sumSqPlus);
    const dMinus = Math.sqrt(sumSqMinus);

    return {
      kabupatenId: row.kabupatenId,
      dPlus,
      dMinus,
    };
  });

  const distMap = new Map<number, { dPlus: number; dMinus: number }>();
  distances.forEach((d) => distMap.set(d.kabupatenId, d));

  // 7. Nilai Preferensi Vi = D- / (D+ + D-) dan Perangkingan
  const unsortedRankings: Omit<RankingResultItem, 'rank'>[] = decisionMatrix.map((row) => {
    const dist = distMap.get(row.kabupatenId) || { dPlus: 0, dMinus: 0 };
    const denominator = dist.dPlus + dist.dMinus;
    const score = denominator > 0 ? dist.dMinus / denominator : 0;

    let priorityCategory: 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
    if (score >= 0.60) {
      priorityCategory = 'Sangat Tinggi';
    } else if (score >= 0.45) {
      priorityCategory = 'Tinggi';
    } else if (score >= 0.30) {
      priorityCategory = 'Sedang';
    } else {
      priorityCategory = 'Rendah';
    }

    return {
      kabupatenId: row.kabupatenId,
      kode: row.kode,
      nama: row.nama,
      dPlus: dist.dPlus,
      dMinus: dist.dMinus,
      preferenceScore: score,
      priorityCategory,
      rawValues: row.values,
    };
  });

  // Sort descending by preferenceScore
  unsortedRankings.sort((a, b) => b.preferenceScore - a.preferenceScore);

  const rankings: RankingResultItem[] = unsortedRankings.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return {
    decisionMatrix,
    divisors,
    normalizedMatrix,
    weightedMatrix,
    idealPositive,
    idealNegative,
    distances,
    rankings,
  };
}
