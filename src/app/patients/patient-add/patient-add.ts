import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';


@Component({
  selector: 'app-patient-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderDashboard],
  templateUrl: './patient-add.html',
  styleUrl: './patient-add.css',
})
export class PatientAdd {
  //Declare variables
  patient:Patient = new Patient();

  //service and router injection
  constructor(public patientService :PatientService, private router:Router, private toastr: ToastrService
    ) 
  {

  }

  //Life cycle Hook
  ngOnInit(){
    if (this.patientService.patients.length === 0) {
      this.patientService.getAllPatients();
    }
  }

  //Submit form
  OnSubmit(patientForm: NgForm){
    console.log(patientForm.value);

    //call method for INSERT
    this.addPatient(patientForm);

  }

  //Insert Method
  addPatient(patientForm:NgForm):void{
    if (patientForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly!', 'Validation Failed');
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

    // --- DUPLICATE CHECK LOGIC ---
    if (age >= 18) {
      const emailInput = patientForm.value.Email ? patientForm.value.Email.trim().toLowerCase() : '';
      const phoneInput = patientForm.value.Phone ? patientForm.value.Phone.trim() : '';

      if (emailInput || phoneInput) {
        const isDuplicate = this.patientService.patients.some(p => {
          const pEmail = p.Email ? p.Email.trim().toLowerCase() : '';
          const pPhone = p.Phone ? p.Phone.trim() : '';
          
          return (emailInput && pEmail === emailInput) || (phoneInput && pPhone === phoneInput);
        });

        if (isDuplicate) {
          this.toastr.error('Duplicate record exists! Email or Phone number is already registered for an patient.', 'Validation Failed');
          return; // Stop the insertion!
        }
      }
    }
    // -----------------------------

    //sending and displaying in console
    console.log("inserting...");
    this.patientService.insertPatient(patientForm.value).subscribe(
      {
        next:(response: any) =>{
          console.log('Message', response);

          this.toastr.success('Patient added successfully!', 'CMS v2026');

          //Redirect to list
          this.router.navigate(['/patients/list']);

          //Reset form
          patientForm.reset();
        },
        error:(errMessage:any) =>{
          console.log('Error adding patient', errMessage);
          this.toastr.error('Sorry: Failed to add patient!', 'CMS v2026')
        }
      });

  }

}
