import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Header } from '../../auth/header/header';

@Component({
  selector: 'app-consultation-history',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './consultation-history.html',
  styleUrl: './consultation-history.css'
})
export class ConsultationHistory implements OnInit {
  historyRecords: any[] = [];
  isLoading = true;

  // View History Modal State
  selectedPatientHistory: any[] | null = null;
  selectedPatientName: string = '';
  isHistoryLoading = false;
  showHistoryModal = false;

  availableMedicines = [
    { id: 700, name: 'Paracetamol' },
    { id: 701, name: 'Amoxicillin' },
    { id: 702, name: 'Benadryl' },
    { id: 703, name: 'Diclofenac' },
    { id: 704, name: 'Ciplox' },
    { id: 705, name: 'Ciplox' },
    { id: 706, name: 'Azithromycin' },
    { id: 707, name: 'Omeprazole' },
    { id: 708, name: 'Cough Syrup DX' },
    { id: 709, name: 'Insulin Injection' },
    { id: 710, name: 'Ibuprofen' }
  ];

  availableLabTests = [
    { id: 1200, name: 'Complete Blood Count' },
    { id: 1201, name: 'Hemoglobin Test' },
    { id: 1202, name: 'Urine Routine' },
    { id: 1203, name: 'X-Ray Chest' },
    { id: 1204, name: 'ECG' },
    { id: 1205, name: 'Liver Function Test' },
    { id: 1206, name: 'Kidney Function Test' }
  ];

  constructor(private doctorService: DoctorService) {}

  getMedName(id: any): string {
     const match = this.availableMedicines.find(m => m.id == id);
     return match ? match.name : 'Unknown Medicine';
  }

  getTestName(id: any): string {
     const match = this.availableLabTests.find(t => t.id == id);
     return match ? match.name : 'Unknown Test';
  }

  private getDoctorId(): number {
    const user = localStorage.getItem('USER_NAME')?.toLowerCase();
    if (user === 'meera.doc') return 201;
    if (user === 'vivek.doc') return 202;
    return 200; // arjun.doc or default
  }

  ngOnInit(): void {
    const doctorId = this.getDoctorId();
    this.doctorService.getConsultations(doctorId).subscribe({
      next: (data) => {
        this.historyRecords = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  viewHistory(record: any): void {
    const patient = record.appointment?.patient || record.Appointment?.Patient;
    if (!patient) return;
    
    const patientId = patient.patientId || patient.PatientId;
    this.selectedPatientName = `${patient.firstName || patient.FirstName} ${patient.lastName || patient.LastName}`;
    
    this.showHistoryModal = true;
    this.isHistoryLoading = true;
    this.selectedPatientHistory = null;
    
    this.doctorService.getPatientHistory(patientId).subscribe({
      next: (data) => {
        // Sort descending by date if it's not already
        this.selectedPatientHistory = data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdOn || a.CreatedOn).getTime();
          const dateB = new Date(b.createdOn || b.CreatedOn).getTime();
          return dateB - dateA;
        });
        this.isHistoryLoading = false;
      },
      error: (err) => {
        console.error('Failed to load patient history', err);
        this.isHistoryLoading = false;
      }
    });
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedPatientHistory = null;
    this.selectedPatientName = '';
  }
}
