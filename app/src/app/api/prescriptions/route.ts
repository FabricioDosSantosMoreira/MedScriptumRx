import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { readJSON, writeJSON } from '../utils';

import { PrescriptionData } from '@/app/Types/index';
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
