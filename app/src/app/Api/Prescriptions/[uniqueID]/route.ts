import { NextResponse } from 'next/server';
import { readPrescriptions, savePrescriptions } from '../route';

import { PrescriptionData, ResolvedProductData } from '@/lib/utils/PrescriptionSheet';


export async function PUT(
  request: Request,
  { params }: { params: { uniqueID: string } }
) {
  const data = await request.json();
  const prescriptions = readPrescriptions();

  const index = prescriptions.findIndex(p => p.uniqueID === params.uniqueID);

  if (index === -1) {
    return NextResponse.json(
      { message: 'Prescription not found' },
      { status: 404 }
    );
  }

  const existing = prescriptions[index];

  // =============================
  // UPDATE PRODUCTS
  // =============================
  const products: ResolvedProductData[] = data.products
    ? data.products.map((p: ResolvedProductData) => {
        const finalPrice =
          p.finalPrice != null
            ? p.finalPrice
            : p.product.discountPriceTag ?? p.product.fullPriceTag;

        return {
          product: p.product,
          args: p.args ?? {},
          finalPrice,
        };
      })
    : existing.products;

  // =============================
  // CALCULATIONS
  // =============================
  const productsTotalCost = products.reduce(
    (sum, p) => sum + (p.finalPrice ?? 0),
    0
  );

  const hasDeliveryCost = data.hasDeliveryCost ?? existing.hasDeliveryCost;
  const deliveryCost = data.deliveryCost ?? existing.deliveryCost;

  const finalPrice =
    data.finalPrice != null
      ? data.finalPrice
      : hasDeliveryCost
        ? productsTotalCost + deliveryCost
        : productsTotalCost;

  // =============================
  // BUILD UPDATED OBJECT
  // =============================
  const updated: PrescriptionData = {
    ...existing,
    client: data.client ?? existing.client,
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

  // =============================
  // SAVE ARRAY (CRITICAL)
  // =============================
  prescriptions[index] = updated;
  savePrescriptions(prescriptions);

  return NextResponse.json(updated);
}

// export async function DELETE({ params }: { params: { uniqueID: string } }) {
//   const id = params.uniqueID;
//   const index = prescriptions.findIndex(p => p.uniqueID === id);
//   if (index === -1) {
//     return NextResponse.json({ message: 'Prescription not found' }, { status: 404 });
//   }
//   prescriptions.splice(index, 1);
//   return NextResponse.json({ message: 'Prescription deleted' });
// }

export async function DELETE(_: Request, { params }: { params: { uniqueID: string } }) {
  const prescriptions = readPrescriptions().filter(p => p.uniqueID !== params.uniqueID);
  savePrescriptions(prescriptions);

  return NextResponse.json({ success: true });
}
