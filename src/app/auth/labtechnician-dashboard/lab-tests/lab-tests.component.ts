import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTechnicianService } from '../../../services/lab-technician.service';
import { LabTest } from '../../../models/lab-technician';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lab-tests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit {
  labTests: LabTest[] = [];
  isLoading = false;

  constructor(
    private labTechnicianService: LabTechnicianService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLabTests();
  }

  loadLabTests() {
    this.isLoading = true;
    this.labTechnicianService.getAllLabTests().subscribe({
      next: (data) => {
        this.labTests = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.labTests = [];
        } else {
          console.error('Error fetching lab tests', err);
          this.toastr.error('Failed to load lab tests', 'Error');
        }
        this.isLoading = false;
      }
    });
  }
}
