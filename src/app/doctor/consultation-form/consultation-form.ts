import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultation-form.html',
  styleUrl: './consultation-form.css'
})
export class ConsultationForm implements OnInit {
  @Input() appointment: any;
  @Output() closeEvent = new EventEmitter<void>();

  consultationForm!: FormGroup;
  labTestForm!: FormGroup;
  medicineForm!: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';

  availableMedicines = [
    { id: 700, name: 'Paracetamol' },
    { id: 701, name: 'Amoxicillin' },
    { id: 702, name: 'Benadryl' },
    { id: 703, name: 'Diclofenac' },
    { id: 704, name: 'Ciplox' },
    { id: 705, name: 'Ciplox' },
    { id: 706, name: 'Azithromycin' },
    { id: 707, name: 'Omeprazole' },
    { id: 708, name: 'Cough Syrup DX' },
    { id: 709, name: 'Insulin Injection' },
    { id: 710, name: 'Ibuprofen' }
  ];

  availableLabTests = [
    { id: 1200, name: 'Complete Blood Count' },
    { id: 1201, name: 'Hemoglobin Test' },
    { id: 1202, name: 'Urine Routine' },
    { id: 1203, name: 'X-Ray Chest' },
    { id: 1204, name: 'ECG' },
    { id: 1205, name: 'Liver Function Test' },
    { id: 1206, name: 'Kidney Function Test' }
  ];

  constructor(private fb: FormBuilder, private doctorService: DoctorService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    if (this.appointment._state) {
        this.consultationForm = this.appointment._state.cForm;
        this.labTestForm = this.appointment._state.lForm;
        this.medicineForm = this.appointment._state.mForm;
        this.successMessage = this.appointment._state.sMsg || '';
    } else {
        this.consultationForm = this.fb.group({
          symptoms: ['', [Validators.required, Validators.minLength(3)]],
          diagnosis: ['', [Validators.required, Validators.minLength(3)]],
          advice: ['', Validators.required]
        });

        this.labTestForm = this.fb.group({
          tests: this.fb.array([])
        });

        this.medicineForm = this.fb.group({
          medicines: this.fb.array([])
        });
        
        this.appointment._state = {
          cForm: this.consultationForm,
          lForm: this.labTestForm,
          mForm: this.medicineForm,
          sMsg: ''
        };
        
        // Populate if already completed and opened freshly
        const status = this.appointment.Status || this.appointment.status;
        if (status === 'Completed') {
            if (this.appointmentService.doctors.length === 0) {
               this.appointmentService.getAllDoctors().subscribe(() => this.loadExistingConsultation());
            } else {
               this.loadExistingConsultation();
            }
        }
    }
  }

  private getDoctorId(): number {
    const user = localStorage.getItem('USER_NAME')?.toLowerCase() || '';
    const nameMatch = user.replace('.doc', '').trim();
    
    if (this.appointmentService.doctors && this.appointmentService.doctors.length > 0) {
        const matchedDoc = this.appointmentService.doctors.find(d => d.Name.toLowerCase().includes(nameMatch));
        if (matchedDoc) {
           return matchedDoc.DoctorId;
        }
    }

    if (user === 'meera.doc') return 201;
    if (user === 'vivek.doc') return 202;
    return 200; // arjun.doc or default
  }

