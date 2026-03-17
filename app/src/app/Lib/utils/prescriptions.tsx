import { PrescriptionData } from '@/types/Index';


const API_BASE: string = '/api/prescriptions';


export async function getPrescription(uniqueID: string): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`);
  if (!res.ok) throw new Error('Failed to fetch prescription');

  return res.json();
}

export async function getPrescriptions(): Promise<PrescriptionData[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch prescriptions');

  return res.json();
}


export async function createPrescription(data: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>): Promise<PrescriptionData> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create prescription');

  return res.json();
}


export async function updatePrescription(uniqueID: string, data: Partial<PrescriptionData>): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update prescription');

  return res.json();
}


export async function deletePrescription(uniqueID: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete prescription');
}
