import { NextResponse } from 'next/server';

import { ProductData } from '@/types/Index';

import { readJSON, writeJSON } from '../../utils';
import { productsPath } from '../route';


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

    const allowedFields = [
      'name', 'defaultWhyToUse', 'defaultHowToUse', 'defaultObservation', 'defaultAlert', 'defaultPresentation', 'originalPrice', 'discountedPrice', 'discountPercentage', 'isActive', 'internalSystemID'
    ];
    const sanitizedBody = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(sanitizedBody).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    products[index] = {
      ...products[index],
      ...sanitizedBody,
      updatedAt: new Date().toISOString(),
    };

    writeJSON(productsPath, products);

    return NextResponse.json({
      success: true,
      data: products[index],
    });
  } catch (error) {
    console.error('[ERROR][API][PRODUCT][PUT] -> ', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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
    console.error('[ERROR][API][PRODUCT][DELETE] -> ', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