  loadExistingConsultation() {
      const patientId = this.appointment.PatientId || this.appointment.patientId;
      if (!patientId) {
          console.error("No patientId available to fetch full consultation history.");
          return;
      }

      this.doctorService.getPatientHistory(patientId).subscribe({
         next: (data: any[]) => {
            const apptId = this.appointment.AppointmentId || this.appointment.appointmentId;
            const existing = data.find((c: any) => c.appointmentId === apptId || c.AppointmentId === apptId);
            
            if (existing) {
                // Populate Core
                this.consultationForm.patchValue({
                   symptoms: existing.symptoms || existing.Symptoms,
                   diagnosis: existing.diagnosis || existing.Diagnosis,
                   advice: existing.advice || existing.Advice
                });

                // Populate Medicines
                const meds = existing.medicinePrescriptions || existing.MedicinePrescriptions || existing.medicines || existing.Medicines;
                if (meds && Array.isArray(meds)) {
                    // Clear empty array first if any
                    while (this.medicinesArray.length) {
                       this.medicinesArray.removeAt(0);
                    }
                    meds.forEach((m: any) => {
                       const medIdRaw = m.medicineId || m.MedicineId;
                       const medId = medIdRaw ? Number(medIdRaw) : '';
                       const medGroup = this.fb.group({
                          medicineId: [medId, Validators.required],
                          dosage: [m.dosage || m.Dosage || '', Validators.required],
                          duration: [m.duration || m.Duration || '', Validators.required],
                          instructions: [m.instructions || m.Instructions || '']
                       });
                       this.medicinesArray.push(medGroup);
                    });
                }

                // Populate Lab Tests
                const tests = existing.labTestPrescriptions || existing.LabTestPrescriptions || existing.labTests || existing.LabTests || existing.labtests || existing.Labtests;
                if (tests && Array.isArray(tests)) {
                    // Clear empty array first if any
                    while (this.testsArray.length) {
                       this.testsArray.removeAt(0);
                    }
                    tests.forEach((t: any) => {
                       const testIdRaw = t.labTestId || t.LabTestId;
                       const testId = testIdRaw ? Number(testIdRaw) : '';
                       const testGroup = this.fb.group({
                          labTestId: [testId, Validators.required],
                          notes: [t.notes || t.Notes || '']
                       });
                       this.testsArray.push(testGroup);
                    });
                }
            }
         },
         error: (err) => console.error('Failed to fetch existing consultation:', err)
      });
  }

  get testsArray() {
    return this.labTestForm.get('tests') as FormArray;
  }

  get medicinesArray() {
    return this.medicineForm.get('medicines') as FormArray;
  }

  // Combined Submission Flow
  submitAllAndComplete() {
    if (this.consultationForm.invalid) return;

    const payload = {
      appointmentId: this.appointment.AppointmentId || this.appointment.appointmentId,
      symptoms: this.consultationForm.value.symptoms,
      diagnosis: this.consultationForm.value.diagnosis,
      advice: this.consultationForm.value.advice
    };

    this.doctorService.addConsultation(payload).subscribe({
      next: (res) => {
        const presId = res.prescriptionId || res.PrescriptionId || res.id || 1; 

        // Add dynamically selected Medicines
        const meds = this.medicinesArray.value;
        meds.forEach((m: any) => {
          this.doctorService.addMedicine({
            prescriptionId: presId,
            medicineId: m.medicineId,
            dosage: m.dosage,
            duration: m.duration,
            instructions: m.instructions
          }).subscribe();
        });

        // Add dynamically selected Lab Tests
        const tests = this.testsArray.value;
        tests.forEach((t: any) => {
          this.doctorService.addLabTest({
            prescriptionId: presId,
            labTestId: t.labTestId,
            notes: t.notes
          }).subscribe();
        });
        
        // Mark the entire appointment as Completed
        this.doctorService.updateAppointmentStatus(payload.appointmentId, 'Completed').subscribe({
           next: () => {
              // Mutate dashboard reference visually
              if (this.appointment.Status) this.appointment.Status = 'Completed';
              if (this.appointment.status) this.appointment.status = 'Completed';
              
              this.successMessage = 'Consultation successfully saved and marked as Complete!';
              this.appointment._state.sMsg = this.successMessage;
              
              // Automatically close form to return to dashboard
              this.closeForm();
           }
        });

      },
      error: (err) => {
         this.errorMessage = 'Failed to save consultation details.';
         console.error(err);
      }
    });
  }

  // Lab Tests Methods
  addTest() {
    const testGroup = this.fb.group({
      labTestId: ['', Validators.required],
      notes: ['']
    });
    this.testsArray.push(testGroup);
  }

  removeTest(index: number) {
    this.testsArray.removeAt(index);
  }

  // Medicines Methods
  addMedicine() {
    const medGroup = this.fb.group({
      medicineId: ['', Validators.required],
      dosage: ['', Validators.required],
      duration: ['', Validators.required],
      instructions: ['']
    });
    this.medicinesArray.push(medGroup);
  }

  removeMedicine(index: number) {
    this.medicinesArray.removeAt(index);
  }

  closeForm() {
    this.closeEvent.emit();
  }
}
