import { NextResponse } from 'next/server';

import { readProducts, saveProducts } from '../route';


export async function PUT(
  request: Request,
  context: { params: Promise<{ uniqueID: string }> }
) {
  const { uniqueID } = await context.params;
  const updates = await request.json();

  const products = readProducts();

  const index = products.findIndex(p => p.uniqueID === uniqueID);

  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const now = new Date().toISOString();

  products[index] = {
    ...products[index],
    ...updates,
    uniqueID,
    createdAt: products[index].createdAt,
    updatedAt: now,
  };

  saveProducts(products);

  return NextResponse.json(products[index]);
}


export async function DELETE(_: Request, { params }: { params: { uniqueID: string } }) {
  const products = readProducts().filter(p => p.uniqueID !== params.uniqueID);
  saveProducts(products);

  return NextResponse.json({ success: true });
}
