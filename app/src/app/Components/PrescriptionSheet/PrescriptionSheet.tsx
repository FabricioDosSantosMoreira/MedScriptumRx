'use client';
import React, { useEffect } from 'react';

import { PrescriptionSheetProps } from './PrescriptionSheet.types';

import { PrescriptionContainer, Header, ProductList, 
  ProductCard, HeaderTitle, HeaderBanner, HeaderLogo, HeaderContent, 
  HeaderBannerIcon, PacientSpan, PacientIcon, PacientName, PacientIconStyles, 
  PrescriptionContent, ProductSpan, ProductIcon, ProductName, ProductIconStyles, 
  ProductWhyToUseContainer, ProductWhyToUse, WhyToUseList, WhyToUseIconStyles, 
  WhyToUseIconStyleContainer,
  CalendarIconContainer,
  CalendarIconStyle,
  ProductHowToUseContainer,
  ProductObservation,
  ProductAlertContainer,
  ProductAlertIconStyles,  ProductAlertIconContainer,
  ProductAlert,
  Footer,
  FooterContent,
  FooterIcon,
  FooterInfoContainer,
  FooterInfo,
  MedicineIcon,
  CustomHeaderBannerIcon,
  CustomHeaderBannerIconPacientBase,
  CustomHeaderBannerIconPacientHead,
  CustomHeaderBannerIconCheckList,
  CustomHeaderBannerIconPacientContent
} from './PrescriptionSheet.styles';


// Images
import LogoAssociadas from '@/public/images/logo/logo-rede-associadas.png';
import OrangeCheckList from '@/public/images/icons/icon-checklist-orange.png';
import BlueCheckList from '@/public/images/icons/icon-checklist-blue.png';

import MedicineIcon1 from '@/public/images/icons/icon-medicine-1.png';
import MedicineIcon2 from '@/public/images/icons/icon-medicine-2.png';
import MedicineIcon3 from '@/public/images/icons/icon-medicine-3.png';
import MedicineIcon4 from '@/public/images/icons/icon-medicine-4.png';
import MedicineIcon5 from '@/public/images/icons/icon-medicine-5.png';
import MedicineIcon6 from '@/public/images/icons/icon-medicine-6.png';

import WhatsAppIcon from '@/public/images/icons/icon-whatsapp.png';
import MapIcon from '@/public/images/icons/icon-map.png';
import { PrescriptionArgs, ProductArgs } from '@/app/Types/PrescriptionData';


