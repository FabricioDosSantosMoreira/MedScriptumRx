import { PrescriptionData } from '@/types/PrescriptionData';


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

export async function loadPrescriptionData(): Promise<PrescriptionData[]> {
  const res = await fetch("/Api/Prescriptions?is_history_data=false", { method: "GET" });

  // console.log(res)
  if (!res.ok) throw new Error("Failed to load prescriptions");

  const data: PrescriptionData[] = await res.json();

  // console.log("Prescriptions loaded:", data);
  return data;
}

export async function loadPrescriptionHistoryData(): Promise<PrescriptionData[]> {
  const res = await fetch("/Api/Prescriptions?is_history_data=true", { method: "GET" });

  // console.log(res)
  if (!res.ok) throw new Error("Failed to load history prescriptions!");

  const data: PrescriptionData[] = await res.json();

  // console.log("History Prescriptions loaded:", data);
  return data;
}
