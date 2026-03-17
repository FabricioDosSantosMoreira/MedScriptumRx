import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { readJSON, writeJSON } from '../utils';

import { ClientData } from '@/app/Types/!Index';
import { validateNoExtraFields } from '@/lib/utils';
import { allowedClientDataPropertiesOnChange } from '@/lib/utils/client';


export const clientsPath = path.join(process.cwd(), 'public', 'data', 'clients.json');


export async function GET() {
  try {
    const clients = readJSON<ClientData[]>(clientsPath, []);

    return NextResponse.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error(`[ERROR][API][CLIENT][GET] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to get clients` },
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
    const clients = readJSON<ClientData[]>(clientsPath, []);
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

    type AllowedKeys =
      typeof allowedClientDataPropertiesOnChange[number];

    type ClientCreatePayload =
      Partial<Pick<ClientData, AllowedKeys>> &
      Record<Exclude<string, AllowedKeys>, never>;

    const sanitizedBody = body as ClientCreatePayload;

    const newClient: ClientData = {
      ...sanitizedBody as Partial<ClientData>,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      uniqueID: uuidv4(),
    } as ClientData;

    clients.push(newClient);
    writeJSON(clientsPath, clients);

    return NextResponse.json(
      { success: true, data: newClient }, 
      { status: 201 }
    );
  } catch (error) {
    console.error(`[ERROR][API][CLIENT][POST] -> ${error}`);
    return NextResponse.json(
      { success: false, message: `Failed to create a client`},
      { status: 500 }
    );
  }
}
