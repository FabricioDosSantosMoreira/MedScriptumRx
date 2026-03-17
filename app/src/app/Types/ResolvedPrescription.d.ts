import { PrescriptionData } from '@/types/PrescriptionData';
import { ClientData } from '@/types/ClientData';

export type ResolvedPrescription = { 
  client: ClientData; 
} & PrescriptionData;
