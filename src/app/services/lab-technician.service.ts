import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  LabTestCategory, 
  LabTest, 
  PendingPrescriptionDto, 
  LabTestPrescription, 
  LabTestResult, 
  PatientLabReportDto, 
  LabBill,
  CompletedPrescriptionDto
} from '../models/lab-technician';

@Injectable({
  providedIn: 'root'
})
export class LabTechnicianService {
  // Replace with your actual environment API URL, e.g. environment.apiUrl + '/api/LabTechnician'
  // using string for now, please ensure environment has apiUrl.
  private apiUrl = 'https://localhost:7290/api/LabTechnician';

  constructor(private http: HttpClient) {}

  getAllLabTestCategories(): Observable<LabTestCategory[]> {
    return this.http.get<LabTestCategory[]>(`${this.apiUrl}/categories`);
  }

  getAllLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/labtests`);
  }

  getPendingPrescriptions(): Observable<PendingPrescriptionDto[]> {
    return this.http.get<PendingPrescriptionDto[]>(`${this.apiUrl}/pending`);
  }

  getPrescribedTests(prescriptionId: number): Observable<LabTestPrescription[]> {
    return this.http.get<LabTestPrescription[]>(`${this.apiUrl}/prescription/${prescriptionId}`);
  }

  addLabTestResult(labTestPrescriptionId: number, result: LabTestResult): Observable<LabTestResult> {
    return this.http.post<LabTestResult>(`${this.apiUrl}/add-result/${labTestPrescriptionId}`, result);
  }

  generateLabBill(prescriptionId: number): Observable<LabBill> {
    return this.http.post<LabBill>(`${this.apiUrl}/generate-bill/${prescriptionId}`, {});
  }

  getLabReport(prescriptionId: number): Observable<PatientLabReportDto[]> {
    return this.http.get<PatientLabReportDto[]>(`${this.apiUrl}/report/${prescriptionId}`);
  }

  getCompletedPrescriptions(): Observable<CompletedPrescriptionDto[]> {
    return this.http.get<CompletedPrescriptionDto[]>(`${this.apiUrl}/completed`);
  }
}
