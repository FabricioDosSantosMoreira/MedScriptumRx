import { NextResponse } from 'next/server';

import { ClientData } from '@/app/Types/!Index';
import { validateNoExtraFields, NoExtraKeysFromArray } from '@/lib/utils';
import { allowedClientDataPropertiesOnChange } from '@/lib/utils/client';

import { clientsPath } from '../route';
import { readJSON, writeJSON } from '../../utils';


export async function PUT(request: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid client ID' },
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

    const clients = readJSON<ClientData[]>(clientsPath, []);
    const index = clients.findIndex(c => c.uniqueID === uniqueID);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    const result = validateNoExtraFields(body, allowedClientDataPropertiesOnChange);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid field(s) -> ' + result.invalidFields
        },
        { status: 400 }
      );
    }

    type ClientUpdatePayload =
      NoExtraKeysFromArray<
        Partial<ClientData>,
        typeof allowedClientDataPropertiesOnChange
      >;

    const sanitizedBody = body as ClientUpdatePayload;

    clients[index] = {
      ...clients[index],
      ...sanitizedBody as ClientData,
      updatedAt: new Date().toISOString(),
    };

    writeJSON(clientsPath, clients);

    return NextResponse.json({
      success: true,
      data: clients[index],
    });
  } catch (error) {
    console.error(`[ERROR][API][CLIENT][PUT] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to update a client' },
      { status: 500 }
    );
  }
}


export async function DELETE(_: Request, context: { params: Promise<{ uniqueID: string }> }) {
  try {
    const { uniqueID } = await context.params;

    if (!uniqueID) {
      return NextResponse.json(
        { success: false, message: 'Invalid client ID' },
        { status: 400 }
      );
    }

    const clients = readJSON<ClientData[]>(clientsPath, []);
    const filtered = clients.filter(c => c.uniqueID !== uniqueID);

    if (filtered.length === clients.length) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    writeJSON(clientsPath, filtered);
    return NextResponse.json({ success: true, data: {} });

  } catch (error) {
    console.error(`[ERROR][API][CLIENT][DELETE] -> ${error}`);
    return NextResponse.json(
      { success: false, message: 'Failed to delete a client' },
      { status: 500 }
    );
  }
}
