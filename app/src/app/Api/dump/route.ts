import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PrescriptionData } from "@/types/PrescriptionData";

const dataFilePath = path.join(process.cwd(), "public", "data", "data.json");
const dumpFilePath = path.join(process.cwd(), "public", "data", "dump_data.json");

export async function POST() {
  try {
    // Read the current data.json
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    const currentData: PrescriptionData[] = JSON.parse(fileContent);

    // Ensure dump_data.json exists
    if (!fs.existsSync(dumpFilePath)) {
      fs.writeFileSync(dumpFilePath, "[]", "utf-8");
    }

    // Load existing dump
    let dumpData: PrescriptionData[];
    try {
      const dumpContent = fs.readFileSync(dumpFilePath, "utf-8");
      dumpData = JSON.parse(dumpContent);

      if (!Array.isArray(dumpData)) {
        dumpData = [];
      }
    } catch {
      dumpData = [];
    }

    // For each item in currentData: update if exists, otherwise add
    currentData.forEach((item) => {
      const index = dumpData.findIndex((d) => d.uniqueID === item.uniqueID);
      if (index !== -1) {
        // update existing
        dumpData[index] = item;
      } else {
        // add new
        dumpData.push(item);
      }
    });

    console.log(dumpData);

    // Save back
    fs.writeFileSync(dumpFilePath, JSON.stringify(dumpData, null, 2), "utf-8");

    return NextResponse.json({ message: "Dump updated with current data.json" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to dump data" }, { status: 500 });
  }
}
