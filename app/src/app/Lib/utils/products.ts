import { ProductData } from "@/app/Types/Index";

type CreateUpdatePayload = Omit<ProductData, 'uniqueID' | 'createdAt' | 'updatedAt'>;

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || res.statusText || 'Erro na requisição';
    throw new Error(message);
  }
  return data as T;
}

export async function fetchProducts(): Promise<ProductData[]> {
  const res = await fetch('/api/products', { method: 'GET' });
  return handleResponse<ProductData[]>(res);
}

export async function getProduct(id: string): Promise<ProductData> {
  const res = await fetch(`/api/products/${id}`, { method: 'GET' });
  return handleResponse<ProductData>(res);
}

export async function createProduct(payload: CreateUpdatePayload): Promise<ProductData> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse<ProductData>(res);
}

export async function updateProduct(id: string, payload: CreateUpdatePayload): Promise<ProductData> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse<ProductData>(res);
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  return handleResponse<{ ok: boolean; message?: string }>(res);
}
