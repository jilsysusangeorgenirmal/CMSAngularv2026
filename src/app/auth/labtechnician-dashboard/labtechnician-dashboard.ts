import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-labtechnician-dashboard',
  imports: [Header, RouterLink, CommonModule],
  templateUrl: './labtechnician-dashboard.html',
  styleUrl: './labtechnician-dashboard.css',
})
export class LabtechnicianDashboard {

}
