import { handleAPIResponse } from '../utils';
import { ProductData } from '@/app/Types/!Index';


type ProductPayload = Omit<ProductData, 'uniqueID' | 'createdAt' | 'updatedAt'>;

const API_BASE: string = '/Api/Products';
export const allowedProductDataPropertiesOnChange = [
  'name', 
  'category',
  
  'defaultAlert',  
  'defaultWhyToUse', 
  'defaultHowToUse', 
  'defaultObservation', 
  'defaultPresentation',

  'originalPrice', 
  'discountedPrice', 
  'discountPercentage', 
  
  'isActive', 
  'internalSystemID',
];


export async function getProducts(): Promise<ProductData[]> {
  const res = await fetch(API_BASE, { method: 'GET' });
  return handleAPIResponse<ProductData[]>(res);
}


// TODO: Needs API Implementation
export async function getProduct(uniqueID: string): Promise<ProductData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'GET' });
  return handleAPIResponse<ProductData>(res);
}


export async function createProduct(payload: ProductPayload): Promise<ProductData> {
  const res = await fetch(`${API_BASE}`,  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<ProductData>(res);
}


export async function updateProduct(uniqueID: string, payload: ProductPayload): Promise<ProductData> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleAPIResponse<ProductData>(res);
}


export async function deleteProduct(uniqueID: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/${uniqueID}`, { method: 'DELETE' });
  return handleAPIResponse<{ ok: boolean; message?: string }>(res);
}
