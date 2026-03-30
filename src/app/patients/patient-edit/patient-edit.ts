import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Patient } from '../../models/patient';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';

@Component({
  selector: 'app-patient-edit',
  standalone:true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderDashboard],
  templateUrl: './patient-edit.html',
  styleUrl: './patient-edit.css',
})
export class PatientEdit {
   //Declare variable
  patient:Patient = new Patient();
  today: string = this.getToday();

  // Helper to restrict numbers and special characters in keypress
  allowLettersOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Allow A-Z, a-z, and space
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 32) {
      return true;
    }
    return false;
  }

  getToday(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  //service and router injection
  constructor(public patientService :PatientService, private router:Router, private toastr:ToastrService) 
  {

  }

  //Life cycle Hook
  ngOnInit(){
    
    //Assign from Service(for populating in the dit form)
    this.patient = {...this.patientService.patient};

  }

  isInvalidDate(dob: any): boolean {
    if (!dob) return false;
    const year = new Date(dob).getFullYear();
    return year < 1916;
  }

  isFutureDate(dob: any): boolean {
    if (!dob) return false;
    const dobDate = new Date(dob);
    const todayDate = new Date();
    dobDate.setHours(0,0,0,0);
    todayDate.setHours(0,0,0,0);
    return dobDate > todayDate;
  }

  //Submit form
  OnSubmit(patientForm: NgForm){
    console.log(patientForm.value);

    //call method for UPDATE
    this.editPatient(patientForm);

  }

  //Update Method
  editPatient(patientForm:NgForm):void{
    if (patientForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly!', 'Validation Failed');
      return;
    }

    if (this.isInvalidDate(patientForm.value.Dob)) {
      this.toastr.warning('Year of birth cannot be earlier than 1916!', 'Validation Failed');
      return;
    }

    if (this.isFutureDate(patientForm.value.Dob)) {
      this.toastr.warning('Date of birth cannot be in the future!', 'Validation Failed');
      return;
    }

     // Convert DOB and calculate Age
    const dob = new Date(patientForm.value.Dob);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    patientForm.value.Age = age;              // set calculated age
    patientForm.value.CreatedOn = new Date(); // today date for CreatedOn
    patientForm.value.IsActive = true;        // always true for IsActive

    console.log("updating...");
    this.patientService.updatePatient(patientForm.value).subscribe(
      {
        next:(response: any) =>{
          console.log('Message', response);
          this.toastr.success('Patient details edited successfully!', 'CMS v2026');
           //Redirect to list
          this.router.navigate(['/patients/list']);

          //Reset form
          patientForm.reset();
          
        },
        error:(errMessage:any) =>{
          console.log('Error adding patient', errMessage);
          this.toastr.error('Sorry: Failed to edit patient!', 'CMS v2026')
        }
      });

  }

}