'use client';

import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrescriptionWrapper } from '@/components/A4Sheet/A4Sheet.styles';
import { formatDate } from '@/lib/utils/utils';

import { ResolvedPrescription, PrescriptionData } from '@/types/PrescriptionData';

import PrescriptionSheet from '@/components/PrescriptionSheet/PrescriptionSheet';
import A4Sheet from '@/components/A4Sheet/A4Sheet';

import {
  PrintableContainer,
  A4SheetsContainer,
  ButtonsContainer,
  UpdateButton,
  PrintButton,
  EditButton,
} from './PrescriptionGroup.styles';

import EditPrescriptionModal from '@/components/EditPrescriptionModal/EditPrescriptionModal';

export default function PrescriptionGroup({
  group,
  groupId,
  groupActionButtons,
  onDataUpdated,
  isHistoryData,
}: {
  group: ResolvedPrescription[];
  groupId: number;
  groupActionButtons?: GroupActionButtons[];
  onDataUpdated: () => void;
  isHistoryData: boolean;
}) {

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const groupTitle =
    group.length === 1
      ? group[0].client.name
      : group.map(p => p.client.name).join(', ');

  const handlePrint = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    documentTitle: `[${formatDate()}] - Plano ${groupId} - [${groupTitle}]`,
  });

  // EDIT MODAL
  const [editingPrescription, setEditingPrescription] =
    useState<ResolvedPrescription | null>(null);

  const openEdit = (prescription: ResolvedPrescription) => {
    // create shallow copy to avoid mutating parent data
    setEditingPrescription(JSON.parse(JSON.stringify(prescription)));
  };

  // helper: convert ResolvedPrescription -> persisted PrescriptionData
  const toPersistedPrescription = (r: ResolvedPrescription): PrescriptionData => {
    return {
      uniqueID: r.uniqueID,
      clientID: r.client.uniqueID,
      createdAt: r.createdAt,
      isActive: r.isActive,
      isSingle: r.isSingle,
      products: r.products ?? [],
      args: r.args ?? {},
    };
  };

  // helper: upsert client then upsert prescription
  const saveEditedPrescription = async (updated: ResolvedPrescription) => {
    try {
      // 1) Upsert client
      const clientRes = await fetch('/Api/Clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: updated.client }),
      });

      if (!clientRes.ok) throw new Error('Failed to save client');

      const savedClient = await clientRes.json();
      const clientID = savedClient.uniqueID;

      // 2) Build persisted prescription using returned clientID
      const persisted = toPersistedPrescription({
        ...updated,
        client: { ...updated.client, uniqueID: clientID },
      });

      // 3) Upsert prescription
      const presRes = await fetch('/Api/Prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uniqueID: persisted.uniqueID,
          updatedData: persisted,
        }),
      });

      if (!presRes.ok) throw new Error('Failed to save prescription');

      // success: reload and close modal
      onDataUpdated();
      setEditingPrescription(null);
    } catch (err) {
      console.error('Error saving edited prescription:', err);
      // optionally show toast / alert
    }
  };

  const groupEditButtons = group.map((p) => ({
    buttonName: `Editar ${p.client.name.split(' ')[0]}`,
    buttonType: 'edit' as const,
    buttonCallbackFunc: () => openEdit(p),
  }));

  const mergedButtons = [
    ...(groupActionButtons ?? []),
    ...groupEditButtons,
  ];

  return (
    <A4SheetsContainer>

      <ButtonsContainer className="no-print">
        {mergedButtons.map((btn, idx) => {
          if (btn.buttonType === 'print') {
            return (
              <PrintButton key={idx} onClick={handlePrint}>
                {btn.buttonName}
              </PrintButton>
            );
          }

          if (btn.buttonType === 'update') {
            return (
              <UpdateButton key={idx} onClick={btn.buttonCallbackFunc}>
                {btn.buttonName}
              </UpdateButton>
            );
          }

          if (btn.buttonType === 'edit') {
            return (
              <EditButton key={idx} onClick={btn.buttonCallbackFunc}>
                {btn.buttonName}
              </EditButton>
            );
          }

          return null;
        })}
      </ButtonsContainer>

      <PrintableContainer ref={contentRef}>
        <A4Sheet
          orientation="landscape"
          padding="24px"
          gap="12px"
          justifyContent={group.length <= 1 ? 'flex-start' : 'center'}
        >
          {group.map((p, idx) => (
            <PrescriptionWrapper
              key={p.uniqueID}
              $orientation="landscape"
              $idx={idx + 1}
            >
              <PrescriptionSheet data={p} />
            </PrescriptionWrapper>
          ))}
        </A4Sheet>
      </PrintableContainer>

      {/* MODAL */}
      {editingPrescription && (
        <EditPrescriptionModal
          prescription={editingPrescription}
          onClose={() => setEditingPrescription(null)}
          onSave={saveEditedPrescription}
        />
      )}

    </A4SheetsContainer>
  );
}
