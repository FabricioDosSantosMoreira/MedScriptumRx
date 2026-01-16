// lib/utils/PrescriptionSheet.tsx
export type ProductData = {
  uniqueID: string;
  name: string;
  cost: number;
};

export type ClientData = {
  uniqueID: string;
  name: string;
  // other client fields
};

export type ProductArgs = {
  useListIcon?: boolean; 
  useAlertIcon?: boolean;
  useCalendarIcon?: boolean;
  useObservationIcon?: boolean;
};

export type ResolvedProductData = {
  product: ProductData;
  args: ProductArgs;
  finalPrice?: number;
}

export type PrescriptionArgs = {
  useNameIcon?: boolean;
};

export type PrescriptionData = {
  uniqueID: string;
  client: ClientData;
  products: ResolvedProductData[];
  productsTotalCost: number;
  deliveryCost: number;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSingle: boolean;
  isPayed: boolean;
  hasDeliveryCost: boolean;
  args: PrescriptionArgs;
};

const API_BASE = '/api/prescriptions';

export async function getPrescriptions(): Promise<PrescriptionData[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch prescriptions');
  return res.json();
}

export async function getPrescription(uniqueID: string): Promise<PrescriptionData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`);
  if (!res.ok) throw new Error('Failed to fetch prescription');
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
