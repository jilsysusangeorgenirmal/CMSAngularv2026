import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DiagnosisPrescription, LabTestPrescription, MedicinePrescription, ConsultationHistory } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) {}

  getTodayAppointments(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + 'Doctor/today-appointments/' + doctorId
    );
  }

  getConsultations(doctorId: number): Observable<ConsultationHistory[]> {
    return this.http.get<ConsultationHistory[]>(
      environment.apiUrl + 'Doctor/consultations/' + doctorId
    );
  }

  getPatientHistory(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + 'Doctor/patient-history/' + patientId
    );
  }

  addConsultation(data: DiagnosisPrescription): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + 'Doctor/add-consultation', data
    );
  }

  addLabTest(data: LabTestPrescription): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + 'Doctor/add-labtest', data
    );
  }

  addMedicine(data: MedicinePrescription): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + 'Doctor/add-medicine', data
    );
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    return this.http.patch<any>(
      environment.apiUrl + `Doctor/appointment/${appointmentId}/status?status=${status}`, {}
    );
  }
}