export default function PrescriptionSheet({ data }: PrescriptionSheetProps) {

  const defaultPrescriptionArgs: PrescriptionArgs = {
    useNameIcon: true,
  };

  const defaulProductArgs: ProductArgs = {
    useListIcon: true,
    useAlertIcon: true,
    useCalendarIcon: true,
    useObservationIcon: true,
  };

  // Merge defaults with provided args
  const _prescriptionArgs: PrescriptionArgs = { ...defaultPrescriptionArgs, ...data?.args };

  // console.log(data);
  // console.log(_prescriptionArgs);
  
  return (
    <PrescriptionContainer>
      
      {/* Prescription Header */}
      <Header>

        {/* Prescription Content */}
        <HeaderContent>
          <HeaderTitle>PLANO DE<br/> <span>MEDICAÇÃO</span></HeaderTitle>
          <HeaderLogo src={LogoAssociadas} alt='Logo Associadas'/>
        </HeaderContent>

        {/* Header Banner */}
        <HeaderBanner>
          {/* <HeaderBannerIcon $displaced={false} src={BlueCheckList} alt='Top Banner Icon'/> 
          
          <HeaderBannerIcon $displaced={true} src={OrangeCheckList} alt='Bottom Banner Icon'/> */}

          <CustomHeaderBannerIcon>

            <CustomHeaderBannerIconPacientContent>
              <CustomHeaderBannerIconPacientBase $displaced={false} />
              <CustomHeaderBannerIconPacientBase $displaced={true} />
              <CustomHeaderBannerIconPacientHead $displaced={false} />
              <CustomHeaderBannerIconPacientHead $displaced={true} />
            </CustomHeaderBannerIconPacientContent>
          
            <CustomHeaderBannerIconCheckList $pos={'top'} $displaced={false}/>
            <CustomHeaderBannerIconCheckList $pos={'center'} $displaced={false}/>
            <CustomHeaderBannerIconCheckList $pos={'bottom'} $displaced={false}/>
            
            <CustomHeaderBannerIconCheckList $pos={'top'} $displaced={true}/>
            <CustomHeaderBannerIconCheckList $pos={'center'} $displaced={true}/>
            <CustomHeaderBannerIconCheckList $pos={'bottom'} $displaced={true}/>
          </CustomHeaderBannerIcon>
        </HeaderBanner>
      </Header>

      {/* Prescription Content */}
      <PrescriptionContent>
        
        <PacientSpan>
          {_prescriptionArgs.useNameIcon && (
            <PacientIcon>
              <PacientIconStyles />
            </PacientIcon>
          )}
          <PacientName>{data.clientName}</PacientName>
        </PacientSpan>

        {/* List of Products */}
        <ProductList>
        {data.products.map((product, idx) => {

          // Merge defaults with provided args
          const productArgs: ProductArgs = { ...defaulProductArgs, ...product.args };
          
          return (
            <ProductCard key={idx}>

              <ProductSpan>
                <ProductIcon>
                  <ProductIconStyles />
                </ProductIcon>
    
                <ProductName $isNameLong={product.name.length >= 62}>{product.name}</ProductName>
            
              </ProductSpan>

              <ProductWhyToUseContainer>
                {product.whyToUse
                  .filter((reason) => reason.toString().trim() !== "")
                  .map((reason, idx) => (
                    <WhyToUseList key={idx}>
                      {productArgs.useListIcon && (
                        <WhyToUseIconStyleContainer>
                          <WhyToUseIconStyles />
                        </WhyToUseIconStyleContainer>
                      )}

                      <ProductWhyToUse>{reason}</ProductWhyToUse>
                    </WhyToUseList>
                  ))}
              </ProductWhyToUseContainer>

              <ProductHowToUseContainer $isStringTooLong={product.howToUse.length > 108}>
                {productArgs.useCalendarIcon && ( 
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

              {product.observation && productArgs.useObservationIcon && (
                <ProductObservation><strong>OBS: </strong>{product.observation}</ProductObservation>
              )}

              {product.alert && productArgs.useAlertIcon && (
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
        
        {/* Prescription Footer */}
        <Footer>
          <MedicineIcon $pos={1} src={MedicineIcon1} alt="Medicine Icon 1"/>
          <MedicineIcon $pos={2} src={MedicineIcon2} alt="Medicine Icon 2"/>
          <MedicineIcon $pos={3} src={MedicineIcon3} alt="Medicine Icon 3"/>
          <MedicineIcon $pos={4} src={MedicineIcon4} alt="Medicine Icon 4"/>
          <MedicineIcon $pos={5} src={MedicineIcon5} alt="Medicine Icon 5"/>
          <MedicineIcon $pos={6} src={MedicineIcon6} alt="Medicine Icon 6"/>

          <FooterContent>
            <FooterInfoContainer>
              <FooterIcon src={MapIcon} alt='MapIcon'></FooterIcon>
              <FooterInfo>Rua Andrade Neves, 564 <br/> Centro, Rio Pardo - RS</FooterInfo>
            </FooterInfoContainer>
            
            <FooterInfoContainer>
              <FooterIcon src={WhatsAppIcon} alt='WhatsAppIcon'></FooterIcon>
              <FooterInfo>51 98167-0494</FooterInfo>
            </FooterInfoContainer>
            </FooterContent>
        </Footer>
      </PrescriptionContent>
    </PrescriptionContainer>
  );
}
