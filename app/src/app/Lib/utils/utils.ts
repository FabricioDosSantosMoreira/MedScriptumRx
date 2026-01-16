import { ClientData, PrescriptionData, ResolvedPrescription } from '@/types/PrescriptionData';


export function formatDate(): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // NOTE: months are 0-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getDateTimedFormated(timezone: string = 'BRT'): string {
  const date = new Date();

  // TimeZome Map
  const tzMap: Record<string, string> = {
    BRT: "America/Sao_Paulo", // Brazilian timezone
  };

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: tzMap[timezone],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formatter.format(date);
}

export async function loadPrescriptions(isActive: boolean): Promise<PrescriptionData[]> {
  const res = await fetch(
    `/Api/Prescriptions?is_active=${isActive}`,
    { method: 'GET' }
  );

  if (!res.ok) {
    throw new Error('Failed to load prescriptions');
  }

  return res.json();
}

export async function loadClients(isActive: boolean): Promise<ClientData[]> {
  const res = await fetch(
    `/Api/Clients?is_active=${isActive}`,
    { method: 'GET' }
  );

  if (!res.ok) {
    throw new Error('Failed to load clients');
  }

  return res.json();
}


export function resolvePrescriptions(
  prescriptions: PrescriptionData[],
  clients: ClientData[]
): ResolvedPrescription[] {

  const clientMap = new Map(
    clients.map(client => [client.uniqueID, client])
  );

  return prescriptions
    .map((p): ResolvedPrescription | null => {
      // 🔒 Prescrição inválida sem ID
      if (!p.uniqueID) return null;

      const client =
        (p.clientID && clientMap.get(p.clientID)) ??
        null;

      // 🔒 Prescrição sem cliente não entra na UI
      if (!client) return null;

      return {
        uniqueID: p.uniqueID,

        client,

        createdAt: p.createdAt ?? new Date().toISOString(),
        isActive: p.isActive ?? true,
        isSingle: p.isSingle ?? false,

        products: Array.isArray(p.products)
          ? p.products
          : [],

        args: p.args ?? {}
      };
    })
    .filter(Boolean) as ResolvedPrescription[];
}
