import { Component } from '@angular/core';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-receptionist-dashboard',
  imports: [Header, CommonModule, RouterLink],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.css',
})
export class ReceptionistDashboard {

}
