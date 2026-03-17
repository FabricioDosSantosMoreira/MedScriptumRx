import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import fs from 'fs';

import { ProductData } from '@/types/Index';


const dataDir = path.join(process.cwd(), 'public', 'data');
const productsPath = path.join(dataDir, 'products.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, JSON.stringify([], null, 2));
  }
}


export function readProducts(): ProductData[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
}


export function saveProducts(products: ProductData[]) {
  ensureFile();
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}


export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}


export async function POST(request: Request) {
  const product = await request.json();
  const products = readProducts();

  const now = new Date().toISOString();

  const newProduct: ProductData = {
    ...product,
    uniqueID: uuidv4(),
    createdAt: now,
    updatedAt: now,
    isActive: true,
  };

  products.push(newProduct);
  saveProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}
