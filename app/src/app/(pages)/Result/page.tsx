'use client';

import React, { useEffect, useRef, useState } from "react";
import A4Sheet from "@/components/A4Sheet/A4Sheet";
import PrescriptionSheet from "@/components/PrescriptionSheet/PrescriptionSheet";

import { loadPrescriptionData } from "@/lib/utils/utils";
import { PageContainer } from "./page.styles";
import PageLayout from "@/components/Layouts/Page/PageLayout";
import { PrescriptionWrapper } from "@/components/A4Sheet/A4Sheet.styles";
import { PrescriptionData } from "@/app/Types/PrescriptionData";

export default function Page() {
  //const prescriptions = loadPrescriptionData();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
  }

  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  
  useEffect(() => {
    loadPrescriptionData().then((data) => setPrescriptions(data));
  }, []);

  return (
    <PageLayout>
      <PageContainer>
        {/* <button onClick={handlePrint}>🖨️ Print Prescription</button> */}
       
            {prescriptions.map((p, idx) => (
                <PrescriptionSheet key={idx} data={p} />
            ))}
   
      </PageContainer>
    </PageLayout>
  );
}




