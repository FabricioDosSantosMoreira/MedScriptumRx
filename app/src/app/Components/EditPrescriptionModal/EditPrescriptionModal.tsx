'use client';

import React, { useRef, useState } from 'react';

import { PrescriptionData } from '@/types/PrescriptionData';

import {
  Overlay,
  ButtonsRow,
  CancelButton,
  Modal,
  ProductContainer,
  SaveButton,
  FormContainer,
  FormInner,
  FormHeader,
  FormHeaderTitle, FormHeaderContent,
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
  WhyToUseList

} from './EditPrescriptionModal.styles'

import Scrollbar from '@/components/Layouts/ScrollbarY/ScrollbarY';

import GridBackground from '@/public/images/background/grid-01.jpg';



export default function EditPrescriptionModal({
  prescription,
  onClose,
  onSave
}: {
  prescription: PrescriptionData;
  onClose: () => void;
  onSave: (updated: PrescriptionData) => void;
}) {

  const [form, setForm] = useState<PrescriptionData>(prescription);

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...form.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setForm(prev => ({ ...prev, products: newProducts }));
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const isActive = true
  return (
    <Overlay >
      <Modal >

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
                    onChange={(e) => updateField("createdAt", e.target.value)}
                  />
                </label>

                <FormHeaderButtonsContainer>
                  <HistoryIconContainer>
                  <HistoryIconStyle $isActive={isActive} $topCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={isActive} $middleCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={isActive} $bottomCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={isActive} $leftBorder={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={isActive} $rightBorder={true}></HistoryIconStyle>
                </HistoryIconContainer>

                <HistoryIconContainer>
                  <HistoryIconStyle $isActive={false} $topCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={false} $middleCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={false} $bottomCircle={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={false} $leftBorder={true}></HistoryIconStyle>
                  <HistoryIconStyle $isActive={false} $rightBorder={true}></HistoryIconStyle>
                </HistoryIconContainer>

                </FormHeaderButtonsContainer>
                
              </FormHeaderSelectContainer>
              
            </FormHeader>
          
        
            
            <PrescriptionContent>
              <PacientSpan>

                {(form.args?.useNameIcon || form.args?.useNameIcon  == undefined)&& (
                  <PacientIcon>
                    <PacientIconStyles />
                  </PacientIcon>
                )}
            
                <PacientName 
                  value={form.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  >
                </PacientName>
              </PacientSpan>
            

              {/* List of Products */}
              <ProductList>
              {form.products.map((product, idx) => {
                return (
                  <ProductCard key={idx}>
      
                    <ProductSpan>
                      <ProductIcon>
                        <ProductIconStyles />
                      </ProductIcon>
          
                      <ProductName $isNameLong={product.name.length >= 62} value={product.name} onChange={(e) => updateProduct(idx, "name", e.target.value)}></ProductName>
                    </ProductSpan>
      
                    <ProductWhyToUseContainer>
                      {product.whyToUse
                        .filter((reason) => reason.toString().trim() !== "")
                        .map((reason, idx) => (
                          <WhyToUseList key={idx}>
                            {(product.args?.useListIcon || product.args?.useListIcon == undefined) && (
                              <WhyToUseIconStyleContainer>
                                <WhyToUseIconStyles />
                              </WhyToUseIconStyleContainer>
                            )}
      
                            <ProductWhyToUse>{reason}</ProductWhyToUse>
                          </WhyToUseList>
                        ))}
                    </ProductWhyToUseContainer>
      
                    <ProductHowToUseContainer $isStringTooLong={product.howToUse.length > 108}>
                      {(product.args?.useCalendarIcon || product.args?.useCalendarIcon == undefined) && ( 
                        <CalendarIconContainer>
                          <CalendarIconStyle $isStringTooLong={product.howToUse.length > 108}>
                          <CalendarIconStyle $isHeader />
                          <CalendarIconStyle $isHandler $pos={'0px'} />
                          <CalendarIconStyle $isHandler $pos={'6.5px'} />
                          <CalendarIconStyle $isHandler $pos={'13px'} />
                          <CalendarIconStyle $bottomDates />
                          <CalendarIconStyle $topDates />
                          </CalendarIconStyle>
                        </CalendarIconContainer>
                      )}
                      <ProductWhyToUse>{product.howToUse}</ProductWhyToUse>
                    </ProductHowToUseContainer>
      
                    {product.observation && product.args?.useObservationIcon && (
                      <ProductObservation><strong>OBS: </strong>{product.observation}</ProductObservation>
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
                )
              }
              )}
              </ProductList>
            </PrescriptionContent>
          </PrescriptionContainer>

            <label>
              <input
                value={form.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
              />
            </label>

            <label>Folha Única?:</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <label>
                <input
                  type="radio"
                  name="isSingle"
                  value="true"
                  checked={form.isSingle === true}
                  onChange={() => updateField("isSingle", true)}
                />
                Sim
              </label>

              <label>
                <input
                  type="radio"
                  name="isSingle"
                  value="false"
                  checked={form.isSingle === false}
                  onChange={() => updateField("isSingle", false)}
                />
                Não
              </label>
            </div>

            <label>Colocar no Histórico?:</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={form.isActive === false}
                  onChange={() => updateField("isActive", false)}
                />
                Sim
              </label>

              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={form.isActive === true}
                  onChange={() => updateField("isActive", true)}
                />
                Não
              </label>
            </div>


            <h3>Produtos:</h3>

            {form.products.map((prod, idx) => (
              <ProductContainer key={idx}>
                <label>
                  Nome do produto:
                  <input
                    value={prod.name}
                    onChange={(e) => updateProduct(idx, "name", e.target.value)}
                  />
                </label>

                <label>
                  Como usar:
                  <textarea
                    value={prod.howToUse}
                    onChange={(e) => updateProduct(idx, "howToUse", e.target.value)}
                  />
                </label>

                <label>
                  Observação:
                  <textarea
                    value={prod.observation}
                    onChange={(e) => updateProduct(idx, "observation", e.target.value)}
                  />
                </label>

                <label>
                  Alerta:
                  <textarea
                    value={prod.alert}
                    onChange={(e) => updateProduct(idx, "alert", e.target.value)}
                  />
                </label>

                <label>
                  Por que usar:
                  {prod.whyToUse.map((entry, wIdx) => (
                    <div key={wIdx} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <input
                        style={{ flex: 1 }}
                        value={entry}
                        onChange={(e) => {
                          const updatedList = [...prod.whyToUse];
                          updatedList[wIdx] = e.target.value;
                          updateProduct(idx, "whyToUse", updatedList);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const updatedList = prod.whyToUse.filter((_, i) => i !== wIdx);
                          updateProduct(idx, "whyToUse", updatedList);
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      updateProduct(idx, "whyToUse", [...prod.whyToUse, ""])
                    }
                  >
                    + Adicionar Linha
                  </button>
                </label>

              </ProductContainer>
            ))}

          <ButtonsRow>
            <CancelButton onClick={onClose}>Cancelar</CancelButton>
            <SaveButton onClick={() => onSave(form)}>Salvar</SaveButton>
          </ButtonsRow>

        </FormInner>

      
        </FormContainer>

            <Scrollbar contentRef={modalRef}></Scrollbar>
        
      </Modal>

    </Overlay>
  );
}
