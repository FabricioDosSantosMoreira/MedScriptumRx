import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrescriptionData } from '@/types/PrescriptionData';
import { getDateTimedFormated } from '@/lib/utils/utils'; // adjust path if needed

const currentPrescriptionDataPath = path.join(process.cwd(), 'public', 'data', 'data.json');
const historyDataPath = path.join(process.cwd(), 'public', 'data', 'dump_data.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isHistoryData = searchParams.get("is_history_data");

  console.log("isHistoryData:", isHistoryData);

  try {

    let fileContent = '';
    let dataFilePath = '';

    // Escolhe arquivo com base no query param
    if (isHistoryData === 'true') {
      fileContent = fs.readFileSync(historyDataPath, 'utf-8');
      dataFilePath = historyDataPath
    } else {
      fileContent = fs.readFileSync(currentPrescriptionDataPath, 'utf-8');
      dataFilePath = currentPrescriptionDataPath
    }

    let prescriptions: PrescriptionData[] = JSON.parse(fileContent);
    let updated = false;

    prescriptions = prescriptions.map((p) => {
      let updatedThisItem = false;

      const updatedP = { ...p };

      if (!updatedP.uniqueID) {
        updatedP.uniqueID = uuidv4();
        updatedThisItem = true;
      }

      if (!updatedP.createdAt) {
        updatedP.createdAt = getDateTimedFormated();
        updatedThisItem = true;
      }

      if (updatedP.isActive === undefined || updatedP.isActive === null) {
        updatedP.isActive = true;
        updatedThisItem = true;
      }

      if (updatedP.isSingle === undefined || updatedP.isSingle === null) {
        updatedP.isSingle = false;
        updatedThisItem = true;
      }

      if (updatedThisItem) updated = true;
      return updatedP;
    });

    if (updated) {
      console.log("[WARN] -> Updated missing tags")
      fs.writeFileSync(dataFilePath, JSON.stringify(prescriptions, null, 2));
    }

    return NextResponse.json(prescriptions);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to read or update prescriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uniqueID, updatedData, isHistoryData } = body;

    if (!uniqueID || !updatedData) {
      return NextResponse.json(
        { error: "Missing parameters (uniqueID or updatedData)" },
        { status: 400 }
      );
    }

    const filePath = isHistoryData
      ? historyDataPath
      : currentPrescriptionDataPath;

    // Load correct file
    const fileContent = fs.readFileSync(filePath, "utf8");
    let prescriptions: PrescriptionData[] = JSON.parse(fileContent);

    const index = prescriptions.findIndex((p) => p.uniqueID === uniqueID);

    if (index === -1) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Update values
    prescriptions[index] = {
      ...prescriptions[index],
      ...updatedData,
      uniqueID: prescriptions[index].uniqueID, // keep original id
    };

    // Write back to current file
    fs.writeFileSync(filePath, JSON.stringify(prescriptions, null, 2));

    // ------------------------------------------------------------
    // MOVEMENT LOGIC: Always execute (coming from current OR history)
    // ------------------------------------------------------------
    const updated = prescriptions[index];

    // Load both files
    const historyFile = fs.readFileSync(historyDataPath, "utf8");
    let historyList: PrescriptionData[] = JSON.parse(historyFile);

    const currentFile = fs.readFileSync(currentPrescriptionDataPath, "utf8");
    let currentList: PrescriptionData[] = JSON.parse(currentFile);

    // --------------------------
    // CASE A — Move to history
    // --------------------------
    if (updated.isActive === false) {
      // Remove from current.json
      currentList = currentList.filter((p) => p.uniqueID !== uniqueID);

      // Insert/update in history
      const histIndex = historyList.findIndex((p) => p.uniqueID === uniqueID);

      if (histIndex === -1) historyList.push(updated);
      else historyList[histIndex] = updated;

      fs.writeFileSync(currentPrescriptionDataPath, JSON.stringify(currentList, null, 2));
      fs.writeFileSync(historyDataPath, JSON.stringify(historyList, null, 2));
    }

    // --------------------------
    // CASE B — Move to active
    // --------------------------
    else if (updated.isActive === true) {

      // Remove from history
      historyList = historyList.filter((p) => p.uniqueID !== uniqueID);

      // Insert/update in active list
      const curIndex = currentList.findIndex((p) => p.uniqueID === uniqueID);

      if (curIndex === -1) currentList.push(updated);
      else currentList[curIndex] = updated;

      fs.writeFileSync(currentPrescriptionDataPath, JSON.stringify(currentList, null, 2));
      fs.writeFileSync(historyDataPath, JSON.stringify(historyList, null, 2));
    }

    return NextResponse.json({
      success: true,
      updated: prescriptions[index],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update prescription" },
      { status: 500 }
    );
  }
}
