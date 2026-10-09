import { KabupatenKota, Kriteria, DatasetIndikator } from '../types';

export const INITIAL_KABUPATEN: KabupatenKota[] = [
  { id: 1, kode: "3301", nama: "Kabupaten Cilacap" },
  { id: 2, kode: "3302", nama: "Kabupaten Banyumas" },
  { id: 3, kode: "3303", nama: "Kabupaten Purbalingga" },
  { id: 4, kode: "3304", nama: "Kabupaten Banjarnegara" },
  { id: 5, kode: "3305", nama: "Kabupaten Kebumen" },
  { id: 6, kode: "3306", nama: "Kabupaten Purworejo" },
  { id: 7, kode: "3307", nama: "Kabupaten Wonosobo" },
  { id: 8, kode: "3308", nama: "Kabupaten Magelang" },
  { id: 9, kode: "3309", nama: "Kabupaten Boyolali" },
  { id: 10, kode: "3310", nama: "Kabupaten Klaten" },
  { id: 11, kode: "3311", nama: "Kabupaten Sukoharjo" },
  { id: 12, kode: "3312", nama: "Kabupaten Wonogiri" },
  { id: 13, kode: "3313", nama: "Kabupaten Karanganyar" },
  { id: 14, kode: "3314", nama: "Kabupaten Sragen" },
  { id: 15, kode: "3315", nama: "Kabupaten Grobogan" },
  { id: 16, kode: "3316", nama: "Kabupaten Blora" },
  { id: 17, kode: "3317", nama: "Kabupaten Rembang" },
  { id: 18, kode: "3318", nama: "Kabupaten Pati" },
  { id: 19, kode: "3319", nama: "Kabupaten Kudus" },
  { id: 20, kode: "3320", nama: "Kabupaten Jepara" },
  { id: 21, kode: "3321", nama: "Kabupaten Demak" },
  { id: 22, kode: "3322", nama: "Kabupaten Semarang" },
  { id: 23, kode: "3323", nama: "Kabupaten Temanggung" },
  { id: 24, kode: "3324", nama: "Kabupaten Kendal" },
  { id: 25, kode: "3325", nama: "Kabupaten Batang" },
  { id: 26, kode: "3326", nama: "Kabupaten Pekalongan" },
  { id: 27, kode: "3327", nama: "Kabupaten Pemalang" },
  { id: 28, kode: "3328", nama: "Kabupaten Tegal" },
  { id: 29, kode: "3329", nama: "Kabupaten Brebes" },
  { id: 30, kode: "3371", nama: "Kota Magelang" },
  { id: 31, kode: "3372", nama: "Kota Surakarta" },
  { id: 32, kode: "3373", nama: "Kota Salatiga" },
  { id: 33, kode: "3374", nama: "Kota Semarang" },
  { id: 34, kode: "3375", nama: "Kota Pekalongan" },
  { id: 35, kode: "3376", nama: "Kota Tegal" },
];

export const INITIAL_KRITERIA: Kriteria[] = [
  {
    id: "C1",
    nama: "Prevalensi Stunting (%)",
    atribut: "benefit",
    keterangan: "Semakin tinggi prevalensi stunting maka semakin diprioritaskan penanganannya.",
  },
  {
    id: "C2",
    nama: "Jumlah Balita Stunting (Jiwa)",
    atribut: "benefit",
    keterangan: "Semakin tinggi total balita stunting maka semakin tinggi urgensi intervensi.",
  },
  {
    id: "C3",
    nama: "Persentase Penduduk Miskin (%)",
    atribut: "benefit",
    keterangan: "Semakin tinggi tingkat kemiskinan maka semakin rentan risiko stunting.",
  },
  {
    id: "C4",
    nama: "Akses Sanitasi Layak (%)",
    atribut: "cost",
    keterangan: "Semakin rendah sanitasi layak maka semakin rentan dan perlu diprioritaskan.",
  },
  {
    id: "C5",
    nama: "Akses Air Minum Layak (%)",
    atribut: "cost",
    keterangan: "Semakin rendah akses air minum maka semakin rentan dan perlu diprioritaskan.",
  },
  {
    id: "C6",
    nama: "Jumlah Tenaga Kesehatan (Orang)",
    atribut: "cost",
    keterangan: "Semakin sedikit ketersediaan nakes maka semakin butuh perbantuan intervensi.",
  },
];

