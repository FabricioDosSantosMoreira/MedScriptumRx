import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { readJSON, writeJSON } from '../utils';

import { ProductData } from '@/app/Types/!Index';
import { validateNoExtraFields } from '@/lib/utils';
import { allowedProductDataPropertiesOnChange } from '@/lib/utils/product';


export const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');

export async function GET() {
  try {
    const products = readJSON<ProductData[]>(productsPath, []);

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(`[ERROR][API][PRODUCT][GET] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to get products` },
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
    const products = readJSON<ProductData[]>(productsPath, []);
    const result = validateNoExtraFields(body, allowedProductDataPropertiesOnChange);

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
      typeof allowedProductDataPropertiesOnChange[number];

    type ProductCreatePayload =
      Partial<Pick<ProductData, AllowedKeys>> &
      Record<Exclude<string, AllowedKeys>, never>;

    const sanitizedBody = body as ProductCreatePayload;

    // Calculate discountedPrice safely
    sanitizedBody.originalPrice = sanitizedBody.originalPrice ?? 0;
    sanitizedBody.discountedPrice = sanitizedBody.discountedPrice ?? 0
    sanitizedBody.discountPercentage = sanitizedBody.discountPercentage ?? 0

    const discountedPrice =
      sanitizedBody.discountedPrice && sanitizedBody.discountedPrice > 0
        ? sanitizedBody.discountedPrice
        : sanitizedBody.originalPrice -
          sanitizedBody.originalPrice * (sanitizedBody.discountPercentage / 100);


    const newProduct: ProductData = {
      ...sanitizedBody as Partial<ProductData>,
      discountedPrice,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      uniqueID: uuidv4(),
    } as ProductData;

    products.push(newProduct);
    writeJSON(productsPath, products);

    return NextResponse.json(
      { success: true, data: newProduct }, 
      { status: 201 }
    );
  } catch (error) {
    console.error(`[ERROR][API][PRODUCT][POST] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to create a product`},
      { status: 500 }
    );
  }
}
