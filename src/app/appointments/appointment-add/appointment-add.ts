import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderDashboard],
  templateUrl: './appointment-add.html',
  styleUrl: './appointment-add.css',
})
export class AppointmentAdd {
  //Declare variables
  appointment:Appointment = new Appointment();
  PatientName:string='';
  minDate: string = '';
  maxDate: string = '';
  timeSlots: { value: string, text: string, disabled: boolean }[] = [];

  //service and router injection
  constructor(public appointmentService :AppointmentService, private router:Router, 
    private toastr:ToastrService) 
  {

  }

  //Life cycle Hook
  ngOnInit(){
    //get all doctors for dropdown box
    this.loadDoctors(); 

    // Assign full object (IMPORTANT)
  this.appointment = this.appointmentService.appointment;

  console.log(this.appointment);

    // Set min and max dates based on local time
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    this.minDate = formatDate(today);
    this.maxDate = formatDate(tomorrow);

    // Initialize time slots
    this.updateTimeSlots();
  }

  // Update time slots based on selected date and current time
  updateTimeSlots() {
    this.timeSlots = [];
    const now = new Date();
    // Default to today if AppointmentDate is not yet set
    const selectedDateStr = this.appointment.AppointmentDate || this.minDate;
    const isToday = selectedDateStr === this.minDate;

    // From 09:00 to 18:00 (9 AM to 6 PM)
    for (let h = 9; h <= 18; h++) {
      for (let m of [0, 30]) {
        if (h === 18 && m === 30) continue; // Stops at 6:00 PM

        const timeString24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const displayHr = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        const amPm = h >= 12 ? 'PM' : 'AM';
        const displayTime = `${String(displayHr).padStart(2, '0')}:${String(m).padStart(2, '0')} ${amPm}`;

        let disabled = false;
        if (isToday) {
          if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())) {
            disabled = true;
          }
        }

        this.timeSlots.push({ value: timeString24, text: displayTime, disabled });
      }
    }

    // Auto-clear selection if it is now disabled
    if (this.appointment.AppointmentTime) {
      const selectedSlot = this.timeSlots.find(s => s.value === this.appointment.AppointmentTime);
      if (selectedSlot && selectedSlot.disabled) {
        this.appointment.AppointmentTime = '';
      }
    }
  }

  //Submit form
  OnSubmit(appointmentForm: NgForm){
    console.log(appointmentForm.value);

    //call method for INSERT
    this.addAppointment(appointmentForm);

  }

  //Get all Doctors-- select dropdown box doctors names
  loadDoctors():void{
    if(this.appointmentService.doctors.length === 0){
      this.appointmentService.getAllDoctors().subscribe();
    }
  }

  //Insert Method
  addAppointment(appointmentForm:NgForm):void{
    if (appointmentForm.invalid || this.appointment.DoctorId == 0) {
       this.toastr.warning('Please fill all required dropdowns correctly!', 'Validation Failed');
       return;
    }

    console.log("Form values:", appointmentForm.value);
    console.log("Full appointment object:", this.appointment);

    // Prepare robust payload for C# REST API instead of raw form values
    const payload = Object.assign(new Appointment(), this.appointment);
    
    // Ensure numbers for IDs (dropdowns return strings) and map defaults
    payload.DoctorId = Number(this.appointment.DoctorId);
    
    // Fetch PatientId from the shared service object if it wasn't on the HTML form
    payload.PatientId = Number(this.appointment.PatientId || this.appointmentService.appointment.PatientId);
    
    // Changing default status from 'Booked' to 'Scheduled' to allow Bill Generation (SP requirement)
    payload.Status = 'Scheduled';
    payload.IsActive = true;

    // C# 'TimeOnly' deserializer strictly expects 'HH:mm:ss' format in STJ
    if (payload.AppointmentTime && payload.AppointmentTime.length === 5) {
      payload.AppointmentTime += ':00';
    }

    console.log("Sending payload to API:", payload);
    delete (payload as any).TokenNo;

    this.appointmentService.insertAppointment(payload).subscribe(
      {
        next:(response: any) =>{
          console.log('Message', response);

          this.toastr.success('Appointment booked successfully!', 'CMS v2026');

          // DEEP CLEAN: Wipe the global service memory and local form rigorously. 
          // Retaining stale data in the singleton object was corrupting the second payload!
          this.appointmentService.appointment = new Appointment();
          appointmentForm.resetForm();

          // Redirect to list natively
          this.router.navigate(['/appointments/list']);
        },
        error:(err:any) =>{
          console.log('Error booking appointment', err);
          
          // Friendly formatted error extraction without huge JSON blocks!
          let failureReason = 'Check your input parameters.';
          if (err.error && err.error.title) {
              failureReason = err.error.title; 
          } else if (typeof err.error === 'string') {
              failureReason = err.error;
          }
          
          this.toastr.error('API Rejected - ' + failureReason, 'CMS v2026', { timeOut: 8000 });
        }
      });

  }

}