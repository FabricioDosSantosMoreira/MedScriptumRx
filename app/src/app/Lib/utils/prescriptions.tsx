import { PrescriptionData, ClientData } from '@/types/Index';

const PRESCRIPTIONS_API = '/Api/Prescriptions';
const CLIENTS_API = '/Api/Clients';

/* ================================
   BASIC FETCHERS
================================ */

export async function getPrescriptions(): Promise<PrescriptionData[]> {
  const res = await fetch(PRESCRIPTIONS_API);
  if (!res.ok) throw new Error('Failed to fetch prescriptions');
  return res.json();
}

export async function getClients(): Promise<ClientData[]> {
  const res = await fetch(CLIENTS_API);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

/* ================================
   NORMALIZED → DENORMALIZED VIEW
================================ */

export type PrescriptionWithClient = PrescriptionData & {
  client: ClientData | null;
};

export async function getPrescriptionsWithClients(): Promise<PrescriptionWithClient[]> {
  const [prescriptions, clients] = await Promise.all([
    getPrescriptions(),
    getClients(),
  ]);

  const clientMap = new Map(
    clients.map(client => [client.uniqueID, client])
  );

  return prescriptions.map(p => ({
    ...p,
    client: clientMap.get(p.clientUniqueID) ?? null,
  }));
}

/* ================================
   MUTATIONS
================================ */

export async function createPrescription(
  data: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>
): Promise<PrescriptionData> {
  const res = await fetch(PRESCRIPTIONS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create prescription');
  return res.json();
}

export async function updatePrescription(
  uniqueID: string,
  data: Partial<PrescriptionData>
): Promise<PrescriptionData> {
  const res = await fetch(`${PRESCRIPTIONS_API}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update prescription');
  return res.json();
}

export async function deletePrescription(uniqueID: string): Promise<void> {
  const res = await fetch(`${PRESCRIPTIONS_API}/${uniqueID}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete prescription');
}
