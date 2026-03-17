import { ClientData } from "@/app/Types/Index";

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
  const res = await fetch('/api/clients', { method: 'GET' });
  return handleResponse<ClientData[]>(res);
}

export async function getClient(id: string): Promise<ClientData> {
  const res = await fetch(`/api/clients/${id}`, { method: 'GET' });
  return handleResponse<ClientData>(res);
}
