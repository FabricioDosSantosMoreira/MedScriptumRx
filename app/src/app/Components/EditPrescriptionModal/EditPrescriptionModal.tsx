'use client';

import React, { useRef, useState } from 'react';

import { ResolvedPrescription, ClientData, ProductData } from '@/types/Index';

import {
  Overlay,
  ButtonsRow,
  CancelButton,
  Modal,
  SaveButton,
  FormContainer,
  FormInner,
  FormHeader,
  FormHeaderTitle,
  FormHeaderContent,
  HistoryIconContainer,
  HistoryIconStyle,
  FormHeaderSelectContainer,
  FormHeaderButtonsContainer,
  PrescriptionContent,
  PacientIcon,
  PacientSpan,
  PacientIconStyles,
  PacientName,
  PrescriptionContainer,
  ProductList,
  ProductCard,
  ProductSpan,
  ProductIcon,
  CalendarIconContainer,
  CalendarIconStyle,
  ProductAlert,
  ProductAlertContainer,
  ProductAlertIconContainer,
  ProductAlertIconStyles,
  ProductHowToUse,
  ProductHowToUseContainer,
  ProductIconStyles,
  ProductName,
  ProductObservation,
  ProductWhyToUse,
  ProductWhyToUseContainer,
  WhyToUseIconStyleContainer,
  WhyToUseIconStyles,
  WhyToUseList,
  PaperIconContainer,
  PaperIconStyle,
  HistoryIconLabel,
  HistoryIconStyleContainer,
  PaperIconStyleContainer,
  PaperIconLabel,
  ProductDragHandle
} from './EditPrescriptionModal.styles';

import Scrollbar from '@/components/Layouts/ScrollbarY/ScrollbarY';
import GridBackground from '@/public/images/background/grid-01.jpg';

