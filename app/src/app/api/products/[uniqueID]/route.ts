import { NextResponse } from 'next/server';

import { ProductData } from '@/app/Types/!Index';;
import { validateNoExtraFields, NoExtraKeysFromArray } from '@/lib/utils';
import { allowedProductDataPropertiesOnChange } from '@/lib/utils/product';

import { productsPath } from '../route';
import { readJSON, writeJSON } from '../../utils';


export async function PUT(request: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
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

    const products = readJSON<ProductData[]>(productsPath, []);
    const index = products.findIndex(p => p.uniqueID === uniqueID);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

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

    type ProductUpdatePayload =
      NoExtraKeysFromArray<
        Partial<ProductData>,
        typeof allowedProductDataPropertiesOnChange
      >;

    const sanitizedBody = body as ProductUpdatePayload;

    console.log(sanitizedBody.discountedPrice)
    if (sanitizedBody.originalPrice !== undefined) {
      sanitizedBody.originalPrice = Number(Number(sanitizedBody.originalPrice).toFixed(2));
    }

    if (sanitizedBody.discountedPrice !== undefined) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      sanitizedBody.discountedPrice = Number(Number(sanitizedBody.discountedPrice).toFixed(2));
      console.log(sanitizedBody.discountedPrice)
    }

    if (sanitizedBody.discountPercentage !== undefined) {
      sanitizedBody.discountPercentage = Number(Number(sanitizedBody.discountPercentage).toFixed(2));
    }

    products[index] = {
      ...products[index],
      ...sanitizedBody as ProductData,
      updatedAt: new Date().toISOString(),
    };

    writeJSON(productsPath, products);

    return NextResponse.json({
      success: true,
      data: products[index],
    });
  } catch (error) {
    console.error(`[ERROR][API][PRODUCT][PUT] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to update a product' },
      { status: 500 }
    );
  }
}


export async function DELETE(_: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const products = readJSON<ProductData[]>(productsPath, []);
    const filtered = products.filter(p => p.uniqueID !== uniqueID);

    if (filtered.length === products.length) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    writeJSON(productsPath, filtered);
    return NextResponse.json({ success: true, data: {} });

  } catch (error) {
    console.error(`[ERROR][API][PRODUCT][DELETE] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to delete a product' },
      { status: 500 }
    );
  }
}
