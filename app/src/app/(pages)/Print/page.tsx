'use client';

import React, { useEffect, useState } from 'react';

import PrescriptionGroup from '@/components/PrescriptionGroup/PrescriptionGroup';
import PageLayout from '@/components/Layouts/Page/PageLayout';

import { loadClients, loadPrescriptions } from '@/lib/utils/utils';
import { ResolvedPrescription } from '@/types/PrescriptionData';
import { resolvePrescriptions } from '@/lib/utils/utils';

import {
  PageContainer,
} from './page.styles';


export default function Page() {
  const [resolvedPrescriptions, setResolvedPrescriptions] = useState<ResolvedPrescription[]>([]);

  const loadData = async () => {
    const [prescriptions, clients] = await Promise.all([
      loadPrescriptions(true),
      loadClients(true),
    ]);

    const resolved = resolvePrescriptions(prescriptions, clients);
    setResolvedPrescriptions(resolved);
  };

  useEffect(() => {
    loadData();
  }, []);

  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const singles = resolvedPrescriptions.filter(p => p.isSingle);
  const normals = resolvedPrescriptions.filter(p => !p.isSingle);

  const normalGroups = chunkArray(normals, 2);

  const prescriptionGroups: ResolvedPrescription[][] = [
    ...singles.map(s => [s]),
    ...normalGroups,
  ];

  const groupActionButtons: GroupActionButtons[] = [
    {
      buttonName: 'Imprimir 🖨️',
      buttonType: 'print',
      buttonCallbackFunc: () => null,
    },
    {
      buttonName: 'Atualizar 💫',
      buttonType: 'update',
      buttonCallbackFunc: loadData,
    },
  ];

  return (
    <PageLayout>
      <PageContainer>
        {prescriptionGroups.map((group, groupId) => (
          <PrescriptionGroup
            key={groupId}
            group={group}
            groupId={groupId}
            groupActionButtons={groupActionButtons}
            onDataUpdated={loadData}
            isHistoryData={false}
          />
        ))}
      </PageContainer>
    </PageLayout>
  );
}
