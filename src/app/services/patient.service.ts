import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  //declare variables
  patient: Patient = new Patient();
  patients: Patient[] = [];

  //constructor
  //inject httpClient to call http methods
  constructor(private httpClient:HttpClient) {

  }

  // 1-Get All Patients
  getAllPatients(): void{
    // htts://localhost:7290/api/Patient
    // environment.apiUrl+Patient
    this.httpClient.get<any>(environment.apiUrl + 'Patient').subscribe({
        next: response =>{                        // sucess
          this.patients= response;
          //here
          console.log('Patient:', response);
        },
        error: error => console.log('Custom Error:', error), // failure --Error
        complete:() => console.log('Request complete')    //completion
    });
  }

  // Helper method for combining observables
  getPatientsData(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiUrl + 'Patient');
  }

  //3-Insert Patient
  insertPatient(patient:Patient):Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Patient', patient);
  }

  //4-Update Patient-- Observable--Subscriber
  updatePatient(patient:Patient):Observable<any> {
    return this.httpClient.put(
      environment.apiUrl + 'Patient/'+ patient.PatientId, patient);
  }

}
