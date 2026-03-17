import { NextResponse } from 'next/server';
import { readPrescriptions, savePrescriptions } from '../route';

import type { PrescriptionData, ResolvedProductData } from '@/types/PrescriptionData';

export async function PUT(
  request: Request,
  { params }: { params: { uniqueID: string } }
) {
  const data = await request.json();
  const prescriptions = readPrescriptions();

  const index = prescriptions.findIndex(p => p.uniqueID === params.uniqueID);

  if (index === -1) {
    return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
  }

  const existing = prescriptions[index];

  const products: ResolvedProductData[] = Array.isArray(data.products)
    ? data.products.map((p: ResolvedProductData) => ({
        ...p,
        args: p.args ?? {},
        finalPrice:
          p.finalPrice ??
          p.discountPriceTag ??
          p.fullPriceTag ??
          (p as any).cost ??
          0,
      }))
    : existing.products;

  const productsTotalCost = products.reduce(
    (sum, p) => sum + Number(p.finalPrice ?? 0),
    0
  );

  const hasDeliveryCost = data.hasDeliveryCost ?? existing.hasDeliveryCost;
  const deliveryCost = hasDeliveryCost
    ? Number(data.deliveryCost ?? existing.deliveryCost)
    : 0;

  const finalPrice =
    data.finalPrice != null
      ? Number(data.finalPrice)
      : productsTotalCost + (hasDeliveryCost ? deliveryCost : 0);

  const updated: PrescriptionData = {
    ...existing,
    products,
    productsTotalCost,
    deliveryCost,
    hasDeliveryCost,
    finalPrice,
    isActive: data.isActive ?? existing.isActive,
    isSingle: data.isSingle ?? existing.isSingle,
    isPayed: data.isPayed ?? existing.isPayed,
    args: data.args ?? existing.args,
    updatedAt: new Date().toISOString(),
  };

  prescriptions[index] = updated;
  savePrescriptions(prescriptions);

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { uniqueID: string } }
) {
  const prescriptions = readPrescriptions().filter(p => p.uniqueID !== params.uniqueID);
  savePrescriptions(prescriptions);

  return NextResponse.json({ success: true });
}
