import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../models/appointment';

@Pipe({
  name: 'filterAppointmentsPipe',
  standalone: true
})
export class FilterAppointmentsPipe implements PipeTransform {

  transform(appointments: Appointment[], searchTerm: string): Appointment[] {

    if (!appointments || !searchTerm) return appointments;

    searchTerm = searchTerm.toLowerCase();

    return appointments.filter(appointment => {

      const fullName = appointment.PatientName?.toString().trim() || '';
      const nameParts = fullName.split(/\s+/);

      const firstName = nameParts[0]?.toLowerCase() || '';
      const lastName = nameParts.length > 1 
        ? nameParts.slice(1).join(' ').toLowerCase() 
        : '';

      return (
        appointment.AppointmentId.toString().includes(searchTerm) ||
        appointment.PatientId.toString().includes(searchTerm) ||
        fullName.toLowerCase().includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm)
      );
    });
  }
}