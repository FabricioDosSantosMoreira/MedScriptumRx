import { ClientData } from "@/app/Types/Index";

const API_BASE: string = '/Api/Clients';

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || res.statusText || 'Erro na requisição';
    throw new Error(message);
  }
  return data as T;
}

export async function fetchClients(): Promise<ClientData[]> {
  const res = await fetch(`${API_BASE}`, { method: 'GET' });
  return handleResponse<ClientData[]>(res);
}

export async function getClient(uniqueID: string): Promise<ClientData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'GET' });
  return handleResponse<ClientData>(res);
}
