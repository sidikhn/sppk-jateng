# SPK Prioritas Penanganan Stunting Kabupaten/Kota di Jawa Tengah Menggunakan AHP-TOPSIS

## Deskripsi Proyek

Buat aplikasi web Sistem Pendukung Keputusan (SPK) untuk menentukan prioritas penanganan stunting pada Kabupaten/Kota di Jawa Tengah menggunakan metode:

1. AHP (Analytical Hierarchy Process) untuk menentukan bobot kriteria.
2. TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) untuk melakukan perangkingan daerah.

Aplikasi dibuat tanpa backend (Frontend Only).

Seluruh data disimpan menggunakan:

- Local Storage Browser
- Import Excel (.xlsx)
- Export Excel (.xlsx)
- Export PDF

Aplikasi harus dapat dijalankan menggunakan:

- React
- Vite
- Tailwind CSS
- Shadcn UI
- Recharts

---

# Tujuan Sistem

Membantu pemerintah daerah menentukan kabupaten/kota yang menjadi prioritas penanganan stunting berdasarkan berbagai indikator yang tersedia.

Output akhir berupa ranking prioritas daerah menggunakan metode AHP-TOPSIS.

---

# Konsep DSS

## Alternatif

Alternatif adalah Kabupaten/Kota di Jawa Tengah.

Contoh:

- Cilacap
- Banyumas
- Purbalingga
- Banjarnegara
- Kebumen
- Purworejo
- Wonosobo
- Magelang
- Boyolali
- Klaten
- dan seterusnya

---

# Kriteria Penilaian

## C1 Prevalensi Stunting (%)

Jenis:
Benefit

Keterangan:
Semakin tinggi prevalensi stunting maka semakin diprioritaskan.

---

## C2 Jumlah Balita Stunting

Jenis:
Benefit

Keterangan:
Semakin tinggi jumlah kasus maka semakin diprioritaskan.

---

## C3 Persentase Penduduk Miskin (%)

Jenis:
Benefit

Keterangan:
Semakin tinggi kemiskinan maka semakin diprioritaskan.

---

## C4 Akses Sanitasi Layak (%)

Jenis:
Cost

Keterangan:
Semakin rendah akses sanitasi maka semakin diprioritaskan.

---

## C5 Akses Air Minum Layak (%)

Jenis:
Cost

Keterangan:
Semakin rendah akses air minum maka semakin diprioritaskan.

---

## C6 Jumlah Tenaga Kesehatan

Jenis:
Cost

Keterangan:
Semakin sedikit tenaga kesehatan maka semakin diprioritaskan.

---

# Struktur Data

## KabupatenKota

```json
{
  "id": 1,
  "kode": "3301",
  "nama": "Kabupaten Cilacap"
}
```

## Kriteria

```json
{
  "id": "C1",
  "nama": "Prevalensi Stunting",
  "atribut": "benefit"
}
```

## Dataset Indikator

```json
{
  "kabupatenId": 1,
  "tahun": 2025,
  "C1": 17.2,
  "C2": 12450,
  "C3": 9.4,
  "C4": 76.2,
  "C5": 81.4,
  "C6": 342
}
```

---

# Menu Aplikasi

## Dashboard

Tampilkan:

- Total Kabupaten/Kota
- Total Kriteria
- Total Dataset
- Total Perhitungan

Visualisasi:

- Top 10 Prioritas Stunting
- Sebaran Ranking
- Statistik Dataset

---

## Master Data Kabupaten/Kota

Fitur:

- Tambah
- Edit
- Hapus
- Pencarian
- Import Excel
- Export Excel

---

## Master Data Kriteria

Fitur:

- Tambah
- Edit
- Hapus

Kolom:

- Kode
- Nama Kriteria
- Benefit / Cost

---

## Dataset Indikator

Fitur:

- Input Data
- Edit Data
- Hapus Data
- Import Excel
- Export Excel
- Filter Tahun

---

# Modul AHP

## Halaman Matriks Perbandingan

Gunakan skala Saaty.

Nilai yang dapat dipilih:

- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9

Sistem otomatis menghasilkan nilai kebalikannya.

