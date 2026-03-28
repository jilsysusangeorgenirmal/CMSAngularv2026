import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
import { HeaderDashboard } from '../../auth/header-dashboard/header-dashboard';
import { FilterAppointmentsPipe } from '../../pipes/filter-appointments-pipe-pipe';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-appointment-list',
  standalone:true,
  imports: [CommonModule,FormsModule, RouterModule,NgxPaginationModule, 
    HeaderDashboard, FilterAppointmentsPipe],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList {
   //declare variable
  searchTerm: string='';
  
//Pagination variables
p: number =1;             //current page
itemsPerPage: number = 7; // records per page
  
  //Inject the service
  //constructor intialised
  //DI Service
  constructor(public appointmentService: AppointmentService, public router:Router) {
    console.log('AppointmentListComponent initialised');
  }

  //method ngOnInit called as soon as constructor is initialised. calling restAPI
  // Life cycle Hook -  Called when component loads
  ngOnInit():void{  //when created
    this.appointmentService.getAllAppointments();
  }

  ngOnDestroy():void{ // destroy when angular is closed or when redirecting to another component
    console.log("Destruction is being done!");
  }

  //Edit appointment
  editAppointment(selectedAppointment:Appointment):void{
    console.log(selectedAppointment);

    //Call Populate appointment
    this.populateAppointmentData(selectedAppointment);

    //Route to Edit Component
    this.router.navigate(['appointments/edit/' + selectedAppointment.AppointmentId]);
  }

  //Getting appointment for populating appointment data
  populateAppointmentData(selectedAppointment: Appointment) {
    console.log("Populating");
    console.log(selectedAppointment);

    //Transform Date FOrmat as yyyy-MM-dd
    var datePipe = new DatePipe("en-UK");

    let formattedDate: any =datePipe.transform(selectedAppointment.AppointmentDate,"yyyy-MM-dd");
    selectedAppointment.AppointmentDate =  formattedDate;

    //populating appointment result into the service layer to send to rest API
    this.appointmentService.appointment = {...selectedAppointment};
  }

  //DELETE appointment- soft delete
  deleteAppointment(selectedAppointment:Appointment):void{
    console.log('Cancelling appointment:', selectedAppointment);
    
    if (confirm('Are you sure you want to cancel this appointment?')) {
      // Create payload to prevent immediate UI mutation before DB success
      const payload = Object.assign(new Appointment(), selectedAppointment);
      
      // Implement Soft Delete as Requested:
      payload.Status = 'Cancelled';
      payload.IsActive = true; 
      
      // Ensure backend-compatible types just like in Add/Edit
      var datePipe = new DatePipe("en-UK");
      payload.AppointmentDate = datePipe.transform(payload.AppointmentDate, "yyyy-MM-dd") || '';

      if (payload.AppointmentTime && payload.AppointmentTime.length === 5) {
        payload.AppointmentTime += ':00';
      } else if (payload.AppointmentTime && payload.AppointmentTime.length === 8) {
        // Already formatted properly
      }

      // Call API Update
      this.appointmentService.updateAppointment(payload).subscribe({
        next: (response: any) => {
          console.log('Cancellation successful', response);
          // Refresh the list visually
          this.appointmentService.getAllAppointments();
        },
        error: (errMessage: any) => {
          console.log('Error cancelling appointment', errMessage);
          alert('Failed to cancel appointment.');
        }
      });
    }
  }

  searchAppointment():void{
    console.log('search appointments');
  }

  addAppointment():void{
    console.log('add appointment');
  }

  //Generate PDF Bill
  generateBill(appointment: Appointment): void {
    console.log("Requesting Bill for APT-", appointment.AppointmentId);
    
    this.appointmentService.generateConsultationBillService(appointment.AppointmentId).subscribe({
      next: (billData: any) => {
        console.log("Consultation Bill Received: ", billData);
        // Create new PDF layout dynamically
        const doc = new jsPDF();

        // Draw Headers
        doc.setFontSize(22);
        doc.setTextColor(26, 111, 196); // Matching CMS Theme Blue
        doc.text('Wellness Clinic', 14, 22);

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Consultation Invoice', 14, 32);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice No: BILL-${billData.ConsultationBillId}`, 14, 45);
        
        // Formatting Dates
        let datePipe = new DatePipe("en-UK");
        let formattedDate = datePipe.transform(billData.AppointmentDate, "dd-MMM-yyyy") || '';
        let todayDate = datePipe.transform(new Date(), "dd-MMM-yyyy") || '';

        doc.text(`Date of Issue: ${todayDate}`, 14, 52);
        doc.text(`Appointment Date: ${formattedDate}`, 14, 59);

        // Patient / Doctor Metadata
        doc.text(`Patient: ${billData.PatientName} (MRN: ${billData.PatientId})`, 14, 72);
        doc.text(`Consultant Doctor: Dr. ${billData.DoctorName}`, 14, 79);

        // Consultation Billing Table Using AutoTable
        autoTable(doc, {
          startY: 90,
          head: [['Description', 'Status', 'Total Fee']],
          body: [
            ['General Consultation Fee', billData.PaymentStatus, `$${billData.ConsultationFee}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [26, 111, 196] }, // Matching Theme Header
        });

        // Appending Footer below Table
        let finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for choosing Wellness Clinic.', 14, finalY);
        doc.text('For queries, please contact billing@wellnessclinic.com', 14, finalY + 7);

        // Save PDF to system disk mapped to AppointmentID
        doc.save(`Invoice_APT-${appointment.AppointmentId}.pdf`);
      },
      error: (err: any) => {
        console.log('Error generating bill', err);
        // Extract exact C# Web API error context smoothly
        let trace = '';
        if (err.error) {
            trace = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } else {
            trace = err.message;
        }
        alert('Server API Rejected Bill Creation. Reason: ' + trace);
      }
    });
  }

}