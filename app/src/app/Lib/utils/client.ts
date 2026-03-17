import { handleAPIResponse } from '../utils';
import { ClientData } from '@/app/Types/!Index';


type ClientPayload = Omit<ClientData, 'uniqueID' | 'createdAt' | 'updatedAt'>;

const API_BASE: string = '/Api/Clients';
export const allowedClientDataPropertiesOnChange = [
  'name', 
  'address', 
  
  'observations', 
  'alsoKnownBy',  

  'isActive',
] as const;


export async function getClients(): Promise<ClientData[]> {
  const res = await fetch(API_BASE, { method: 'GET' });
  return handleAPIResponse<ClientData[]>(res);
}


// TODO: Needs API Implementation
export async function getClient(uniqueID: string): Promise<ClientData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'GET' });
  return handleAPIResponse<ClientData>(res);
}


export async function createClient(payload: ClientPayload): Promise<ClientData> {
  const res = await fetch(`${API_BASE}`,  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<ClientData>(res);
}


export async function updateClient(uniqueID: string, payload: ClientPayload): Promise<ClientData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<ClientData>(res);
}


export async function deleteClient(uniqueID: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'DELETE' });
  return handleAPIResponse<{ ok: boolean; message?: string }>(res);
}
