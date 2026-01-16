import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ClientData } from '@/types/PrescriptionData';
import { getDateTimedFormated } from '@/lib/utils/utils';

const clientsDataPath = path.join(
  process.cwd(),
  'public',
  'data',
  'clients.json'
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isActiveParam = searchParams.get('is_active');

  try {
    const raw = fs.readFileSync(clientsDataPath, 'utf-8');
    let clients: ClientData[] = JSON.parse(raw);

    let updated = false;

    clients = clients.map((c) => {
      const updatedC = { ...c };

      if (!updatedC.uniqueID) {
        updatedC.uniqueID = uuidv4();
        updated = true;
      }

      if (!updatedC.createdAt) {
        updatedC.createdAt = getDateTimedFormated();
        updated = true;
      }

      if (updatedC.isActive === undefined || updatedC.isActive === null) {
        updatedC.isActive = true;
        updated = true;
      }

      return updatedC;
    });

    // 💾 Persiste se houve correções
    if (updated) {
      console.warn('[WARN] -> Clients missing fields were auto-filled');
      fs.writeFileSync(
        clientsDataPath,
        JSON.stringify(clients, null, 2)
      );
    }

    // 🔎 Filtro por status
    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      clients = clients.filter(c => c.isActive === isActive);
    }

    return NextResponse.json(clients);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to read or update clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client } = body;

    if (!client) {
      return NextResponse.json({ error: 'Missing client in body' }, { status: 400 });
    }

    // read file (create if missing)
    let fileContent = '[]';
    try {
      fileContent = fs.readFileSync(clientsDataPath, 'utf-8');
    } catch (e) {
      // if file not exist, we'll create it below
    }

    let clients = [];
    try {
      clients = JSON.parse(fileContent);
    } catch (e) {
      clients = [];
    }

    // upsert
    const existingIndex = client.uniqueID ? clients.findIndex((c: any) => c.uniqueID === client.uniqueID) : -1;

    const now = getDateTimedFormated();

    if (existingIndex === -1) {
      // create
      const newClient = {
        uniqueID: client.uniqueID ?? uuidv4(),
        name: client.name ?? '',
        address: client.address ?? '',
        observations: Array.isArray(client.observations) ? client.observations : [],
        createdAt: client.createdAt ?? now,
        isActive: typeof client.isActive === 'boolean' ? client.isActive : true,
      };
      clients.push(newClient);
      fs.writeFileSync(clientsDataPath, JSON.stringify(clients, null, 2));
      return NextResponse.json(newClient);
    } else {
      // update existing
      const merged = {
        ...clients[existingIndex],
        ...client,
        uniqueID: clients[existingIndex].uniqueID,
        createdAt: clients[existingIndex].createdAt ?? now,
      };
      clients[existingIndex] = merged;
      fs.writeFileSync(clientsDataPath, JSON.stringify(clients, null, 2));
      return NextResponse.json(merged);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to upsert client' }, { status: 500 });
  }
}