Contoh:

Jika:

C1 dibanding C2 = 5

Maka:

C2 dibanding C1 = 1/5

---

## Perhitungan AHP

Tampilkan langkah secara rinci:

### 1. Matriks Perbandingan

### 2. Jumlah Kolom

### 3. Normalisasi Matriks

### 4. Eigen Vector

### 5. Bobot Kriteria

---

## Konsistensi

Hitung:

- Lambda Max
- CI
- CR

Tampilkan indikator:

✅ Konsisten

atau

❌ Tidak Konsisten

Jika CR > 0.1 tampilkan warning.

---

## Hasil AHP

Tampilkan:

- Tabel Bobot
- Pie Chart Bobot
- Persentase Bobot

---

# Modul TOPSIS

## Tahap 1

Matriks Keputusan

---

## Tahap 2

Normalisasi

Formula:

Rij = Xij / √Σ(Xij²)

---

## Tahap 3

Normalisasi Terbobot

Formula:

Yij = Wij × Rij

Bobot berasal dari hasil AHP.

---

## Tahap 4

Solusi Ideal Positif

A+

---

## Tahap 5

Solusi Ideal Negatif

A-

---

## Tahap 6

Jarak Ideal

Hitung:

D+
D-

---

## Tahap 7

Nilai Preferensi

Formula:

Vi = D- / (D+ + D-)

---

## Tahap 8

Ranking

Urutkan berdasarkan nilai preferensi tertinggi.

---

# Halaman Hasil Ranking

Tampilkan:

- Ranking
- Nama Kabupaten/Kota
- Nilai TOPSIS
- Bobot AHP

Contoh:

Ranking 1
Kabupaten Brebes
Nilai 0.892

Ranking 2
Kabupaten Wonosobo
Nilai 0.864

Ranking 3
Kabupaten Banjarnegara
Nilai 0.801

---

# Visualisasi

Gunakan Recharts.

Buat:

## Bar Chart

Top 10 Prioritas Stunting

## Pie Chart

Bobot AHP

## Radar Chart

Perbandingan Indikator Daerah

## Area Chart

Distribusi Nilai TOPSIS

---

# Import Data Excel

Format:

```csv
kode_daerah,nama_daerah,tahun,C1,C2,C3,C4,C5,C6
3301,Cilacap,2025,17.2,12450,9.4,76.2,81.4,342
3302,Banyumas,2025,16.1,11100,10.1,80.2,84.6,367
```

---

# Export

Fitur:

- Export PDF Hasil Ranking
- Export Excel Hasil Ranking
- Export Excel Dataset
- Export PDF Bobot AHP

---

# Penyimpanan Data

Gunakan:

```javascript
localStorage
```

Buat helper:

- saveData()
- loadData()
- resetData()

Semua data tersimpan otomatis.

---

# UI Design

Tema:

Government Dashboard

Warna:

Primary:
#0F766E

Secondary:
#14B8A6

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

---

# Struktur Menu

Dashboard

Data Master
├── Kabupaten/Kota
├── Kriteria
└── Dataset

AHP
├── Matriks Perbandingan
├── Normalisasi
├── Eigen Vector
├── Konsistensi
└── Bobot

TOPSIS
├── Matriks Keputusan
├── Normalisasi
├── Matriks Terbobot
├── Solusi Ideal
├── Jarak Ideal
├── Nilai Preferensi
└── Ranking

Laporan
├── PDF Ranking
├── Excel Ranking
├── PDF Bobot
└── Excel Dataset

---

# Permintaan Kepada AI Coder

Bangun aplikasi React production-ready dengan:

- React + Vite
- Tailwind CSS
- Shadcn UI
- Recharts
- Local Storage
- XLSX Import/Export
- PDF Export
- Responsive Design
- Dark Mode
- Modular Folder Structure
- Custom Hooks
- Utility Functions AHP
- Utility Functions TOPSIS
- Validasi Form
- Search
- Filter
- Sorting

Tampilkan seluruh tahapan perhitungan AHP dan TOPSIS secara transparan agar dapat digunakan sebagai media pembelajaran dan presentasi akademik.