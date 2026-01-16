'use client';

import React, { useEffect, useState } from 'react';

import { loadPrescriptions, loadClients, resolvePrescriptions } from '@/lib/utils/utils';
import { ClientData, PrescriptionData, ResolvedPrescription } from '@/app/Types/PrescriptionData';
import { PageContainer } from './page.styles';

import PrescriptionSheet from '@/components/PrescriptionSheet/PrescriptionSheet';
import PageLayout from '@/components/Layouts/Page/PageLayout';


export default function Page() {
  const [resolvedPrescriptions, setResolvedPrescriptions] = useState<ResolvedPrescription[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  
  useEffect(() => {
    loadPrescriptions(true).then((data) => setPrescriptions(data));
    loadClients(true).then((data) => setClients(data));
  }, []);

  useEffect(() => {
    setResolvedPrescriptions(resolvePrescriptions(prescriptions, clients));
  }, [prescriptions, clients]);

  return (
    <PageLayout>
      <PageContainer>

        {resolvedPrescriptions.map((p, idx) => (
          <PrescriptionSheet key={idx} data={p} />
        ))}

      </PageContainer>
    </PageLayout>
  );
}
