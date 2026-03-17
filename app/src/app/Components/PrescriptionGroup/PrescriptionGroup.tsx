'use client';

import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrescriptionWrapper } from '@/components/A4Sheet/A4Sheet.styles';
import { getDateFormated } from '@/app/Lib/utils';

import { PrescriptionData, ResolvedPrescription } from '@/app/Types/!Index';

import PrescriptionSheet from '@/components/PrescriptionSheet/PrescriptionSheet';
import A4Sheet from '@/components/A4Sheet/A4Sheet';
import EditPrescriptionModal from '@/components/Modal/EditPrescriptionModal/EditPrescriptionModal';


import {
  PrintableContainer,
  A4SheetsContainer,
  ButtonsContainer,
  UpdateButton,
  PrintButton,
  EditButton,
} from './PrescriptionGroup.styles';
import { getPrescriptions } from '@/app/Lib/utils/prescription';

export default function PrescriptionGroup({
  group,
  groupActionButtons,
  onDataUpdated,
}: {
  group: ResolvedPrescription[];
  groupActionButtons?: GroupActionButtons[];
  onDataUpdated: () => void;
}) {
  
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionData | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  

  
  const groupTitle =
    group.length === 1
      ? group[0].client.name
      : group.map(p => p.client.name).join(', ');

  const handlePrint = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    documentTitle: `[${getDateFormated()}] - Plano 0000 - [${groupTitle}]`,
  });

  const handleEdit = (prescription: PrescriptionData) => {
    setEditingPrescription(prescription);
    setIsModalOpen(true);
  };

  // After saving (create/update) refresh the list
    const handleModalSaved = (saved: PrescriptionData) => {
      setIsModalOpen(false);
      getPrescriptions().then(() => onDataUpdated());
    };
  
    // After deleting inside modal
    const handleModalDeleted = (id: string) => {
      setIsModalOpen(false);
      getPrescriptions().then(() => onDataUpdated());
    };
  

  const groupEditButtons = group.map((p) => ({
    buttonName: `Editar ${p.client.name.split(' ')[0]}`,
    buttonType: 'edit' as const,
    buttonCallbackFunc: () => handleEdit(p),
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
              <PrescriptionSheet resolvedPrescription={p} />
            </PrescriptionWrapper>
          ))}
        </A4Sheet>
      </PrintableContainer>

      {isModalOpen && (
        <EditPrescriptionModal
          show={isModalOpen}
          prescription={editingPrescription ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleModalSaved}
          onDeleted={handleModalDeleted}
        />
      )}

    </A4SheetsContainer>
  );
}
