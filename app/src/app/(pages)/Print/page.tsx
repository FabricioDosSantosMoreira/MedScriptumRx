'use client';

import React, { useEffect, useState } from 'react';

import { loadPrescriptionData } from '@/lib/utils/utils';
import { PrescriptionData } from '@/types/Index';

import PageLayout from '@/components/Layouts/Page/PageLayout';

import { 
  PageContainer,  
} from './page.styles';

import PrescriptionGroup from '@/components/PrescriptionGroup/PrescriptionGroup';


export default function Page() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);

  useEffect(() => {
    loadPrescriptionData().then((data) => setPrescriptions(data));
  }, []);


  // Split array into chunks
  const chunkArray = (arr: any[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const updatePrescriptionData = () => {
    loadPrescriptionData().then((data) => setPrescriptions(data));
  }

  // Separate single prescriptions from normal ones
  const singles = prescriptions.filter((p) => p.isSingle);
  const normals = prescriptions.filter((p) => !p.isSingle);

  // Chunk only the normal prescriptions
  const normalGroups: PrescriptionData[][] = chunkArray(normals, 2);

  // Create final groups
  const prescriptionGroups: PrescriptionData[][] = [
    ...singles.map((s) => [s]), // One group per single
    ...normalGroups,
  ];

  
  const groupActionButtons: GroupActionButtons[] = [
    {
      buttonName: "Imprimir 🖨️",
      buttonType: "print",
      buttonCallbackFunc: () => null
    },
    {
      buttonName: "Atualizar data.json 📕",
      buttonType: "update",
      buttonCallbackFunc: updatePrescriptionData
    }
  ];

  return (
    <PageLayout>
      <PageContainer>
        {prescriptionGroups.map((group, groupId) => (
          <PrescriptionGroup key={groupId} group={group} groupId={groupId} groupActionButtons={groupActionButtons} onDataUpdated={updatePrescriptionData} isHistoryData={false}/>
        ))}
      </PageContainer>
    </PageLayout>
  );
}
