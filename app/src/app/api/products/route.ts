import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { ProductData } from '@/types/Index';
import { readJSON, writeJSON } from '../utils';


export const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');

export async function GET() {
  try {
    const products = readJSON<ProductData[]>(productsPath, []);

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('[ERROR][API][PRODUCT][GET] -> ', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: Partial<ProductData>;

    // Safe JSON parsing
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Minimal validation
    // TODO: Real validation
    if (!body.name || !body.originalPrice) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const products = readJSON<ProductData[]>(productsPath, []);
    const now = new Date().toISOString();

    // Calculate discountedPrice safely
    const discountPercentage = body.discountPercentage ?? 0;
    const discountedPrice =
      body.discountedPrice && body.discountedPrice > 0
        ? body.discountedPrice
        : body.originalPrice -
          body.originalPrice * (discountPercentage / 100);

    const newProduct: ProductData = {
      ...body,
      discountedPrice,
      uniqueID: uuidv4(),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    } as ProductData;

    products.push(newProduct);
    writeJSON(productsPath, products);

    return NextResponse.json(
      { success: true, data: newProduct }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('[ERROR][API][PRODUCT][POST] -> ', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
