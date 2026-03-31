import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTechnicianService } from '../../../services/lab-technician.service';
import { PendingPrescriptionDto } from '../../../models/lab-technician';
import { AddResultModalComponent } from '../add-result-modal/add-result-modal.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';

@Component({
  selector: 'app-pending-tests',
  standalone: true,
  imports: [CommonModule, AddResultModalComponent],
  templateUrl: './pending-tests.component.html',
  styleUrls: ['./pending-tests.component.css']
})
export class PendingTestsComponent implements OnInit {
  pendingPrescriptions: PendingPrescriptionDto[] = [];
  isLoading = false;
  
  showAddResultModal = false;
  selectedPrescription: PendingPrescriptionDto | null = null;
  
  constructor(
    private labTechService: LabTechnicianService,
    private toastr: ToastrService,
    private pdfService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadPendingPrescriptions();
  }

  loadPendingPrescriptions() {
    this.isLoading = true;
    this.labTechService.getPendingPrescriptions().subscribe({
      next: (data) => {
        this.pendingPrescriptions = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          // The API returns 404 explicitly when there are no pending items
          this.pendingPrescriptions = [];
        } else {
          console.error('Error fetching pending prescriptions', err);
          this.toastr.error('Failed to load pending tests', 'Error');
        }
        this.isLoading = false;
      }
    });
  }

  canGenerateBill(prescriptionId: number): boolean {
    const testsForPrescription = this.pendingPrescriptions.filter(p => p.PrescriptionId === prescriptionId);
    if(testsForPrescription.length === 0) return false;
    return testsForPrescription.some(t => t.Status !== 'Pending');
  }

  openAddResultModal(prescription: PendingPrescriptionDto) {
    this.selectedPrescription = prescription;
    this.showAddResultModal = true;
  }

  onModalClose() {
    this.showAddResultModal = false;
    this.selectedPrescription = null;
  }

  onResultAdded() {
    this.showAddResultModal = false;
    const currentPrescriptionId = this.selectedPrescription?.PrescriptionId;
    this.selectedPrescription = null;
    this.loadPendingPrescriptions();

    if (currentPrescriptionId) {
      Swal.fire({
        title: 'Success!',
        text: 'Result added successfully! Do you want to generate the bill for this prescription now?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, generate bill!',
        cancelButtonText: 'No, later'
      }).then((result) => {
        if (result.isConfirmed) {
          this.generateBill(currentPrescriptionId, true);
        }
      });
    } else {
      this.toastr.success('Result added successfully!', 'Success');
    }
  }

  generateBill(prescriptionId: number, skipConfirm: boolean = false) {
    const doGenerate = () => {
      this.isLoading = true;
      this.labTechService.generateLabBill(prescriptionId).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadPendingPrescriptions();

          Swal.fire({
            title: 'Bill Generated!',
            text: 'The bill has been successfully generated. Do you want to download the PDF Report now?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Download PDF',
            cancelButtonText: 'Close'
          }).then((res) => {
            if (res.isConfirmed) {
              this.downloadPdfReport(prescriptionId);
            }
          });
        },
        error: (err) => {
          console.error('Error generating bill', err);
          this.toastr.error('Failed to generate bill', 'Error');
          this.isLoading = false;
        }
      });
    };

    if (skipConfirm) {
      doGenerate();
    } else {
      Swal.fire({
        title: 'Generate Bill',
        text: 'Are you sure you want to generate the bill for this prescription?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, generate it!'
      }).then((result) => {
        if (result.isConfirmed) {
          doGenerate();
        }
      });
    }
  }

  downloadPdfReport(prescriptionId: number) {
    this.isLoading = true;
    this.labTechService.getLabReport(prescriptionId).subscribe({
      next: (reports) => {
        this.isLoading = false;
        if (reports && reports.length > 0) {
          this.pdfService.generateLabReportPdf(reports);
          this.toastr.success('PDF Report downloaded successfully!', 'Success');
        } else {
          this.toastr.warning('No reports found to generate PDF.', 'Warning');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching report', err);
        this.toastr.error('Failed to fetch the lab report for PDF', 'Error');
      }
    });
  }
}
