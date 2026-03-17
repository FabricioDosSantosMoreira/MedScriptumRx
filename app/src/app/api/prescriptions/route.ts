// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import { PrescriptionData } from '@/types/PrescriptionData';
// import { getDateTimeFormated } from '@/lib/utils/utils';

// const prescriptionsPath = path.join(process.cwd(), 'public', 'data', 'prescriptions.json');


// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const isActiveParam = searchParams.get('is_active');

//   try {
//     const raw = fs.readFileSync(prescriptionsPath, 'utf-8');
//     let prescriptions: PrescriptionData[] = JSON.parse(raw);

//     let updated = false;

//     prescriptions = prescriptions.map((p) => {
//       const updatedP = { ...p };

//       if (!updatedP.uniqueID) {
//         updatedP.uniqueID = uuidv4();
//         updated = true;
//       }

//       if (!updatedP.createdAt) {
//         updatedP.createdAt = getDateTimeFormated();
//         updated = true;
//       }

//       if (updatedP.isActive === undefined) {
//         updatedP.isActive = true;
//         updated = true;
//       }

//       if (updatedP.isSingle === undefined) {
//         updatedP.isSingle = false;
//         updated = true;
//       }

//       return updatedP;
//     });

//     if (updated) {
//       fs.writeFileSync(
//         prescriptionsPath,
//         JSON.stringify(prescriptions, null, 2)
//       );
//     }

//     // 🔎 filtro por isActive
//     if (isActiveParam !== null) {
//       const isActive = isActiveParam === 'true';
//       prescriptions = prescriptions.filter(p => p.isActive === isActive);
//     }

//     return NextResponse.json(prescriptions);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: 'Failed to load prescriptions' },
//       { status: 500 }
//     );
//   }
// }


// // export async function POST(request: Request) {
// //   try {
// //     const { uniqueID, updatedData } = await request.json();

// //     if (!uniqueID || !updatedData) {
// //       return NextResponse.json(
// //         { error: 'Missing parameters' },
// //         { status: 400 }
// //       );
// //     }

// //     const raw = fs.readFileSync(prescriptionsPath, 'utf-8');
// //     const prescriptions: PrescriptionData[] = JSON.parse(raw);

// //     const index = prescriptions.findIndex(p => p.uniqueID === uniqueID);

// //     if (index === -1) {
// //       return NextResponse.json(
// //         { error: 'Prescription not found' },
// //         { status: 404 }
// //       );
// //     }

// //     prescriptions[index] = {
// //       ...prescriptions[index],
// //       ...updatedData,
// //       uniqueID, // garante imutabilidade
// //     };

// //     fs.writeFileSync(
// //       prescriptionsPath,
// //       JSON.stringify(prescriptions, null, 2)
// //     );

// //     return NextResponse.json({
// //       success: true,
// //       updated: prescriptions[index],
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     return NextResponse.json(
// //       { error: 'Failed to update prescription' },
// //       { status: 500 }
// //     );
// //   }
// // }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { uniqueID, updatedData } = body;

//     if (!updatedData) {
//       return NextResponse.json({ error: 'Missing updatedData' }, { status: 400 });
//     }

//     // read file (create if missing)
//     let raw = '[]';
//     try {
//       raw = fs.readFileSync(prescriptionsPath, 'utf-8');
//     } catch (e) {
//       // file may not exist
//     }

//     let list = [];
//     try {
//       list = JSON.parse(raw);
//     } catch (e) {
//       list = [];
//     }

//     const now = getDateTimeFormated();

//     // ensure defaults on updatedData
//     const ensured = {
//       uniqueID: updatedData.uniqueID ?? uniqueID ?? uuidv4(),
//       clientID: updatedData.clientID ?? updatedData.clientID ?? '',
//       createdAt: updatedData.createdAt ?? now,
//       isActive: typeof updatedData.isActive === 'boolean' ? updatedData.isActive : true,
//       isSingle: typeof updatedData.isSingle === 'boolean' ? updatedData.isSingle : false,
//       products: Array.isArray(updatedData.products) ? updatedData.products : [],
//       args: updatedData.args ?? {},
//     };

//     const idx = list.findIndex((p: any) => p.uniqueID === ensured.uniqueID);

//     if (idx === -1) {
//       list.push(ensured);
//     } else {
//       list[idx] = {
//         ...list[idx],
//         ...ensured,
//         uniqueID: list[idx].uniqueID, // maintain id
//         createdAt: list[idx].createdAt ?? ensured.createdAt, // keep original createdAt if present
//       };
//     }

//     fs.writeFileSync(prescriptionsPath, JSON.stringify(list, null, 2));

//     const saved = list.find((p: any) => p.uniqueID === ensured.uniqueID);

//     return NextResponse.json(saved);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'Failed to upsert prescription' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import fs, { read } from 'fs';

const dataDir = path.join(process.cwd(), 'public', 'data');
const prescriptionsPath = path.join(dataDir, 'prescriptions.json');

import { PrescriptionData } from '@/app/Types/PrescriptionData';
import { ResolvedProductData } from '@/types/Index';


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


export function savePrescriptions(products: PrescriptionData[]) {
  ensureFile();
  fs.writeFileSync(prescriptionsPath, JSON.stringify(products, null, 2));
}

export async function GET() {
  const prescriptions = readPrescriptions();

  return NextResponse.json(prescriptions);
}


export async function POST(request: Request) {
  const prescription = await request.json();
  const prescriptions = readPrescriptions();
  

  console.log('Received prescription:', prescription);
  console.log('Current prescriptions:', prescriptions);

  const now = new Date().toISOString();

  // Create a new prescription object
  const newPrescription: PrescriptionData = {
    uniqueID: uuidv4(),
    client: prescription.client,
    products: prescription.products.map((p: ResolvedProductData) => ({
      product: p.product,
      args: p.args,
      finalPrice: p.finalPrice != null ? p.finalPrice : p.product.cost,
    })),
    productsTotalCost: 0,
    deliveryCost: prescription.deliveryCost ?? 0,
    hasDeliveryCost: prescription.hasDeliveryCost ?? false,
    finalPrice: prescription.finalPrice ?? 0,
    createdAt: now,
    updatedAt: now,
    isActive: prescription.isActive ?? true,
    isSingle: prescription.isSingle ?? false,
    isPayed: prescription.isPayed ?? false,
    args: prescription.args ?? {},
  };

  // Calculate productsTotalCost and finalPrice
  let total = 0;
  newPrescription.products.forEach((p: ResolvedProductData) => {
    total += p.finalPrice ?? 0;
  });
  newPrescription.productsTotalCost = total;
  if (newPrescription.hasDeliveryCost) {
    newPrescription.finalPrice = (newPrescription.finalPrice || total + newPrescription.deliveryCost);
  } else {
    newPrescription.finalPrice = (newPrescription.finalPrice || total);
  }

  prescriptions.push(newPrescription);
  savePrescriptions(prescriptions);
  
  return NextResponse.json(newPrescription, { status: 201 });
}
