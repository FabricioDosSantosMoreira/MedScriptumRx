import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { readJSON, writeJSON } from '../utils';

import { PrescriptionData } from '@/app/Types/!Index';
import { calculatePrescriptionPrices, validateNoExtraFields } from '@/lib/utils';
import { allowedPrescriptionDataPropertiesOnChange } from '@/lib/utils/prescription';


export const prescriptionsPath = path.join(process.cwd(), 'public', 'data', 'prescriptions.json');


export async function GET() {
  try {
    const prescriptions = readJSON<PrescriptionData[]>(prescriptionsPath, []);

    return NextResponse.json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error(`[ERROR][API][PRESCRIPTION][GET] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to get prescriptions` },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const prescriptions = readJSON<PrescriptionData[]>(prescriptionsPath, []);
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

    type AllowedKeys =
      typeof allowedPrescriptionDataPropertiesOnChange[number];

    type PrescriptionCreatePayload =
      Partial<Pick<PrescriptionData, AllowedKeys>> &
      Record<Exclude<string, AllowedKeys>, never>;

    const sanitizedBody = body as PrescriptionCreatePayload;

    // // Calculate finalPrice safely
    // sanitizedBody.products = sanitizedBody.products ?? [];
   
    // sanitizedBody.hasDeliveryCost = sanitizedBody.hasDeliveryCost ?? true;
    // sanitizedBody.deliveryCost = Number(sanitizedBody.deliveryCost) ?? 0.0

    // const productsTotalCost = sanitizedBody.products.reduce((sum, p) => sum + (Number(p.finalPrice ?? 0)), 0);
    // const calculatedfinalPrice = sanitizedBody.finalPrice ?? productsTotalCost + (sanitizedBody.hasDeliveryCost ? sanitizedBody.deliveryCost : 0);

    // sanitizedBody.finalPrice = Number(sanitizedBody.finalPrice) ?? calculatedfinalPrice;
    // Calculate prices
    const prices = calculatePrescriptionPrices(sanitizedBody);

    sanitizedBody.productsTotalCost = prices.productsTotalCost;
    sanitizedBody.finalPrice = prices.finalPrice;


    const newPrescription: PrescriptionData = {
      ...sanitizedBody as Partial<PrescriptionData>,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      uniqueID: uuidv4(),
    } as PrescriptionData;

    prescriptions.push(newPrescription);
    writeJSON(prescriptionsPath, prescriptions);

    return NextResponse.json(
      { success: true, data: newPrescription }, 
      { status: 201 }
    );
  } catch (error) {
    console.error(`[ERROR][API][PRESCRIPTION][POST] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to create a prescription`},
      { status: 500 }
    );
  }
}








// // app/api/prescriptions/route.ts (or your existing route.ts)
// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';
// import fs from 'fs';

// import type { PrescriptionData, ResolvedProductData } from '@/types/PrescriptionData';
// import type { ProductData } from '@/types/Index';

// const dataDir = path.join(process.cwd(), 'public', 'data');
// const prescriptionsPath = path.join(dataDir, 'prescriptions.json');

// function ensureFile() {
//   if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
//   if (!fs.existsSync(prescriptionsPath)) {
//     fs.writeFileSync(prescriptionsPath, JSON.stringify([], null, 2));
//   }
// }

// export function readPrescriptions(): PrescriptionData[] {
//   ensureFile();
//   try {
//     return JSON.parse(fs.readFileSync(prescriptionsPath, 'utf-8'));
//   } catch (err) {
//     fs.writeFileSync(prescriptionsPath, JSON.stringify([], null, 2));
//     return [];
//   }
// }

// export function savePrescriptions(data: PrescriptionData[]) {
//   ensureFile();
//   fs.writeFileSync(prescriptionsPath, JSON.stringify(data, null, 2));
// }

// export async function GET() {
//   return NextResponse.json(readPrescriptions());
// }

// export async function POST(request: Request) {
//   const data = await request.json();
//   const prescriptions = readPrescriptions();
//   const now = new Date().toISOString();

//   if (!data.clientUniqueID) {
//     return NextResponse.json({ error: 'clientUniqueID is required' }, { status: 400 });
//   }

//   const incomingProducts = Array.isArray(data.products) ? data.products : [];

//   const products: ResolvedProductData[] = incomingProducts
//     .map((p: any) => {
//       // backward compatibility: if wrapped product exists, flatten it
//       if (p && typeof p === 'object' && 'product' in p && p.product) {
//         const prod: ProductData = p.product;
//         const args = p.args ?? {};
//         const finalPrice = Number(
//           p.finalPrice ??
//             (prod as any).discountPriceTag ??
//             (prod as any).fullPriceTag ??
//             (prod as any).cost ??
//             0
//         );

//         return {
//           ...prod,
//           args,
//           finalPrice,
//         } as ResolvedProductData;
//       }

//       // otherwise assume p is already a flattened ProductData + args + finalPrice
//       if (p && typeof p === 'object') {
//         const args = p.args ?? {};
//         const finalPrice = Number(
//           p.finalPrice ??
//             p.discountPriceTag ??
//             p.fullPriceTag ??
//             (p as any).cost ??
//             0
//         );

//         // copy all product fields (uniqueID, name, etc.) plus args + finalPrice
//         const { args: _a, finalPrice: _f, ...productFields } = p;
//         return {
//           ...(productFields as ProductData),
//           args,
//           finalPrice,
//         } as ResolvedProductData;
//       }

//       // invalid entry -> skip
//       return null;
//     })
//     .filter(Boolean) as ResolvedProductData[];

//   const productsTotalCost = products.reduce((sum, p) => sum + (Number(p.finalPrice ?? 0)), 0);

//   const hasDeliveryCost = !!data.hasDeliveryCost;
//   const deliveryCost = hasDeliveryCost ? Number(data.deliveryCost ?? 0) : 0;

//   const finalPrice =
//     data.finalPrice != null
//       ? Number(data.finalPrice)
//       : productsTotalCost + (hasDeliveryCost ? deliveryCost : 0);

//   const newPrescription: PrescriptionData = {
//     uniqueID: uuidv4(),
//     clientUniqueID: data.clientUniqueID,

//     products,
//     //productlength: products.length,
//     productsTotalCost,
//     deliveryCost,
//     finalPrice: Number(finalPrice),

//     hasDeliveryCost,
//     isActive: data.isActive ?? true,
//     isSingle: data.isSingle ?? false,
//     isPayed: data.isPayed ?? false,

//     args: data.args ?? {},

//     createdAt: now,
//     updatedAt: now,
//   };

//   prescriptions.push(newPrescription);
//   savePrescriptions(prescriptions);

//   return NextResponse.json(newPrescription, { status: 201 });
// }
