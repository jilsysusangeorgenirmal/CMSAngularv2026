import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientLabReportDto } from '../models/lab-technician';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generateLabReportPdf(reports: PatientLabReportDto[]) {
    if (!reports || reports.length === 0) return;

    const doc = new jsPDF();
    const firstReport = reports[0];

    // Build Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('Clinic Management System', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Lab Test Report', 105, 30, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);

    // Patient & Doctor Info
    doc.setFontSize(11);
    doc.text(`Patient Name: ${firstReport.PatientName || 'N/A'}`, 14, 45);
    doc.text(`Doctor: ${firstReport.DoctorName || 'N/A'}`, 14, 52);
    
    doc.text(`Prescription ID: PR-${firstReport.PrescriptionId}`, 130, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 52);

    // Result Table
    const tableData = reports.map(r => [
      r.LabTestName || '',
      r.ResultValue || '',
      r.NormalRange || '',
      r.Remarks || ''
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Test Name', 'Result', 'Normal Range', 'Remarks']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 60 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;
    
    // Footer / Signature
    doc.setFontSize(10);
    doc.text('Authorized Signature', 150, finalY + 40);
    doc.line(140, finalY + 35, 190, finalY + 35);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This is a computer-generated document. No signature is required.', 105, 280, { align: 'center' });

    // Save PDF
    const safeName = (firstReport.PatientName || 'Patient').replace(/\s+/g, '_');
    const filename = `LabReport_${safeName}_${new Date().getTime()}.pdf`;
    doc.save(filename);
  }

  generateBillPdf(reports: PatientLabReportDto[]) {
    if (!reports || reports.length === 0) return;

    const doc = new jsPDF();
    const firstReport = reports[0];
    const totalAmount = reports.reduce((sum, r) => sum + (r.Price || 0), 0);

    // Build Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('Clinic Management System', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.text('LAB INVOICE / BILL', 105, 30, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);

    // Patient Info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient Name: ${firstReport.PatientName || 'N/A'}`, 14, 45);
    doc.text(`Doctor: ${firstReport.DoctorName || 'N/A'}`, 14, 52);
    
    doc.text(`Bill No: LB-${firstReport.LabBillId || 'N/A'}`, 130, 45);
    doc.text(`Billing Date: ${new Date().toLocaleDateString()}`, 130, 52);

    // Bill Table
    const tableData = reports.map(r => [
      r.LabTestName || 'Unknown Test',
      '1', // Quantity
      (r.Price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Test Name', 'Qty', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      styles: { halign: 'center' },
      columnStyles: { 0: { halign: 'left' } },
      margin: { top: 60 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;
    
    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ${totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 190, finalY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing CMS Lab!', 105, finalY + 30, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This is a computer-generated bill.', 105, 280, { align: 'center' });

    // Save PDF
    const safeName = (firstReport.PatientName || 'Patient').replace(/\s+/g, '_');
    const filename = `LabBill_${safeName}_${new Date().getTime()}.pdf`;
    doc.save(filename);
  }
}
