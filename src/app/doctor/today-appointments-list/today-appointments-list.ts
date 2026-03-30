import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
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

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    if (this.appointmentService.doctors.length === 0) {
      this.appointmentService.getAllDoctors().subscribe({
        next: (docs) => {
          this.loadAppointments(docs);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.loadAppointments(this.appointmentService.doctors);
    }
  }

  private getDoctorId(doctors: any[]): number {
    const user = localStorage.getItem('USER_NAME')?.toLowerCase() || '';
    const nameMatch = user.replace('.doc', '').trim();
    
    const matchedDoc = doctors.find(d => d.Name.toLowerCase().includes(nameMatch));
    if (matchedDoc) {
       return matchedDoc.DoctorId;
    }

    if (user === 'meera.doc') return 201;
    if (user === 'vivek.doc') return 202;
    return 200; // fallback
  }

  loadAppointments(doctors: any[]) {
    const docId = this.getDoctorId(doctors);
    this.doctorService.getTodayAppointments(docId)
      .subscribe({
        next: (data: any[]) => {
          // Join missing patient details from PatientService
          this.patientService.getPatientsData().subscribe({
             next: (patients: any[]) => {
                data.forEach(a => {
                   const pid = a.patientId || a.PatientId;
                   if (pid) {
                      const p = patients.find((x: any) => x.patientId === pid || x.PatientId === pid);
                      if (p) {
                         a.patientName = `${p.firstName || p.FirstName} ${p.lastName || p.LastName}`;
                         a.age = p.age || p.Age;
                         a.gender = p.gender || p.Gender;
                      }
                   }
                });
                this.appointments = data;
             },
             error: () => {
                this.appointments = data;
             }
          });
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
      const defaultName = (a.patientName || a.PatientName || '').toLowerCase();
      if (defaultName.includes(term)) return true;

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