export default function EditPrescriptionModal({
  prescription,
  onClose,
  onSave
}: {
  prescription: ResolvedPrescription;
  onClose: () => void;
  onSave: (updated: ResolvedPrescription) => void;
}) {

  const [form, setForm] = useState<ResolvedPrescription>(prescription);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (index !== draggingIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggingIndex === null || draggingIndex === index) return;

    setForm(prev => ({
      ...prev,
      products: reorder(prev.products, draggingIndex, index)
    }));

    setDraggingIndex(null);
    setDragOverIndex(null);
  };


  // -------------------------
  // UPDATE HELPERS
  // -------------------------
  const updateField = <K extends keyof ResolvedPrescription>(
    field: K,
    value: ResolvedPrescription[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateClientField = <K extends keyof ClientData>(
    field: K,
    value: ClientData[K]
  ) => {
    setForm(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const updateProduct = <K extends keyof ProductData>(
    index: number,
    field: K,
    value: ProductData[K]
  ) => {
    const newProducts = [...form.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setForm(prev => ({ ...prev, products: newProducts }));
  };

  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <Overlay>
      <Modal>
        <FormContainer ref={modalRef} $bgImage={GridBackground}>
          <FormInner>

            <PrescriptionContainer>

              <FormHeader>
                <FormHeaderContent>
                  <FormHeaderTitle>Editar Prescrição</FormHeaderTitle>
                </FormHeaderContent>

                <FormHeaderSelectContainer>
                  <label>
                    <input
                      value={form.createdAt}
                      onChange={(e) => updateField('createdAt', e.target.value)}
                    />
                  </label>

                  <FormHeaderButtonsContainer>

                    
                    <HistoryIconContainer onClick={() => updateField('isActive', !form.isActive)}>
                      <HistoryIconLabel>{form.isActive ? 'Guardar' : 'Tirar'}</HistoryIconLabel>
                      <HistoryIconStyleContainer>
                        <HistoryIconStyle $isActive={form.isActive} $topCircle />
                        <HistoryIconStyle $isActive={form.isActive} $middleCircle />
                        <HistoryIconStyle $isActive={form.isActive} $bottomCircle />
                        <HistoryIconStyle $isActive={form.isActive} $leftBorder />
                        <HistoryIconStyle $isActive={form.isActive} $rightBorder />
                      </HistoryIconStyleContainer>
                    </HistoryIconContainer>

                    <PaperIconContainer onClick={() => updateField('isSingle', !form.isSingle)}>
                      <PaperIconLabel>{form.isSingle ? 'Agrupar' : 'Único'}</PaperIconLabel>
                      <PaperIconStyleContainer>
                        <PaperIconStyle $isActive={form.isSingle} $topCircle />
                        <PaperIconStyle $isActive={form.isSingle} $middleCircle />
                        <PaperIconStyle $isActive={form.isSingle} $bottomCircle />
                        <PaperIconStyle $isActive={form.isSingle} $leftBorder />
                        <PaperIconStyle $isActive={form.isSingle} $rightBorder />
                      </PaperIconStyleContainer>
                    </PaperIconContainer>
                  </FormHeaderButtonsContainer>
                </FormHeaderSelectContainer>
              </FormHeader>

              <PrescriptionContent>
                <PacientSpan>
                  {(form.args?.useNameIcon || form.args?.useNameIcon === undefined) && (
                    <PacientIcon>
                      <PacientIconStyles />
                    </PacientIcon>
                  )}

                  <PacientName
                    value={form.client.name}
                    onChange={(e) => updateClientField('name', e.target.value)}
                  />
                </PacientSpan>

                <ProductList>
                  {form.products.map((product, idx) => (
                 
                    <ProductCard
                      key={idx}
                      draggable
                      $isDragging={draggingIndex === idx}
                      $isDragOver={dragOverIndex === idx}
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <ProductDragHandle>
                        ⋮⋮
                      </ProductDragHandle>

                      <ProductSpan> 
                        <ProductIcon> 
                          <ProductIconStyles /> 
                        </ProductIcon> 
                        
                        <ProductName $isNameLong={product.name.length >= 62} value={product.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} /> 
                        
                      </ProductSpan>

                      {(product.whyToUse?.length ?? 0) > 0 && (
                        <ProductWhyToUseContainer>
                          {product.whyToUse
                            .filter(reason => reason.trim() !== '')
                            .map((reason, wIdx) => (
                              <WhyToUseList key={wIdx}>
                                {(product.args?.useListIcon || product.args?.useListIcon === undefined) && (
                                  <WhyToUseIconStyleContainer>
                                    <WhyToUseIconStyles />
                                  </WhyToUseIconStyleContainer>
                                )}

                                <ProductWhyToUse
                                  value={reason}
                                  onChange={(e) => {
                                    const updated = [...product.whyToUse];
                                    updated[wIdx] = e.target.value;
                                    updateProduct(idx, 'whyToUse', updated);
                                  }}
                                />
                              </WhyToUseList>
                            ))}
                        </ProductWhyToUseContainer>
                      )}

                      <ProductHowToUseContainer $isStringTooLong={product.howToUse.length > 108}>
                        {(product.args?.useCalendarIcon || product.args?.useCalendarIcon === undefined) && (
                          <CalendarIconContainer>
                            <CalendarIconStyle $isStringTooLong={product.howToUse.length > 108}>
                              <CalendarIconStyle $isHeader />
                              <CalendarIconStyle $isHandler $pos="0px" />
                              <CalendarIconStyle $isHandler $pos="6.5px" />
                              <CalendarIconStyle $isHandler $pos="13px" />
                              <CalendarIconStyle $bottomDates />
                              <CalendarIconStyle $topDates />
                            </CalendarIconStyle>
                          </CalendarIconContainer>
                        )}
                        <ProductHowToUse>{product.howToUse}</ProductHowToUse>
                      </ProductHowToUseContainer>

                      {product.observation && product.args?.useObservationIcon && (
                        <ProductObservation>
                          <strong>OBS: </strong>{product.observation}
                        </ProductObservation>
                      )}

                      {product.alert && product.args?.useAlertIcon && (
                        <ProductAlertContainer $isStringTooLong={product.alert.length > 110}>
                          <ProductAlertIconContainer>
                            <ProductAlertIconStyles />
                          </ProductAlertIconContainer>
                          <ProductAlert>{product.alert}</ProductAlert>
                        </ProductAlertContainer>
                      )}

                    </ProductCard>
                  ))}
                </ProductList>
              </PrescriptionContent>
            </PrescriptionContainer>

            <ButtonsRow>
              <CancelButton onClick={onClose}>Cancelar</CancelButton>
              <SaveButton onClick={() => onSave(form)}>Salvar</SaveButton>
            </ButtonsRow>

          </FormInner>
        </FormContainer>

        <Scrollbar contentRef={modalRef} />
      </Modal>
    </Overlay>
  );
}
