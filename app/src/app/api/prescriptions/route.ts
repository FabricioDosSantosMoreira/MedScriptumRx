import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

import { PrescriptionData, ResolvedProductData } from '@/types/Index';

const dataDir = path.join(process.cwd(), 'public', 'data');
const prescriptionsPath = path.join(dataDir, 'prescriptions.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(prescriptionsPath)) {
    fs.writeFileSync(prescriptionsPath, JSON.stringify([], null, 2));
  }
}

export function readPrescriptions(): PrescriptionData[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(prescriptionsPath, 'utf-8'));
}

export function savePrescriptions(data: PrescriptionData[]) {
  ensureFile();
  fs.writeFileSync(prescriptionsPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readPrescriptions());
}

export async function POST(request: Request) {
  const data = await request.json();
  const prescriptions = readPrescriptions();
  const now = new Date().toISOString();

  // =============================
  // NORMALIZE PRODUCTS
  // =============================
  const products: ResolvedProductData[] = data.products.map(
    (p: ResolvedProductData) => {
      const finalPrice =
        p.finalPrice ??
        p.discountPriceTag ??
        p.fullPriceTag ??
        0;

      return {
        ...p,
        finalPrice,
        args: p.args ?? {},
      };
    }
  );

  const productsTotalCost = products.reduce(
    (sum, p) => sum + (p.finalPrice ?? 0),
    0
  );

  const hasDeliveryCost = data.hasDeliveryCost ?? false;
  const deliveryCost = data.deliveryCost ?? 0;

  const finalPrice =
    data.finalPrice != null
      ? data.finalPrice
      : hasDeliveryCost
        ? productsTotalCost + deliveryCost
        : productsTotalCost;

  // =============================
  // BUILD PRESCRIPTION
  // =============================
  const newPrescription: PrescriptionData = {
    uniqueID: uuidv4(),
    clientUniqueID: data.clientUniqueID,

    products,
    productsTotalCost,
    deliveryCost,
    finalPrice,

    hasDeliveryCost,
    isActive: data.isActive ?? true,
    isSingle: data.isSingle ?? false,
    isPayed: data.isPayed ?? false,

    args: data.args ?? {},

    createdAt: now,
    updatedAt: now,
  };

  prescriptions.push(newPrescription);
  savePrescriptions(prescriptions);

  return NextResponse.json(newPrescription, { status: 201 });
}
