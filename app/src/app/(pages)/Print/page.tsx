'use client';

import React, { useEffect, useState, useCallback } from 'react';

import PageLayout from '@/components/Layouts/Page/PageLayout';
import PrescriptionGroup from '@/components/PrescriptionGroup/PrescriptionGroup';

import { getPrescriptions } from '@/lib/utils/prescription';
import { getClients } from '@/lib/utils/client';
import { resolvePrescriptions } from '@/lib/resolvePrescriptions';

import { PageContainer } from './page.styles';

import { ResolvedPrescription } from '@/types/ResolvedPrescription';
import { PrescriptionData } from '@/types/PrescriptionData';
import { ClientData } from '@/types/ClientData';
import { GroupActionButtons } from '@/app/Types';

export default function Page() {
  const [prescriptions, setPrescriptions] = useState<ResolvedPrescription[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [rawPrescriptions, clients] = await Promise.all([
        getPrescriptions(),
        getClients(),
      ]);

      const filteredPrescriptions = rawPrescriptions.filter(p => p.isActive == true);

      const resolved = resolvePrescriptions(
        filteredPrescriptions as PrescriptionData[],
        clients as ClientData[]
      );

      setPrescriptions(resolved);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Erro carregando dados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // group helper
  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const singles = prescriptions.filter(p => p.isSingle);
  const normals = prescriptions.filter(p => !p.isSingle);

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

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PageLayout>
      <PageContainer>
        {prescriptionGroups.map((group, groupId) => (
          <PrescriptionGroup
            key={groupId}
            group={group}
            groupActionButtons={groupActionButtons}
            onDataUpdated={loadData}
          />
        ))}
      </PageContainer>
    </PageLayout>
  );
}