// Initial realistic dataset for 2025
export const INITIAL_DATASET_2025: DatasetIndikator[] = [
  { id: 1, kabupatenId: 1, tahun: 2025, C1: 17.2, C2: 12450, C3: 10.99, C4: 82.4, C5: 84.5, C6: 412 },
  { id: 2, kabupatenId: 2, tahun: 2025, C1: 16.5, C2: 11800, C3: 12.53, C4: 85.1, C5: 87.2, C6: 480 },
  { id: 3, kabupatenId: 3, tahun: 2025, C1: 18.1, C2: 9540, C3: 14.99, C4: 79.5, C5: 81.3, C6: 320 },
  { id: 4, kabupatenId: 4, tahun: 2025, C1: 21.4, C2: 10850, C3: 14.90, C4: 76.2, C5: 78.4, C6: 295 },
  { id: 5, kabupatenId: 5, tahun: 2025, C1: 20.8, C2: 13200, C3: 16.34, C4: 75.8, C5: 79.1, C6: 330 },
  { id: 6, kabupatenId: 6, tahun: 2025, C1: 14.8, C2: 6100, C3: 11.47, C4: 86.4, C5: 88.0, C6: 280 },
  { id: 7, kabupatenId: 7, tahun: 2025, C1: 22.7, C2: 11400, C3: 15.58, C4: 73.1, C5: 76.5, C6: 265 },
  { id: 8, kabupatenId: 8, tahun: 2025, C1: 17.8, C2: 10500, C3: 11.09, C4: 83.2, C5: 85.6, C6: 360 },
  { id: 9, kabupatenId: 9, tahun: 2025, C1: 13.9, C2: 7400, C3: 9.82, C4: 88.5, C5: 89.2, C6: 340 },
  { id: 10, kabupatenId: 10, tahun: 2025, C1: 14.2, C2: 8900, C3: 12.04, C4: 87.9, C5: 90.1, C6: 390 },
  { id: 11, kabupatenId: 11, tahun: 2025, C1: 11.5, C2: 5200, C3: 7.58, C4: 92.1, C5: 93.4, C6: 350 },
  { id: 12, kabupatenId: 12, tahun: 2025, C1: 15.6, C2: 7100, C3: 10.99, C4: 84.3, C5: 82.5, C6: 310 },
  { id: 13, kabupatenId: 13, tahun: 2025, C1: 12.8, C2: 6300, C3: 9.85, C4: 89.2, C5: 91.0, C6: 335 },
  { id: 14, kabupatenId: 14, tahun: 2025, C1: 19.3, C2: 9800, C3: 12.87, C4: 81.6, C5: 83.9, C6: 315 },
  { id: 15, kabupatenId: 15, tahun: 2025, C1: 18.7, C2: 12900, C3: 11.80, C4: 80.2, C5: 82.1, C6: 385 },
  { id: 16, kabupatenId: 16, tahun: 2025, C1: 19.9, C2: 8950, C3: 11.49, C4: 78.4, C5: 80.6, C6: 290 },
  { id: 17, kabupatenId: 17, tahun: 2025, C1: 20.2, C2: 7650, C3: 14.17, C4: 77.0, C5: 79.5, C6: 275 },
  { id: 18, kabupatenId: 18, tahun: 2025, C1: 16.3, C2: 9600, C3: 9.33, C4: 85.3, C5: 87.4, C6: 410 },
  { id: 19, kabupatenId: 19, tahun: 2025, C1: 13.5, C2: 6200, C3: 7.24, C4: 91.0, C5: 92.5, C6: 370 },
  { id: 20, kabupatenId: 20, tahun: 2025, C1: 15.1, C2: 8700, C3: 6.61, C4: 86.8, C5: 88.9, C6: 360 },
  { id: 21, kabupatenId: 21, tahun: 2025, C1: 17.5, C2: 10400, C3: 12.01, C4: 82.9, C5: 84.1, C6: 340 },
  { id: 22, kabupatenId: 22, tahun: 2025, C1: 12.9, C2: 6800, C3: 7.21, C4: 90.5, C5: 91.8, C6: 375 },
  { id: 23, kabupatenId: 23, tahun: 2025, C1: 18.9, C2: 7900, C3: 9.31, C4: 83.1, C5: 85.0, C6: 285 },
  { id: 24, kabupatenId: 24, tahun: 2025, C1: 16.4, C2: 8950, C3: 9.39, C4: 86.0, C5: 87.8, C6: 350 },
  { id: 25, kabupatenId: 25, tahun: 2025, C1: 17.9, C2: 7800, C3: 8.98, C4: 84.2, C5: 86.1, C6: 295 },
  { id: 26, kabupatenId: 26, tahun: 2025, C1: 19.1, C2: 10200, C3: 9.67, C4: 81.5, C5: 83.4, C6: 320 },
  { id: 27, kabupatenId: 27, tahun: 2025, C1: 21.6, C2: 14800, C3: 15.03, C4: 74.9, C5: 77.2, C6: 360 },
  { id: 28, kabupatenId: 28, tahun: 2025, C1: 20.5, C2: 15300, C3: 7.90, C4: 76.5, C5: 79.0, C6: 420 },
  { id: 29, kabupatenId: 29, tahun: 2025, C1: 23.5, C2: 18900, C3: 15.78, C4: 71.8, C5: 74.3, C6: 450 },
  { id: 30, kode: "3371", kabupatenId: 30, tahun: 2025, C1: 10.2, C2: 950, C3: 6.11, C4: 95.8, C5: 96.5, C6: 210 },
  { id: 31, kode: "3372", kabupatenId: 31, tahun: 2025, C1: 9.8, C2: 2400, C3: 8.44, C4: 96.2, C5: 97.1, C6: 520 },
  { id: 32, kode: "3373", kabupatenId: 32, tahun: 2025, C1: 11.1, C2: 1100, C3: 4.66, C4: 94.5, C5: 95.8, C6: 230 },
  { id: 33, kode: "3374", kabupatenId: 33, tahun: 2025, C1: 8.9, C2: 5400, C3: 4.23, C4: 97.4, C5: 98.2, C6: 850 },
  { id: 34, kode: "3375", kabupatenId: 34, tahun: 2025, C1: 13.8, C2: 2100, C3: 6.81, C4: 91.2, C5: 93.0, C6: 240 },
  { id: 35, kode: "3376", kabupatenId: 35, tahun: 2025, C1: 12.4, C2: 1850, C3: 7.68, C4: 93.0, C5: 94.2, C6: 250 },
];

// Initial realistic pairwise comparison matrix for C1..C6 (Saaty 1-9)
// C1: Prevalensi Stunting
// C2: Jumlah Balita Stunting
// C3: Kemiskinan
// C4: Sanitasi
// C5: Air Minum
// C6: Tenaga Kesehatan
// Values arranged to yield CR < 0.1 (Strictly consistent)
export const INITIAL_AHP_MATRIX: number[][] = [
  // C1     C2     C3     C4     C5     C6
  [ 1.00,  2.00,  3.00,  4.00,  4.00,  5.00 ], // C1
  [ 0.50,  1.00,  2.00,  3.00,  3.00,  4.00 ], // C2
  [ 0.33,  0.50,  1.00,  2.00,  2.00,  3.00 ], // C3
  [ 0.25,  0.33,  0.50,  1.00,  1.00,  2.00 ], // C4
  [ 0.25,  0.33,  0.50,  1.00,  1.00,  2.00 ], // C5
  [ 0.20,  0.25,  0.33,  0.50,  0.50,  1.00 ], // C6
];
