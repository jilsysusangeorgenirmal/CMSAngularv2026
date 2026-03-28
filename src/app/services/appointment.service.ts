import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Doctors } from '../models/doctors';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  //declare variables
  appointment: Appointment = new Appointment();
  appointments: Appointment[] = [];
  doctors: Doctors[] = [];

  //constructor
  //inject httpClient to call http methods
  constructor(private httpClient:HttpClient) {

  }

  // 1-Get All Appointments
  getAllAppointments(): void{
    // htts://localhost:7290/api/Appointment
    // environment.apiUrl+Appointment
    this.httpClient.get<any>(environment.apiUrl + 'Appointment').subscribe({
        next: response =>{                        // sucess
          this.appointments= response;
          console.log('Appointments:', response);
        },
        error: error => console.log('Custom Error:', error), // failure --Error
        complete:() => console.log('Request complete')    //completion
    });
  }

  //2-Get Departments
  getAllDoctors():Observable<Doctors[]>{//it returns a stream of data (Observable)
    return this.httpClient.get<any>(
      environment.apiUrl + 'Appointment/doctors' //Eventually emits an array of Department
    ).pipe(
    map((res:any) => res ?? []), 
    map((docs:Doctors[]) => {  // docs= res
      this.doctors = docs; //store in service
      return docs;       //also return
    })
    );
  }

  //3-Insert Appointment
  insertAppointment(appointment:Appointment):Observable<any> {
    return this.httpClient.post(environment.apiUrl + 'Appointment', appointment);
  }

  //4-Update Appointment-- Observable--Subscriber
  updateAppointment(appointment:Appointment):Observable<any> {
    return this.httpClient.put(
      environment.apiUrl + 'Appointment/'+ appointment.AppointmentId, appointment);
  }

  //5-Generate Bill Endpoint
  generateConsultationBillService(appointmentId: number): Observable<any> {
    // Calling GET /api/Appointment/consulatation_bill?appointmentId=XYZ
    return this.httpClient.get<any>(environment.apiUrl + 'Appointment/' + 
      'consultation_bill/' + appointmentId);
  }

}
