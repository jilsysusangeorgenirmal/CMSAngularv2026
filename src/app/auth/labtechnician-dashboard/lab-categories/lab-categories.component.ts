import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTechnicianService } from '../../../services/lab-technician.service';
import { LabTestCategory } from '../../../models/lab-technician';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lab-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lab-categories.component.html',
  styleUrls: ['./lab-categories.component.css']
})
export class LabCategoriesComponent implements OnInit {
  categories: LabTestCategory[] = [];
  isLoading = false;

  constructor(
    private labTechnicianService: LabTechnicianService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.labTechnicianService.getAllLabTestCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.categories = [];
        } else {
          console.error('Error fetching categories', err);
          this.toastr.error('Failed to load lab test categories', 'Error');
        }
        this.isLoading = false;
      }
    });
  }
}
