'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrescriptionWrapper } from '@/components/A4Sheet/A4Sheet.styles';
import { getDateFormated } from '@/app/Lib/utils';

import {
  GroupActionButtons,
  PrescriptionData,
  ResolvedPrescription,
} from '@/app/Types/index';

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
  SidedButtonsContainer,
  TopRow,
  Row,
  SidePrintButton,
  SideContainer,
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

  /* ----------------------------------
     State
  ---------------------------------- */

  const [editingPrescription, setEditingPrescription] =
    useState<PrescriptionData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Index of prescription to print alone
  const [singlePrintIndex, setSinglePrintIndex] =
    useState<number | null>(null);


  /* ----------------------------------
     Refs
  ---------------------------------- */

  // Print ALL
  const allPrintRef = useRef<HTMLDivElement | null>(null);

  // Print ONE
  const singlePrintRef = useRef<HTMLDivElement | null>(null);


  /* ----------------------------------
     Titles
  ---------------------------------- */

  const groupTitle =
    group.length === 1
      ? group[0].client.name
      : group.map(p => p.client.name).join(', ');


  /* ----------------------------------
     Print All
  ---------------------------------- */

  const handlePrintAll = useReactToPrint({
    contentRef: allPrintRef,
    preserveAfterPrint: true,
    documentTitle: `[${getDateFormated()}] - Plano 0000 - [${groupTitle}]`,
  });


  /* ----------------------------------
     Print Single
  ---------------------------------- */

  const handlePrintSingle = useReactToPrint({
    contentRef: singlePrintRef,
    preserveAfterPrint: true,
    documentTitle: `[${getDateFormated()}] - Plano 0000 - ${
      singlePrintIndex !== null
        ? group[singlePrintIndex]?.client.name
        : ''
    }`,
  });


  /* ----------------------------------
     Auto print when index changes
  ---------------------------------- */

  useEffect(() => {
    if (singlePrintIndex !== null) {
      handlePrintSingle();
    }
  }, [singlePrintIndex, handlePrintSingle]);


  /* ----------------------------------
     Handlers
  ---------------------------------- */

  const handlePrintSinglePrescription = (index: number) => {
    setSinglePrintIndex(index);
  };


  const handleEdit = (prescription: PrescriptionData) => {
    setEditingPrescription(prescription);
    setIsModalOpen(true);
  };


  const handleModalSaved = async () => {
    setIsModalOpen(false);
    await getPrescriptions();
    onDataUpdated();
  };


  const handleModalDeleted = async () => {
    setIsModalOpen(false);
    await getPrescriptions();
    onDataUpdated();
  };


  /* ----------------------------------
     Buttons
  ---------------------------------- */

  const groupEditButtons = group.map((p) => ({
    buttonName: `Editar ${p.client.name.split(' ')[0]}`,
    buttonType: 'edit' as const,
    buttonCallbackFunc: () => handleEdit(p),
  }));


  const mergedButtons = [
    ...(groupActionButtons ?? []),
    ...groupEditButtons,
  ];


  /* ----------------------------------
     Render
  ---------------------------------- */

  return (
    <A4SheetsContainer>

      {/* ================= TOP BUTTONS ================= */}

      <TopRow>
        <ButtonsContainer className="no-print">

          {mergedButtons.map((btn, idx) => {

            if (btn.buttonType === 'print') {
              return (
                <PrintButton key={idx} onClick={handlePrintAll}>
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
      </TopRow>


      {/* ================= MAIN CONTENT ================= */}

      <Row>

        {/* SIDE PRINT BUTTONS */}

        <SideContainer>
          <SidedButtonsContainer>

            {group.map((_, idx) => (
              <SidePrintButton
                key={idx}
                onClick={() => handlePrintSinglePrescription(idx)}
              >
                🖨️
              </SidePrintButton>
            ))}

          </SidedButtonsContainer>
        </SideContainer>


        {/* PRINT ALL CONTAINER */}

        <PrintableContainer ref={allPrintRef}>
          <A4Sheet
            orientation="landscape"
            padding="24px"
            gap="12px"
            justifyContent={
              group.length <= 1 ? 'flex-start' : 'center'
            }
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

      </Row>


      {/* ================= HIDDEN SINGLE PRINT ================= */}

      <div style={{ display: 'none' }}>

        {singlePrintIndex !== null && (
          <PrintableContainer ref={singlePrintRef}>

            <A4Sheet
              orientation="landscape"
              padding="24px"
              gap="12px"
              justifyContent="flex-start"
            >

              <PrescriptionWrapper
                $orientation="landscape"
                $idx={1}
              >
                <PrescriptionSheet
                  resolvedPrescription={
                    group[singlePrintIndex]
                  }
                />
              </PrescriptionWrapper>

            </A4Sheet>

          </PrintableContainer>
        )}

      </div>


      {/* ================= MODAL ================= */}

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