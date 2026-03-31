import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTechnicianService } from '../../../services/lab-technician.service';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';
import { CompletedPrescriptionDto } from '../../../models/lab-technician';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-completed-tests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-tests.component.html',
  styleUrls: ['./completed-tests.component.css']
})
export class CompletedTestsComponent implements OnInit {
  completedPrescriptions: CompletedPrescriptionDto[] = [];
  isLoading = false;

  constructor(
    private labTechService: LabTechnicianService,
    private pdfService: PdfGeneratorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCompletedPrescriptions();
  }

  fetchCompletedPrescriptions(): void {
    this.isLoading = true;
    this.labTechService.getCompletedPrescriptions().subscribe({
      next: (data) => {
        this.completedPrescriptions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching completed tests:', err);
        this.toastr.error('Failed to load completed tests', 'Error');
        this.isLoading = false;
      }
    });
  }

  generateBill(prescriptionId: number): void {
    this.labTechService.getLabReport(prescriptionId).subscribe({
      next: (reportData) => {
        this.pdfService.generateBillPdf(reportData);
        this.toastr.success('Bill generated successfully', 'Success');
      },
      error: (err) => {
        console.error('Error generating bill:', err);
        this.toastr.error('Failed to generate bill', 'Error');
      }
    });
  }

  downloadReport(prescriptionId: number): void {
    this.labTechService.getLabReport(prescriptionId).subscribe({
      next: (reportData) => {
        this.pdfService.generateLabReportPdf(reportData);
        this.toastr.success('Report generated successfully', 'Success');
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.toastr.error('Failed to generate report', 'Error');
      }
    });
  }
}
