export type EmailDeliveryStatus = 
  | 'PENDING' 
  | 'SENT' 
  | 'DELIVERED' 
  | 'OPENED' 
  | 'BOUNCED' 
  | 'COMPLAINED';

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'ATTENDED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export interface EmailDelivery {
  status: EmailDeliveryStatus;
  deliveredAt?: string;
  openedAt?: string;
  bouncedAt?: string;
  bounceReason?: string;
}

export interface WhatsappFallback {
  status: 'NONE' | 'SENT' | 'FAILED';
  channel?: string;
  messageSid?: string;
  sentAt?: string;
  error?: string;
}

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  healthInsurance?: string;
  affiliateNumber?: string;
  allergies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientId: Patient | string;
  patientName?: string;
  dateTime: string;
  durationMinutes: number;
  reason?: string;
  status: AppointmentStatus;
  emailDelivery: EmailDelivery;
  whatsappFallback?: WhatsappFallback;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  chiefComplaint?: string;
  clinicalNotes: string;
  treatment?: string;
  createdAt: string;
}

export interface PatientDocument {
  _id: string;
  patientId: string;
  name: string;
  fileType: 'image' | 'pdf' | 'other';
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  category: 'LAB_RESULT' | 'IMAGING' | 'PRESCRIPTION' | 'GENERAL_NOTE';
  uploadedAt: string;
  url?: string;
}
