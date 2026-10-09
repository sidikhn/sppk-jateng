import json

# Data directly from initialData.ts
KABUPATEN = [
  {"id": 1, "kode": "3301", "nama": "Kabupaten Cilacap"},
  {"id": 2, "kode": "3302", "nama": "Kabupaten Banyumas"},
  {"id": 3, "kode": "3303", "nama": "Kabupaten Purbalingga"},
  {"id": 4, "kode": "3304", "nama": "Kabupaten Banjarnegara"},
  {"id": 5, "kode": "3305", "nama": "Kabupaten Kebumen"},
  {"id": 6, "kode": "3306", "nama": "Kabupaten Purworejo"},
  {"id": 7, "kode": "3307", "nama": "Kabupaten Wonosobo"},
  {"id": 8, "kode": "3308", "nama": "Kabupaten Magelang"},
  {"id": 9, "kode": "3309", "nama": "Kabupaten Boyolali"},
  {"id": 10, "kode": "3310", "nama": "Kabupaten Klaten"},
  {"id": 11, "kode": "3311", "nama": "Kabupaten Sukoharjo"},
  {"id": 12, "kode": "3312", "nama": "Kabupaten Wonogiri"},
  {"id": 13, "kode": "3313", "nama": "Kabupaten Karanganyar"},
  {"id": 14, "kode": "3314", "nama": "Kabupaten Sragen"},
  {"id": 15, "kode": "3315", "nama": "Kabupaten Grobogan"},
  {"id": 16, "kode": "3316", "nama": "Kabupaten Blora"},
  {"id": 17, "kode": "3317", "nama": "Kabupaten Rembang"},
  {"id": 18, "kode": "3318", "nama": "Kabupaten Pati"},
  {"id": 19, "kode": "3319", "nama": "Kabupaten Kudus"},
  {"id": 20, "kode": "3320", "nama": "Kabupaten Jepara"},
  {"id": 21, "kode": "3321", "nama": "Kabupaten Demak"},
  {"id": 22, "kode": "3322", "nama": "Kabupaten Semarang"},
  {"id": 23, "kode": "3323", "nama": "Kabupaten Temanggung"},
  {"id": 24, "kode": "3324", "nama": "Kabupaten Kendal"},
  {"id": 25, "kode": "3325", "nama": "Kabupaten Batang"},
  {"id": 26, "kode": "3326", "nama": "Kabupaten Pekalongan"},
  {"id": 27, "kode": "3327", "nama": "Kabupaten Pemalang"},
  {"id": 28, "kode": "3328", "nama": "Kabupaten Tegal"},
  {"id": 29, "kode": "3329", "nama": "Kabupaten Brebes"},
  {"id": 30, "kode": "3371", "nama": "Kota Magelang"},
  {"id": 31, "kode": "3372", "nama": "Kota Surakarta"},
  {"id": 32, "kode": "3373", "nama": "Kota Salatiga"},
  {"id": 33, "kode": "3374", "nama": "Kota Semarang"},
  {"id": 34, "kode": "3375", "nama": "Kota Pekalongan"},
  {"id": 35, "kode": "3376", "nama": "Kota Tegal"},
]

KRITERIA = [
  {"id": "C1", "nama": "Prevalensi Stunting (%)", "atribut": "benefit"},
  {"id": "C2", "nama": "Jumlah Balita Stunting (Jiwa)", "atribut": "benefit"},
  {"id": "C3", "nama": "Persentase Penduduk Miskin (%)", "atribut": "benefit"},
  {"id": "C4", "nama": "Akses Sanitasi Layak (%)", "atribut": "cost"},
  {"id": "C5", "nama": "Akses Air Minum Layak (%)", "atribut": "cost"},
  {"id": "C6", "nama": "Jumlah Tenaga Kesehatan (Orang)", "atribut": "cost"},
]

