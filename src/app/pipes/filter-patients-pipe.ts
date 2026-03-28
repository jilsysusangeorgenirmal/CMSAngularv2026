import { Pipe, PipeTransform } from '@angular/core';
import { Patient } from '../models/patient';

@Pipe({
  name: 'filterPatients',
  standalone: true
})
export class FilterPatientsPipe implements PipeTransform {

  transform(patients: Patient[], searchTerm: string): Patient[] {

    if (!patients || !searchTerm) return patients;

    searchTerm = searchTerm.toLowerCase();

    return patients.filter(patient =>
      patient.PatientId.toString().includes(searchTerm) ||
      patient.FirstName.toLowerCase().includes(searchTerm) ||
      patient.LastName.toLowerCase().includes(searchTerm) ||
      (patient.Phone ?? '').includes(searchTerm)
    );
  }

}
