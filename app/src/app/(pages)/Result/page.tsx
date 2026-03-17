'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { ClientData, PrescriptionData, ResolvedPrescription } from '@/app/Types/!Index';
import { PageContainer } from './page.styles';

import PrescriptionSheet from '@/components/PrescriptionSheet/PrescriptionSheet';
import PageLayout from '@/components/Layouts/Page/PageLayout';
import { getPrescriptions } from '@/lib/utils/prescription';
import { getClients } from '@/lib/utils/client';
import { resolvePrescriptions } from '@/app/Lib/resolvePrescriptions';


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
  
        const resolved = resolvePrescriptions(
          rawPrescriptions as PrescriptionData[],
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

  return (
    <PageLayout>
      <PageContainer>

          {prescriptions.map((p) => {
            return (
              <PrescriptionSheet
                key={p.uniqueID}
                resolvedPrescription={p}
              />
            );
          })}
      </PageContainer>
    </PageLayout>
  );
}
