export class Appointment {
  AppointmentId: number = 0;
  AppointmentDate: string = '';
  AppointmentTime: string = '';
  TokenNo?: number = 0;
  Status: string = '';
  PatientId: number = 0;
  PatientName:string='';
  DoctorId: number = 0;
  DoctorName: string='';
  CreatedOn:Date = new Date();
  IsActive: boolean = true;

}