DATASET_2025 = [
  {"id": 1, "kabupatenId": 1, "tahun": 2025, "C1": 17.2, "C2": 12450, "C3": 10.99, "C4": 82.4, "C5": 84.5, "C6": 412},
  {"id": 2, "kabupatenId": 2, "tahun": 2025, "C1": 16.5, "C2": 11800, "C3": 12.53, "C4": 85.1, "C5": 87.2, "C6": 480},
  {"id": 3, "kabupatenId": 3, "tahun": 2025, "C1": 18.1, "C2": 9540, "C3": 14.99, "C4": 79.5, "C5": 81.3, "C6": 320},
  {"id": 4, "kabupatenId": 4, "tahun": 2025, "C1": 21.4, "C2": 10850, "C3": 14.90, "C4": 76.2, "C5": 78.4, "C6": 295},
  {"id": 5, "kabupatenId": 5, "tahun": 2025, "C1": 20.8, "C2": 13200, "C3": 16.34, "C4": 75.8, "C5": 79.1, "C6": 330},
  {"id": 6, "kabupatenId": 6, "tahun": 2025, "C1": 14.8, "C2": 6100, "C3": 11.47, "C4": 86.4, "C5": 88.0, "C6": 280},
  {"id": 7, "kabupatenId": 7, "tahun": 2025, "C1": 22.7, "C2": 11400, "C3": 15.58, "C4": 73.1, "C5": 76.5, "C6": 265},
  {"id": 8, "kabupatenId": 8, "tahun": 2025, "C1": 17.8, "C2": 10500, "C3": 11.09, "C4": 83.2, "C5": 85.6, "C6": 360},
  {"id": 9, "kabupatenId": 9, "tahun": 2025, "C1": 13.9, "C2": 7400, "C3": 9.82, "C4": 88.5, "C5": 89.2, "C6": 340},
  {"id": 10, "kabupatenId": 10, "tahun": 2025, "C1": 14.2, "C2": 8900, "C3": 12.04, "C4": 87.9, "C5": 90.1, "C6": 390},
  {"id": 11, "kabupatenId": 11, "tahun": 2025, "C1": 11.5, "C2": 5200, "C3": 7.58, "C4": 92.1, "C5": 93.4, "C6": 350},
  {"id": 12, "kabupatenId": 12, "tahun": 2025, "C1": 15.6, "C2": 7100, "C3": 10.99, "C4": 84.3, "C5": 82.5, "C6": 310},
  {"id": 13, "kabupatenId": 13, "tahun": 2025, "C1": 12.8, "C2": 6300, "C3": 9.85, "C4": 89.2, "C5": 91.0, "C6": 335},
  {"id": 14, "kabupatenId": 14, "tahun": 2025, "C1": 19.3, "C2": 9800, "C3": 12.87, "C4": 81.6, "C5": 83.9, "C6": 315},
  {"id": 15, "kabupatenId": 15, "tahun": 2025, "C1": 18.7, "C2": 12900, "C3": 11.80, "C4": 80.2, "C5": 82.1, "C6": 385},
  {"id": 16, "kabupatenId": 16, "tahun": 2025, "C1": 19.9, "C2": 8950, "C3": 11.49, "C4": 78.4, "C5": 80.6, "C6": 290},
  {"id": 17, "kabupatenId": 17, "tahun": 2025, "C1": 20.2, "C2": 7650, "C3": 14.17, "C4": 77.0, "C5": 79.5, "C6": 275},
  {"id": 18, "kabupatenId": 18, "tahun": 2025, "C1": 16.3, "C2": 9600, "C3": 9.33, "C4": 85.3, "C5": 87.4, "C6": 410},
  {"id": 19, "kabupatenId": 19, "tahun": 2025, "C1": 13.5, "C2": 6200, "C3": 7.24, "C4": 91.0, "C5": 92.5, "C6": 370},
  {"id": 20, "kabupatenId": 20, "tahun": 2025, "C1": 15.1, "C2": 8700, "C3": 6.61, "C4": 86.8, "C5": 88.9, "C6": 360},
  {"id": 21, "kabupatenId": 21, "tahun": 2025, "C1": 17.5, "C2": 10400, "C3": 12.01, "C4": 82.9, "C5": 84.1, "C6": 340},
  {"id": 22, "kabupatenId": 22, "tahun": 2025, "C1": 12.9, "C2": 6800, "C3": 7.21, "C4": 90.5, "C5": 91.8, "C6": 375},
  {"id": 23, "kabupatenId": 23, "tahun": 2025, "C1": 18.9, "C2": 7900, "C3": 9.31, "C4": 83.1, "C5": 85.0, "C6": 285},
  {"id": 24, "kabupatenId": 24, "tahun": 2025, "C1": 16.4, "C2": 8950, "C3": 9.39, "C4": 86.0, "C5": 87.8, "C6": 350},
  {"id": 25, "kabupatenId": 25, "tahun": 2025, "C1": 17.9, "C2": 7800, "C3": 8.98, "C4": 84.2, "C5": 86.1, "C6": 295},
  {"id": 26, "kabupatenId": 26, "tahun": 2025, "C1": 19.1, "C2": 10200, "C3": 9.67, "C4": 81.5, "C5": 83.4, "C6": 320},
  {"id": 27, "kabupatenId": 27, "tahun": 2025, "C1": 21.6, "C2": 14800, "C3": 15.03, "C4": 74.9, "C5": 77.2, "C6": 360},
  {"id": 28, "kabupatenId": 28, "tahun": 2025, "C1": 20.5, "C2": 15300, "C3": 7.90, "C4": 76.5, "C5": 79.0, "C6": 420},
  {"id": 29, "kabupatenId": 29, "tahun": 2025, "C1": 23.5, "C2": 18900, "C3": 15.78, "C4": 71.8, "C5": 74.3, "C6": 450},
  {"id": 30, "kabupatenId": 30, "tahun": 2025, "C1": 10.2, "C2": 950, "C3": 6.11, "C4": 95.8, "C5": 96.5, "C6": 210},
  {"id": 31, "kabupatenId": 31, "tahun": 2025, "C1": 9.8, "C2": 2400, "C3": 8.44, "C4": 96.2, "C5": 97.1, "C6": 520},
  {"id": 32, "kabupatenId": 32, "tahun": 2025, "C1": 11.1, "C2": 1100, "C3": 4.66, "C4": 94.5, "C5": 95.8, "C6": 230},
  {"id": 33, "kabupatenId": 33, "tahun": 2025, "C1": 8.9, "C2": 5400, "C3": 4.23, "C4": 97.4, "C5": 98.2, "C6": 850},
  {"id": 34, "kabupatenId": 34, "tahun": 2025, "C1": 13.8, "C2": 2100, "C3": 6.81, "C4": 91.2, "C5": 93.0, "C6": 240},
  {"id": 35, "kabupatenId": 35, "tahun": 2025, "C1": 12.4, "C2": 1850, "C3": 7.68, "C4": 93.0, "C5": 94.2, "C6": 250},
]

