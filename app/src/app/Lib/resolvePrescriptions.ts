import { PrescriptionData } from '@/types/PrescriptionData';
import { ClientData } from '@/types/ClientData';
import { ResolvedPrescription } from '@/types/ResolvedPrescription';

export function resolvePrescriptions(
  prescriptions: PrescriptionData[],
  clients: ClientData[]
): ResolvedPrescription[] {
  return prescriptions.map((p) => {
    const client = clients.find(c => c.uniqueID === p.clientUniqueID);

    if (!client) {
      throw new Error(`Client not found: ${p.clientUniqueID}`);
    }

    return {
      ...p,
      client,
      products: p.products ?? [],
    };
  });
}