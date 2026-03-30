import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-today-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './today-appointments-list.html',
  styleUrl: './today-appointments-list.css',
})
export class TodayAppointmentsList implements OnInit {

  searchTerm: string = '';

  p: number = 1;
  itemsPerPage: number = 5;

  appointments: any[] = [];

  @Output() startConsultationEvent = new EventEmitter<any>();

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  private getDoctorId(): number {
    const user = localStorage.getItem('USER_NAME')?.toLowerCase();
    if (user === 'meera.doc') return 201;
    if (user === 'vivek.doc') return 202;
    return 200; // arjun.doc or default
  }

  loadAppointments() {
    this.doctorService.getTodayAppointments(this.getDoctorId())
      .subscribe({
        next: (data: any[]) => {
          this.appointments = data;
        },
        error: (err: any) => {
          console.error(err);
        }
      });
  }

  get filteredAppointments() {
    if (!this.searchTerm) {
      return this.appointments;
    }
    const term = this.searchTerm.toLowerCase();
    return this.appointments.filter(a => {
      const patient = a.patient || a.Patient;
      if (!patient) return false;
      
      const fName = (patient.firstName || patient.FirstName || '').toLowerCase();
      const lName = (patient.lastName || patient.LastName || '').toLowerCase();
      const fullName = `${fName} ${lName}`;
      const patientId = (patient.patientId || patient.PatientId || '').toString();

      return fullName.includes(term) || patientId.includes(term);
    });
  }

  startConsultation(appt: any) {
    this.startConsultationEvent.emit(appt);
  }
}

