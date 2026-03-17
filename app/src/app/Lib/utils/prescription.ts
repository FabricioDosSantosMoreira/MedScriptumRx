import { handleAPIResponse } from '../utils';
import { PrescriptionData } from '@/app/Types/!Index';


type PrescriptionPayload = Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>;

const API_BASE: string = '/Api/Prescriptions';
export const allowedPrescriptionDataPropertiesOnChange = [
  'uniqueID', 
  'clientUniqueID',
  'internalSystemID',

  'products', 
  'productsTotalCost', 
 
  'finalPrice',
  'deliveryCost',  
  'hasDeliveryCost',

  'isActive',
  'isSingle',
  'isPayed',
  'args',
] as const;


export async function getPrescriptions(): Promise<PrescriptionData[]> {
  const res = await fetch(API_BASE, { method: 'GET' });
  return handleAPIResponse<PrescriptionData[]>(res);
}


// TODO: Needs API Implementation
export async function getPrescription(uniqueID: string): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'GET' });
  return handleAPIResponse<PrescriptionData>(res);
}


export async function createPrescription(payload: PrescriptionPayload): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}`,  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<PrescriptionData>(res);
}


export async function updatePrescription(uniqueID: string, payload: PrescriptionPayload): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<PrescriptionData>(res);
}


export async function deletePrescription(uniqueID: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'DELETE' });
  return handleAPIResponse<{ ok: boolean; message?: string }>(res);
}


export async function archivePrescription(uniqueID: string): Promise<PrescriptionData> {
  // 1) fetch single prescription (handleAPIResponse already unwraps the payload)
  const prescription = await getPrescription(uniqueID);

  if (!prescription) {
    throw new Error('Prescription not found');
  }

  // 2) prepare payload matching PrescriptionPayload (omit uniqueID / createdAt / updatedAt)
  const { uniqueID: _u, createdAt: _ca, updatedAt: _ua, ...rest } = prescription;
  const payload = {
    ...rest,
    isActive: false,
  };

  // 3) call PUT and return the handled API response (same pattern as update/create)
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleAPIResponse<PrescriptionData>(res);
}