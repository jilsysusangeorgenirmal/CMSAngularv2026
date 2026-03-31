import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';
import { PendingTestsComponent } from './pending-tests/pending-tests.component';
import { LabTestsComponent } from './lab-tests/lab-tests.component';
import { LabCategoriesComponent } from './lab-categories/lab-categories.component';
import { CompletedTestsComponent } from './completed-tests/completed-tests.component';

@Component({
  selector: 'app-labtechnician-dashboard',
  imports: [Header, RouterLink, CommonModule, PendingTestsComponent, LabTestsComponent, LabCategoriesComponent, CompletedTestsComponent],
  templateUrl: './labtechnician-dashboard.html',
  styleUrl: './labtechnician-dashboard.css',
})
export class LabtechnicianDashboard {
  activeTab: 'pending' | 'tests' | 'categories' | 'completed' = 'pending';

  switchTab(tab: 'pending' | 'tests' | 'categories' | 'completed') {
    this.activeTab = tab;
  }
}
