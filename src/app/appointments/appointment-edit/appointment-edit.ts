import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderDashboard],
  templateUrl: './appointment-edit.html',
  styleUrl: './appointment-edit.css',
})
export class AppointmentEdit implements OnInit {
  // Declare variables
  appointment: Appointment = new Appointment();
  minDate: string = '';
  maxDate: string = '';
  timeSlots: { value: string, text: string, disabled: boolean }[] = [];

  constructor(
    public appointmentService: AppointmentService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadDoctors();

    // Assign from Service (Clone to avoid modifying list state prior to actual DB save)
    this.appointment = { ...this.appointmentService.appointment };

    // Backend provides time with seconds "HH:mm:ss", but UI dropdown requires "HH:mm"
    if (this.appointment.AppointmentTime && this.appointment.AppointmentTime.length === 8) {
        this.appointment.AppointmentTime = this.appointment.AppointmentTime.substring(0, 5);
    }

    // Backend might provide datetime string "yyyy-MM-ddT...", but <input type="date"> requires "yyyy-MM-dd"
    if (this.appointment.AppointmentDate && this.appointment.AppointmentDate.includes('T')) {
        this.appointment.AppointmentDate = this.appointment.AppointmentDate.split('T')[0];
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    // Calculate dates
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    this.minDate = todayStr;
    this.maxDate = tomorrowStr;

    // Expand allowed ranges dynamically if editing an appointment booked far in the past
    if (this.appointment.AppointmentDate && this.appointment.AppointmentDate < this.minDate) {
        this.minDate = this.appointment.AppointmentDate;
    }

    this.updateTimeSlots();
  }

  updateTimeSlots() {
    this.timeSlots = [];
    const now = new Date();
    const selectedDateStr = this.appointment.AppointmentDate || this.minDate;

    // Get strictly formatted today's local date to compare
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const realTodayStr = `${y}-${m}-${d}`;
    
    // Only conditionally disable past times if the selected date strictly equals TODAY 
    const isToday = selectedDateStr === realTodayStr;

    // From 09:00 to 18:00 (9 AM to 6 PM)
    for (let h = 9; h <= 18; h++) {
      for (let min of [0, 30]) {
        if (h === 18 && min === 30) continue; // Stops strictly at 6:00 PM

        const timeString24 = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const displayHr = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const amPm = h >= 12 ? 'PM' : 'AM';
        const displayTime = `${String(displayHr).padStart(2, '0')}:${String(min).padStart(2, '0')} ${amPm}`;

        let disabled = false;
        if (isToday) {
          if (h < now.getHours() || (h === now.getHours() && min <= now.getMinutes())) {
            disabled = true;
          }
        }

        this.timeSlots.push({ value: timeString24, text: displayTime, disabled });
      }
    }
  }

  isInvalidDate(date: any): boolean {
    if (!date) return false;
    const year = new Date(date).getFullYear();
    return year < 1916;
  }

  isFutureDate(date: any): boolean {
    if (!date) return false;
    const selectedDate = new Date(date);
    const maxAllowed = new Date(this.maxDate);
    return selectedDate > maxAllowed;
  }

  loadDoctors(): void {
    if (this.appointmentService.doctors.length === 0) {
      this.appointmentService.getAllDoctors().subscribe();
    }
  }

  editAppointment(appointmentForm: NgForm): void {
    if (appointmentForm.invalid || this.appointment.DoctorId == 0) {
       this.toastr.warning('Please select all required fields correctly!', 'Validation Failed');
       return;
    }

    if (this.isInvalidDate(this.appointment.AppointmentDate)) {
       this.toastr.warning('Year of appointment cannot be earlier than 1916!', 'Validation Failed');
       return;
    }

    if (this.isFutureDate(this.appointment.AppointmentDate)) {
       this.toastr.warning('Appointment date cannot be beyond tomorrow!', 'Validation Failed');
       return;
    }

    console.log("updating...", this.appointment);

    // Prepare robust payload for C# REST API
    const payload = Object.assign(new Appointment(), this.appointment);
    
    // Ensure numbers strictly for numeric fields and capture unbinding fallbacks
    payload.DoctorId = Number(this.appointment.DoctorId);
    payload.PatientId = Number(this.appointment.PatientId || this.appointmentService.appointment.PatientId);

    // Ensure C# 'TimeOnly' deserializer strictly receives 'HH:mm:ss'
    if (payload.AppointmentTime && payload.AppointmentTime.length === 5) {
      payload.AppointmentTime += ':00';
    }

    // Call update method on Service
    this.appointmentService.updateAppointment(payload).subscribe({
      next: (response: any) => {
        console.log('Update Complete', response);
        this.toastr.success('Appointment updated successfully!', 'CMS v2026');
        this.router.navigate(['/appointments/list']);
        appointmentForm.reset();
      },
      error: (errMessage: any) => {
        console.log('Error updating appointment', errMessage);
        this.toastr.error('Sorry: Failed to update appointment!', 'CMS v2026');
      }
    });
  }
}