AHP_MATRIX = [
  [ 1.00,  2.00,  3.00,  4.00,  4.00,  5.00 ],
  [ 0.50,  1.00,  2.00,  3.00,  3.00,  4.00 ],
  [ 0.33,  0.50,  1.00,  2.00,  2.00,  3.00 ],
  [ 0.25,  0.33,  0.50,  1.00,  1.00,  2.00 ],
  [ 0.25,  0.33,  0.50,  1.00,  1.00,  2.00 ],
  [ 0.20,  0.25,  0.33,  0.50,  0.50,  1.00 ]
]

def run_calculations():
    import math
    n = 6
    col_sums = [sum(AHP_MATRIX[i][j] for i in range(n)) for j in range(n)]
    norm = [[AHP_MATRIX[i][j] / col_sums[j] for j in range(n)] for i in range(n)]
    weights = [sum(norm[i]) / n for i in range(n)]
    
    # Consistency
    weighted_sum = [sum(AHP_MATRIX[i][j] * weights[j] for j in range(n)) for i in range(n)]
    lambda_max = sum(weighted_sum[i] / weights[i] for i in range(n)) / n
    ci = (lambda_max - n) / (n - 1)
    ri = 1.24
    cr = ci / ri

    print("=== AHP RESULTS ===")
    for i, c in enumerate(KRITERIA):
        print(f"{c['id']} - {c['nama']}: Bobot = {weights[i]:.4f} ({weights[i]*100:.2f}%)")
    print(f"Lambda Max: {lambda_max:.4f}, CI: {ci:.4f}, CR: {cr:.4f} (Konsisten: {cr < 0.1})")

    # TOPSIS
    c_ids = [c["id"] for c in KRITERIA]
    c_types = [c["atribut"] for c in KRITERIA]
    
    divisors = {}
    for cid in c_ids:
        sum_sq = sum(d[cid]**2 for d in DATASET_2025)
        divisors[cid] = math.sqrt(sum_sq)

    weighted_matrix = []
    for d in DATASET_2025:
        row_w = {}
        for idx, cid in enumerate(c_ids):
            norm_val = d[cid] / divisors[cid]
            row_w[cid] = norm_val * weights[idx]
        weighted_matrix.append(row_w)

    ideal_pos = {}
    ideal_neg = {}
    for idx, cid in enumerate(c_ids):
        col_vals = [w[cid] for w in weighted_matrix]
        if c_types[idx] == "benefit":
            ideal_pos[cid] = max(col_vals)
            ideal_neg[cid] = min(col_vals)
        else:
            ideal_pos[cid] = min(col_vals)
            ideal_neg[cid] = max(col_vals)

    rankings = []
    kab_map = {k["id"]: k for k in KABUPATEN}
    for idx, d in enumerate(DATASET_2025):
        w_row = weighted_matrix[idx]
        d_pos = math.sqrt(sum((w_row[cid] - ideal_pos[cid])**2 for cid in c_ids))
        d_neg = math.sqrt(sum((w_row[cid] - ideal_neg[cid])**2 for cid in c_ids))
        score = d_neg / (d_pos + d_neg) if (d_pos + d_neg) > 0 else 0
        
        cat = "Rendah"
        if score >= 0.60:
            cat = "Sangat Tinggi"
        elif score >= 0.45:
            cat = "Tinggi"
        elif score >= 0.30:
            cat = "Sedang"

        kab_info = kab_map[d["kabupatenId"]]
        rankings.append({
            "kabupatenId": d["kabupatenId"],
            "kode": kab_info["kode"],
            "nama": kab_info["nama"],
            "score": score,
            "dPlus": d_pos,
            "dMinus": d_neg,
            "category": cat
        })

    rankings.sort(key=lambda x: x["score"], reverse=True)
    for rank_idx, r in enumerate(rankings):
        r["rank"] = rank_idx + 1

    print("\n=== TOP 10 PERANGKINGAN TOPSIS 2025 ===")
    for r in rankings[:10]:
        print(f"Rank {r['rank']:2d}: {r['nama']:<25} | Skor: {r['score']:.4f} | Kategori: {r['category']}")

    print("\n=== 5 TERENDAH (PRIORITAS MINIMAL) ===")
    for r in rankings[-5:]:
        print(f"Rank {r['rank']:2d}: {r['nama']:<25} | Skor: {r['score']:.4f} | Kategori: {r['category']}")

if __name__ == "__main__":
    run_calculations()
