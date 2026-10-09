import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Kriteria, RankingResultItem, AhpCalculationResult } from '../types';

/**
 * Generate PDF Report for TOPSIS Ranking
 */
export function exportRankingToPdf(
  rankings: RankingResultItem[],
  criteria: Kriteria[],
  weights: Record<string, number>,
  year: number
): void {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header / Kop Dokumen
  doc.setFillColor(15, 118, 110); // Primary #0F766E
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PEMERINTAH PROVINSI JAWA TENGAH', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SISTEM PENDUKUNG KEPUTUSAN PENANGANAN STUNTING KABUPATEN/KOTA', 105, 16, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Metode Integrasi Analytical Hierarchy Process (AHP) & TOPSIS', 105, 21, { align: 'center' });

  // Metadata
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`LAPORAN PRIORITAS PENANGANAN STUNTING TAHUN ${year}`, 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 40);
  doc.text(`Total Wilayah yang Dianalisis: ${rankings.length} Kabupaten/Kota`, 14, 45);

  // Ringkasan Bobot Kriteria AHP
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Bobot Kriteria Penilaian (Hasil AHP):', 14, 53);

  const ahpHeaders = criteria.map((c) => `${c.id} (${(weights[c.id] * 100).toFixed(1)}%)`);
  const ahpSubHeaders = criteria.map((c) => c.atribut.toUpperCase());

  autoTable(doc, {
    startY: 56,
    head: [criteria.map((c) => c.nama)],
    body: [ahpHeaders, ahpSubHeaders],
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8, halign: 'center' },
    margin: { left: 14, right: 14 },
  });

  const finalAhpY = (doc as any).lastAutoTable.finalY || 70;

  // Tabel Ranking TOPSIS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Tabel Hasil Perangkingan Prioritas Daerah:', 14, finalAhpY + 10);

  const tableBody = rankings.map((r) => [
    r.rank,
    r.kode,
    r.nama,
    r.preferenceScore.toFixed(4),
    r.priorityCategory,
    r.dPlus.toFixed(4),
    r.dMinus.toFixed(4),
  ]);

  autoTable(doc, {
    startY: finalAhpY + 13,
    head: [['Rank', 'Kode', 'Kabupaten / Kota', 'Skor TOPSIS (Vi)', 'Prioritas', 'D+', 'D-']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 16 },
      2: { cellWidth: 55 },
      3: { halign: 'center', cellWidth: 28, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 28 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 20 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === 'Sangat Tinggi') {
          data.cell.styles.textColor = [239, 68, 68]; // red
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Tinggi') {
          data.cell.styles.textColor = [245, 158, 11]; // amber
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Sedang') {
          data.cell.styles.textColor = [15, 118, 110]; // teal
        } else {
          data.cell.styles.textColor = [100, 116, 139]; // slate
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer / Pengesahan
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Halaman ${i} dari ${pageCount} | Dicetak melalui Sistem Pendukung Keputusan Stunting Jateng`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`Laporan_Prioritas_Stunting_Jateng_${year}.pdf`);
}

/**
 * Generate PDF Report for AHP Criteria Weights & Consistency
 */
export function exportAhpToPdf(
  criteria: Kriteria[],
  matrix: number[][],
  ahpResult: AhpCalculationResult
): void {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PEMERINTAH PROVINSI JAWA TENGAH', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('LAPORAN PERHITUNGAN BOBOT KRITERIA AHP', 105, 16, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Analytical Hierarchy Process (AHP) - Skala Saaty 1-9', 105, 21, { align: 'center' });

  // Metadata
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Hasil Bobot Kriteria & Eigen Vector', 14, 34);

  const weightsBody = ahpResult.weightsList.map((w, idx) => [
    idx + 1,
    w.id,
    w.name,
    criteria.find((c) => c.id === w.id)?.atribut.toUpperCase() || 'BENEFIT',
    w.weight.toFixed(4),
    `${w.percentage.toFixed(2)}%`,
  ]);

  autoTable(doc, {
    startY: 38,
    head: [['No', 'Kode', 'Nama Kriteria', 'Atribut', 'Nilai Bobot', 'Persentase']],
    body: weightsBody,
    theme: 'striped',
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { halign: 'center', cellWidth: 25 },
      4: { halign: 'center', cellWidth: 25, fontStyle: 'bold' },
      5: { halign: 'center', cellWidth: 25, fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  const firstY = (doc as any).lastAutoTable.finalY || 70;

  // Uji Konsistensi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Parameter Uji Konsistensi Logis (Consistency Ratio)', 14, firstY + 10);

  const consistencyBody = [
    ['Jumlah Kriteria (n)', criteria.length.toString()],
    ['Lambda Maksimum (\u03BB max)', ahpResult.lambdaMax.toFixed(4)],
    ['Consistency Index (CI)', ahpResult.ci.toFixed(4)],
    ['Random Index (RI)', ahpResult.ri.toFixed(4)],
    ['Consistency Ratio (CR)', `${(ahpResult.cr * 100).toFixed(2)}% (${ahpResult.cr.toFixed(4)})`],
    ['Status Konsistensi', ahpResult.isConsistent ? 'KONSISTEN (CR \u2264 0.10) \u2705' : 'TIDAK KONSISTEN (CR > 0.10) \u274C'],
  ];

  autoTable(doc, {
    startY: firstY + 13,
    head: [['Parameter', 'Nilai']],
    body: consistencyBody,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166], textColor: 255, fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 90, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  const secondY = (doc as any).lastAutoTable.finalY || 130;

  // Matriks Perbandingan Berpasangan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Matriks Perbandingan Berpasangan Awal (Pairwise Comparison)', 14, secondY + 10);

  const matrixHead = ['Kriteria', ...criteria.map((c) => c.id)];
  const matrixBody = criteria.map((rowC, i) => [
    `${rowC.id} (${rowC.nama})`,
    ...matrix[i].map((val) => (val >= 1 ? val.toFixed(2) : (1 / val).toFixed(0) === '1' ? '1.00' : val.toFixed(2))),
  ]);

  autoTable(doc, {
    startY: secondY + 13,
    head: [matrixHead],
    body: matrixBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontSize: 7, halign: 'center' },
    bodyStyles: { fontSize: 7, halign: 'center' },
    columnStyles: {
      0: { cellWidth: 45, halign: 'left', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Halaman ${i} dari ${pageCount} | SPK Prioritas Stunting Jawa Tengah`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save('Laporan_Bobot_Kriteria_AHP.pdf');
}
