import { NextResponse } from 'next/server';

import { PrescriptionData } from '@/app/Types/!Index';
import { validateNoExtraFields, NoExtraKeysFromArray, calculatePrescriptionPrices } from '@/lib/utils';
import { allowedPrescriptionDataPropertiesOnChange } from '@/lib/utils/prescription';

import { prescriptionsPath } from '../route';
import { readJSON, writeJSON } from '../../utils';


export async function GET( request: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    const prescriptions = readJSON<PrescriptionData[]>(prescriptionsPath, []);

    const prescription = prescriptions.find(
      p => p.uniqueID === uniqueID
    );

    if (!prescription) {
      return NextResponse.json(
        { success: false, message: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prescription,
    });

  } catch (error) {
    console.error(`[ERROR][API][PRESCRIPTION][GET] -> ${error}`);

    return NextResponse.json(
      { success: false, message: `Failed to get prescription` },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const prescriptions = readJSON<PrescriptionData[]>(prescriptionsPath, []);
    const index = prescriptions.findIndex(p => p.uniqueID === uniqueID);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Prescription not found' },
        { status: 404 }
      );
    }

    const result = validateNoExtraFields(body, allowedPrescriptionDataPropertiesOnChange);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid field(s) -> ' + result.invalidFields
        },
        { status: 400 }
      );
    }

    type PrescriptionUpdatePayload =
      NoExtraKeysFromArray<
        Partial<PrescriptionData>,
        typeof allowedPrescriptionDataPropertiesOnChange
      >;

    const sanitizedBody = body as PrescriptionUpdatePayload;

    const prices = calculatePrescriptionPrices(sanitizedBody);

    console.log(prices);
    
    sanitizedBody.productsTotalCost = prices.productsTotalCost;
    sanitizedBody.finalPrice = prices.finalPrice;

    prescriptions[index] = {
      ...prescriptions[index],
      ...sanitizedBody as PrescriptionData,
      updatedAt: new Date().toISOString(),
    };

    writeJSON(prescriptionsPath, prescriptions);

    return NextResponse.json({
      success: true,
      data: prescriptions[index],
    });
  } catch (error) {
    console.error(`[ERROR][API][PRESCRIPTION][PUT] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to update a Prescription' },
      { status: 500 }
    );
  }
}


export async function DELETE(_: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid prescription ID' },
        { status: 400 }
      );
    }

    const prescriptions = readJSON<PrescriptionData[]>(prescriptionsPath, []);
    const filtered = prescriptions.filter(p => p.uniqueID !== uniqueID);

    if (filtered.length === prescriptions.length) {
      return NextResponse.json(
        { success: false, message: 'Prescription not found' },
        { status: 404 }
      );
    }

    writeJSON(prescriptionsPath, filtered);
    return NextResponse.json({ success: true, data: {} });

  } catch (error) {
    console.error(`[ERROR][API][PRESCRIPTION][DELETE] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to delete a prescription' },
      { status: 500 }
    );
  }
}



































// import { NextResponse } from 'next/server';
// import { readPrescriptions, savePrescriptions } from '../route';

// import type { PrescriptionData, ResolvedProductData } from '@/types/PrescriptionData';

// export async function PUT(
//   request: Request,
//   { params }: { params: { uniqueID: string } }
// ) {
//   const data = await request.json();
//   const prescriptions = readPrescriptions();

//   const index = prescriptions.findIndex(p => p.uniqueID === params.uniqueID);

//   if (index === -1) {
//     return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
//   }

//   const existing = prescriptions[index];

//   const products: ResolvedProductData[] = Array.isArray(data.products)
//     ? data.products.map((p: ResolvedProductData) => ({
//         ...p,
//         args: p.args ?? {},
//         finalPrice:
//           p.finalPrice ??
//           p.discountPriceTag ??
//           p.fullPriceTag ??
//           (p as any).cost ??
//           0,
//       }))
//     : existing.products;

//   const productsTotalCost = products.reduce(
//     (sum, p) => sum + Number(p.finalPrice ?? 0),
//     0
//   );

//   const hasDeliveryCost = data.hasDeliveryCost ?? existing.hasDeliveryCost;
//   const deliveryCost = hasDeliveryCost
//     ? Number(data.deliveryCost ?? existing.deliveryCost)
//     : 0;

//   const finalPrice =
//     data.finalPrice != null
//       ? Number(data.finalPrice)
//       : productsTotalCost + (hasDeliveryCost ? deliveryCost : 0);

//   const updated: PrescriptionData = {
//     ...existing,
//     products,
//     productsTotalCost,
//     deliveryCost,
//     hasDeliveryCost,
//     finalPrice,
//     isActive: data.isActive ?? existing.isActive,
//     isSingle: data.isSingle ?? existing.isSingle,
//     isPayed: data.isPayed ?? existing.isPayed,
//     args: data.args ?? existing.args,
//     updatedAt: new Date().toISOString(),
//   };

//   prescriptions[index] = updated;
//   savePrescriptions(prescriptions);

//   return NextResponse.json(updated);
// }

// export async function DELETE(
//   _: Request,
//   { params }: { params: { uniqueID: string } }
// ) {
//   const prescriptions = readPrescriptions().filter(p => p.uniqueID !== params.uniqueID);
//   savePrescriptions(prescriptions);

//   return NextResponse.json({ success: true });
// }
