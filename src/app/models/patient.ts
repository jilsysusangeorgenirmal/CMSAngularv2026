export class Patient {
  PatientId: number = 0;
  FirstName: string = '';
  LastName: string = '';
  Gender: string = '';
  Dob: Date = new Date();        
  Age: number = 0;
  Phone: string = '';
  Address: string = '';
  Email: string = '';
  CreatedOn:Date = new Date();
  IsActive: boolean = true;

}
