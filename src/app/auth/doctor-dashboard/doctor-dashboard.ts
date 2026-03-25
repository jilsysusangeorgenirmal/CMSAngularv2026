import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [Header, CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard {

}
