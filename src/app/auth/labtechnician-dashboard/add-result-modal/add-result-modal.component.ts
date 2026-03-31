import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PendingPrescriptionDto, LabTestResult } from '../../../models/lab-technician';
import { LabTechnicianService } from '../../../services/lab-technician.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-result-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-result-modal.component.html',
  styleUrls: ['./add-result-modal.component.css']
})
export class AddResultModalComponent implements OnInit {
  @Input() prescription!: PendingPrescriptionDto;
  @Output() closeModal = new EventEmitter<void>();
  @Output() resultAdded = new EventEmitter<void>();

  resultForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private labTechService: LabTechnicianService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resultForm = this.fb.group({
      resultValue: ['', [Validators.required, Validators.maxLength(100)]],
      remarks: ['', [Validators.maxLength(255)]]
    });
  }

  onSubmit(): void {
    if (this.resultForm.invalid) {
      this.resultForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const resultData: LabTestResult = {
      LabTestPrescriptionId: this.prescription.LabTestPrescriptionId,
      ResultValue: this.resultForm.value.resultValue,
      Remarks: this.resultForm.value.remarks,
      ResultDate: new Date(),
      StaffId: 1 // TODO: fetch from actual auth
    };

    this.labTechService.addLabTestResult(this.prescription.LabTestPrescriptionId, resultData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resultAdded.emit();
      },
      error: (err) => {
        console.error('Add result error:', err);
        // Handle constraint violation or other error
        if (err.error && typeof err.error === 'string') {
           this.toastr.error(err.error, 'Error');
        } else {
           this.toastr.error('Failed to save result', 'Error');
        }
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
