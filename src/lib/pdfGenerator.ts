import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCFA } from './api';

export const generateBulletinPDF = async (report: any, evaluations: any[]) => {
  const doc = new jsPDF();
  const primaryColor = [30, 58, 138]; // brand-blue equivalent
  const secondaryColor = [234, 179, 8]; // brand-gold equivalent

  // Header Background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CFAZ ACADEMY', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('BULLETIN DE NOTES SCOLAIRES', 105, 25, { align: 'center' });
  
  // Student Info Header
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.text(report.full_name, 20, 55);
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Identifiant: #${report.student_id}`, 20, 62);
  doc.text(`Catégorie: ${report.category || 'N/A'}`, 20, 67);
  
  doc.text(`Année Académique: ${evaluations[0]?.academicYear || '2025-2026'}`, 140, 62);
  doc.text(`Moyenne Générale: ${report.global_average ? Number(report.global_average).toFixed(2) : '--'}/20`, 140, 67);

  // Table of Grades
  let yPos = 80;

  evaluations.forEach((evalItem, index) => {
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Séquence ${evalItem.sequence}`, 20, yPos);
    
    const tableData = evalItem.grades.map((g: any) => [
      g.subject,
      g.coefficient || 1,
      `${Number(g.score).toFixed(2)}/20`,
      (Number(g.score) * (Number(g.coefficient) || 1)).toFixed(2)
    ]);

    const seqAvg = evalItem.grades.reduce((sum: number, g: any) => sum + (Number(g.score) * (Number(g.coefficient) || 1)), 0) / 
                   evalItem.grades.reduce((sum: number, g: any) => sum + (Number(g.coefficient) || 1), 0);

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Matière', 'Coeff', 'Note', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      foot: [['MOYENNE SÉQUENCE', '', '', `${seqAvg.toFixed(2)}/20`]],
      footStyles: { fillColor: [249, 250, 251], textColor: primaryColor, fontStyle: 'bold' },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    if (evalItem.behaviorComment) {
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'italic');
      doc.text(`Observation: ${evalItem.behaviorComment}`, 20, yPos - 10);
    }

    if (yPos > 250 && index < evaluations.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} - Page ${i} sur ${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`bulletin_${report.full_name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
