export interface DiagnosisPrescription {
    commandId?: number;
    appointmentId: number;
    symptoms: string;
    diagnosis: string;
    advice: string;
    createdOn?: string;
    isActive?: boolean;
}

export interface LabTestPrescription {
    prescriptionId: number;
    labTestId: number;
    notes: string;
    createdOn?: string;
    isActive?: boolean;
}

export interface MedicinePrescription {
    prescriptionId: number;
    medicineId: number;
    dosage: string;
    duration: string;
    instructions: string;
    createdOn?: string;
    isActive?: boolean;
}

export interface ConsultationHistory {
    prescriptionId: number;
    appointmentId: number;
    symptoms: string;
    diagnosis: string;
    advice: string;
    createdOn: string;
    labTests: any[];
    medicines: any[];
    patientName?: string;
    patientId?: number;
    PatientId?: number;
    appointment?: any;
    Appointment?: any;
}
