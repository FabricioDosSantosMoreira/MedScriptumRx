'use client';

import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrescriptionWrapper } from '@/components/A4Sheet/A4Sheet.styles';
import { formatDate } from '@/lib/utils/utils';
import { PrescriptionData } from '@/types/PrescriptionData';

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
  group: PrescriptionData[];
  groupId: number;
  groupActionButtons?: GroupActionButtons[];
  onDataUpdated: () => void; 
  isHistoryData: Boolean;
}) {

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const groupTitle =
    group.length === 1
      ? group[0].clientName
      : group.map((p) => p.clientName).join(', ');

  const handlePrint = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    documentTitle: `[${formatDate()}] - Plano ${groupId} - [${groupTitle}]`,
  });

  // ---------------------------------------
  // EDITAR PRESCRIÇÃO (POPUP)
  // ---------------------------------------
  const [editingPrescription, setEditingPrescription] =
    useState<PrescriptionData | null>(null);

  const openEdit = (prescription: PrescriptionData) => {
    setEditingPrescription(prescription);
  };

  const saveEditedPrescription = async (updated: PrescriptionData) => {
    console.log('got called = saveEditedPrescription')
    try {
      const res = await fetch("/Api/Prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updatedData: updated,
          uniqueID: updated.uniqueID,
          isHistoryData: isHistoryData
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update prescription");
      }

      // Recarrega dados no Page.tsx
      onDataUpdated();

      // Fecha modal
      setEditingPrescription(null);

    } catch (err) {
      console.error("Error updating prescription:", err);
    }
  };

  // Buttons específicos deste grupo
  const groupEditButtons = group.map((p) => ({
    buttonName: `Editar ${p.clientName.split(' ')[0]}`,
    buttonType: "edit" as const,
    buttonCallbackFunc: () => openEdit(p),
  }));

  // Merge entre botões externos + botões individuais
  //const mergedButtons = [...groupActionButtons, ...groupEditButtons];
  const mergedButtons = [
    ...(groupActionButtons ?? []),
    ...(groupEditButtons ?? []),
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
          orientation='landscape'
          padding='24px'
          gap='12px'
          justifyContent={group.length <= 1 ? 'flex-start' : 'center'}
        >
          {group.map((p, idx) => (
            <PrescriptionWrapper
              key={idx}
              $orientation='landscape'
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
          onSave={(updated) => saveEditedPrescription(updated)}
        />
      )}

    </A4SheetsContainer>
  );
}
