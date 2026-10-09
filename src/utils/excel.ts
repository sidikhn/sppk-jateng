import * as XLSX from 'xlsx';
import { KabupatenKota, Kriteria, DatasetIndikator, RankingResultItem } from '../types';

/**
 * Export TOPSIS Ranking results to Excel
 */
export function exportRankingToExcel(
  rankings: RankingResultItem[],
  criteria: Kriteria[],
  weights: Record<string, number>,
  year: number
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Hasil Ranking
  const rankingData = rankings.map((r) => {
    const row: Record<string, any> = {
      'Peringkat': r.rank,
      'Kode Wilayah': r.kode,
      'Kabupaten / Kota': r.nama,
      'Nilai Preferensi (Vi)': Number(r.preferenceScore.toFixed(4)),
      'Kategori Prioritas': r.priorityCategory,
      'Jarak Positif (D+)': Number(r.dPlus.toFixed(4)),
      'Jarak Negatif (D-)': Number(r.dMinus.toFixed(4)),
    };

    criteria.forEach((c) => {
      row[`${c.id} (${c.nama})`] = r.rawValues[c.id];
    });

    return row;
  });

  const wsRanking = XLSX.utils.json_to_sheet(rankingData);
  XLSX.utils.book_append_sheet(wb, wsRanking, `Ranking Stunting ${year}`);

  // Sheet 2: Bobot Kriteria AHP
  const ahpData = criteria.map((c) => ({
    'Kode Kriteria': c.id,
    'Nama Indikator': c.nama,
    'Jenis Atribut': c.atribut.toUpperCase(),
    'Bobot AHP': Number((weights[c.id] || 0).toFixed(4)),
    'Persentase (%)': Number(((weights[c.id] || 0) * 100).toFixed(2)),
  }));
  const wsAhp = XLSX.utils.json_to_sheet(ahpData);
  XLSX.utils.book_append_sheet(wb, wsAhp, 'Bobot AHP Kriteria');

  // Download
  XLSX.writeFile(wb, `SPK_Prioritas_Stunting_Jateng_${year}.xlsx`);
}

/**
 * Export Dataset Indikator to Excel
 */
export function exportDatasetToExcel(
  dataset: DatasetIndikator[],
  kabupaten: KabupatenKota[],
  criteria: Kriteria[],
  yearFilter?: number
): void {
  const kabMap = new Map<number, KabupatenKota>();
  kabupaten.forEach((k) => kabMap.set(k.id, k));

  const filtered = yearFilter ? dataset.filter((d) => d.tahun === yearFilter) : dataset;

  const rows = filtered.map((d) => {
    const kab = kabMap.get(d.kabupatenId);
    const row: Record<string, any> = {
      'kode_daerah': kab?.kode || '',
      'nama_daerah': kab?.nama || '',
      'tahun': d.tahun,
    };
    criteria.forEach((c) => {
      row[c.id] = d[c.id] ?? 0;
    });
    return row;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Dataset Indikator');
  XLSX.writeFile(wb, `Dataset_Stunting_Jateng_${yearFilter || 'Semua'}.xlsx`);
}

/**
 * Export Kabupaten Master Data to Excel
 */
export function exportKabupatenToExcel(kabupaten: KabupatenKota[]): void {
  const rows = kabupaten.map((k) => ({
    'ID': k.id,
    'Kode BPS': k.kode,
    'Nama Kabupaten / Kota': k.nama,
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Master Kabupaten');
  XLSX.writeFile(wb, 'Master_Kabupaten_Jateng.xlsx');
}

/**
 * Download template for importing dataset
 */
export function downloadDatasetTemplate(kabupaten: KabupatenKota[], criteria: Kriteria[]): void {
  const sampleRows = kabupaten.map((k) => {
    const row: Record<string, any> = {
      'kode_daerah': k.kode,
      'nama_daerah': k.nama,
      'tahun': 2025,
    };
    criteria.forEach((c) => {
      row[c.id] = c.id === 'C1' ? 15.0 : c.id === 'C2' ? 5000 : c.id === 'C3' ? 10.0 : c.id === 'C4' ? 85.0 : c.id === 'C5' ? 88.0 : 300;
    });
    return row;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sampleRows);
  XLSX.utils.book_append_sheet(wb, ws, 'Template Dataset');
  XLSX.writeFile(wb, 'Template_Import_Dataset_Stunting.xlsx');
}

/**
 * Parse uploaded Excel file for dataset
 */
export async function parseDatasetExcel(
  file: File,
  existingKabupaten: KabupatenKota[],
  criteria: Kriteria[]
): Promise<{ success: boolean; data?: DatasetIndikator[]; error?: string; message?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

    if (!rawData || rawData.length === 0) {
      return { success: false, error: 'File Excel kosong atau tidak memiliki data baris.' };
    }

    const kabMapByCode = new Map<string, KabupatenKota>();
    const kabMapByName = new Map<string, KabupatenKota>();
    existingKabupaten.forEach((k) => {
      kabMapByCode.set(k.kode.trim().toLowerCase(), k);
      kabMapByName.set(k.nama.trim().toLowerCase(), k);
    });

    const parsed: DatasetIndikator[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const kode = String(row['kode_daerah'] || row['kode'] || row['Kode'] || '').trim().toLowerCase();
      const nama = String(row['nama_daerah'] || row['nama'] || row['Nama'] || '').trim().toLowerCase();
      const tahun = Number(row['tahun'] || row['Tahun'] || 2025);

      const matchedKab = kabMapByCode.get(kode) || kabMapByName.get(nama);

      if (!matchedKab) {
        // Skip or warn
        continue;
      }

      const item: DatasetIndikator = {
        kabupatenId: matchedKab.id,
        tahun,
        C1: Number(row['C1'] ?? row['c1'] ?? 0),
        C2: Number(row['C2'] ?? row['c2'] ?? 0),
        C3: Number(row['C3'] ?? row['c3'] ?? 0),
        C4: Number(row['C4'] ?? row['c4'] ?? 0),
        C5: Number(row['C5'] ?? row['c5'] ?? 0),
        C6: Number(row['C6'] ?? row['c6'] ?? 0),
      };

      // Also dynamically map if additional criteria exist
      criteria.forEach((c) => {
        if (row[c.id] !== undefined) {
          item[c.id] = Number(row[c.id]) || 0;
        }
      });

      parsed.push(item);
    }

    if (parsed.length === 0) {
      return {
        success: false,
        error: 'Tidak ditemukan data daerah yang cocok dengan master data Kabupaten/Kota. Pastikan kolom "kode_daerah" atau "nama_daerah" sesuai.',
      };
    }

    return {
      success: true,
      data: parsed,
      message: `Berhasil memproses ${parsed.length} baris data indikator daerah.`,
    };
  } catch (error: any) {
    return { success: false, error: `Gagal membaca file Excel: ${error?.message || error}` };
  }
}
