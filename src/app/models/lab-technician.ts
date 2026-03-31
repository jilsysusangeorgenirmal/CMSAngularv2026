export interface LabTestCategory {
  CategoryId: number;
  CategoryName: string;
  Description?: string;
  IsActive: boolean;
  CreatedOn: Date;
}

export interface LabTest {
  LabTestId: number;
  TestName: string;
  CategoryId: number;
  NormalRange?: string;
  Price: number;
  IsActive: boolean;
  CreatedOn: Date;
  Category?: LabTestCategory;
}

export interface PendingPrescriptionDto {
  LabTestPrescriptionId: number;
  PrescriptionId: number;
  PatientName: string;
  DoctorName: string;
  TestName: string;
  CategoryName: string;
  Price: number;
  Status: string;
}

export interface LabTestPrescription {
  LabTestPrescriptionId: number;
  PrescriptionId: number;
  LabTestId: number;
  Status: string;
  TestDate: Date;
  LabTest?: LabTest;
}

export interface LabTestResult {
  ResultId?: number;
  LabTestPrescriptionId: number;
  ResultValue: string;
  ResultSummary?: string;
  Remarks?: string;
  ResultDate: Date;
  StaffId: number;
}

export interface PatientLabReportDto {
  LabReportId?: number;
  LabBillId?: number;
  LabTestPrescriptionId: number;
  PrescriptionId: number;
  PatientId: number;
  PatientName?: string;
  DoctorId: number;
  DoctorName?: string;
  LabTestId: number;
  LabTestName?: string;
  NormalRange?: string;
  Price?: number;
  ResultSummary?: string;
  ResultValue: string;
  Remarks?: string;
  ResultDate: Date;
  ReportDate?: Date;
  Symptoms?: string;
  Diagnosis?: string;
}

export interface LabBill {
  LabBillId: number;
  PrescriptionId: number;
  TotalAmount: number;
  BillingDate: Date;
  PaymentStatus: string;
}

export interface CompletedPrescriptionDto {
  LabTestPrescriptionId: number;
  PrescriptionId: number;
  PatientId: number;
  PatientName: string;
  DoctorName: string;
  TestName: string;
  ResultValue: string;
  Remarks: string;
  ResultDate: Date;
}
