import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { TodayAppointmentsList } from '../../doctor/today-appointments-list/today-appointments-list';
import { ConsultationForm } from '../../doctor/consultation-form/consultation-form';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [Header, CommonModule, RouterLink, TodayAppointmentsList, ConsultationForm],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard {
  activeAppointment: any = null;

  onStartConsultation(event: any) {
    this.activeAppointment = event;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCloseConsultation() {
    this.activeAppointment = null;
  }
}
