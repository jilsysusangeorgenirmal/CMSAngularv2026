import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { FilterPatientsPipe } from '../../pipes/filter-patients-pipe';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule,NgxPaginationModule, HeaderDashboard, FilterPatientsPipe],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientList {
  //declare variable
  searchTerm: string='';
  
//Pagination variables
  p: number =1;             //current page
  itemsPerPage: number = 7; // records per page
  
  //Inject the service
  //constructor intialised
  //DI Service
  constructor(public patientService: PatientService, public router:Router, 
    public appointmentService: AppointmentService) {

    console.log('PatientListComponent initialised');
  }

  //method ngOnInit called as soon as constructor is initialised. calling restAPI
  // Life cycle Hook -  Called when component loads
  ngOnInit():void{  //when created
    this.patientService.getAllPatients();
  }

  ngOnDestroy():void{ // destroy when angular is closed or when redirecting to another component
    console.log("Destruction is being done!");
  }

  //Edit patient
  editPatient(selectedPatient:Patient):void{
    console.log(selectedPatient);

    //Call Populate Patient
    this.populatePatientData(selectedPatient);

    //Route to Edit Component
    this.router.navigate(['patients/edit/' + selectedPatient.PatientId]);
  }

  //Getting Patient for populating patient data
  populatePatientData(selectedPatient: Patient) {
    console.log("Populating");
    console.log(selectedPatient);

    //Transform Date FOrmat as yyyy-MM-dd
    var datePipe = new DatePipe("en-UK");

    let formattedDate: any =datePipe.transform(selectedPatient.Dob,"yyyy-MM-dd");
    selectedPatient.Dob =  formattedDate;

    //populating patient result into the service layer to send to rest API
    this.patientService.patient = {...selectedPatient};
  }

  // //DELETE patient- soft delete
  // deleteEmployee(selectedPatient:Patient):void{
  //   console.log(selectedPatient);
  // }

  searchPatient():void{
    console.log('search and filter result Patient');
  }

  addAppointment(selectedPatient: Patient): void {

  let fullName = selectedPatient.FirstName + " " + selectedPatient.LastName;

  this.appointmentService.appointment.PatientName = fullName;
  this.appointmentService.appointment.PatientId = selectedPatient.PatientId;

  console.log(fullName);

  this.router.navigate(['appointments/add']);
}

}