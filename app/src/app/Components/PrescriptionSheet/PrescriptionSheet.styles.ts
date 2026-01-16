
import styled, { css } from "styled-components";
import { Orientation } from "../A4Sheet/A4Sheet.types";
import Image from "next/image";


export const PrescriptionContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 530px;
  height: 680px;

  background-color: #adb4bd;
  border-radius: 12px;

  height: 744px;
  
  /* outline como área de corte */
  outline: 1px dashed #000;  /* pode ser solid/dotted */
  outline-offset: 0px;       /* espaço entre a div e a linha */
`;

export const Header = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
  height: 112px;

  background-color: #04bfad;

  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 264px;
    height: 6px;

    background-color: #f16d1e;
  }
`;

export const HeaderContent = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;
  
  margin-left: 30px;
  margin-top: 30px;
`;

export const HeaderTitle = styled.h1`
  
  font-size: 1.8rem;
  color: #fafad3;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.hvd_comic};
 
  line-height: 32px;

  transform: translateY(-4px);

  z-index: 2;

  span {
    letter-spacing: 1px;
  }
`;

export const HeaderLogo = styled(Image)`
  position: absolute;

  top: 0;
  right: 0;

  height: 36px;
  width: 36px;

  transform: translate(8px, -6px);

  z-index: 1;
`;

export const HeaderBanner = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: #505050;

  height: 100%;
  width: 96px;

  margin-right: 36px;

  &:after {
    content: '';

    position: absolute;
    bottom: -48px;

    width: 100%;
    height: 75%;

    border-radius: 45%;

    background-color: #505050;
  }
`;

export const HeaderBannerIcon = styled(Image)<{$displaced: boolean}>`
  position: absolute;

  bottom: -24px;
  left: 12px;

  height: 64px;
  width: 64px;

  z-index: 1;

  ${({ $displaced }) => $displaced && css`  
    z-index: 2;
    transform: translate(2px, 4px);
  `}
`;

export const CustomHeaderBannerIcon = styled.div`
  position: absolute;

  display: flex;

  bottom: -12px;
  left: 14px;

  height: 64px;
  width: 64px;

  z-index: 2;
  overflow: visible;
`;

export const CustomHeaderBannerIconPacientContent = styled.div`
  position: absolute;

  bottom: 0px;
  right: 18px;
`;

export const CustomHeaderBannerIconPacientBase = styled.div<{$displaced: boolean}>`
  position: absolute;

  bottom: 0px;
  left: 0px;

  height: 14px;
  width: 22px;

  border: 4px solid ${({ theme }) => theme.colors.orange};
  border-bottom: none;
  border-radius: 24px 24px 0 0;

  ${({ $displaced }) => $displaced && css`  

    width: 30px;
    height: 18px;
    
    border: 3px solid ${({ theme }) => theme.colors.green};

    transform: translate(0px, 7px);
    
    clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
    z-index: -1;
  `}
`;


export const CustomHeaderBannerIconPacientHead = styled.div<{$displaced: boolean}>`
  position: absolute;

  bottom: 12px;
  left: 4px;

  height: 16px;
  width: 16px;

  border: 4px solid ${({ theme }) => theme.colors.orange};
  border-radius: 50%;

  ${({ $displaced }) => $displaced && css`  
    width: 18px;
    height: 18px;

    border: 3px solid ${({ theme }) => theme.colors.green};

    transform: translate(2px, 5px);
    
    clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
    z-index: -1;
  `}
`;


export const CustomHeaderBannerIconCheckList = styled.div<{$pos: string, $displaced: boolean}>`
  position: absolute;

  left: 10px;
  height: 5px;

  ${({ $pos }) => $pos === 'top' && css`
    bottom: 48px;
    width: 24px;
  `};
  ${({ $pos }) => $pos === 'center' && css`
    bottom: 30px;
    width: 16px;
  `};
  ${({ $pos }) => $pos === 'bottom' && css`
    bottom: 12px;
    width: 12px;
  `};

  background-color: ${({ theme }) => theme.colors.orange};
  transform: translate(14px, 0px);

  ${({ $displaced }) => $displaced && css`  
    background-color: ${({ theme }) => theme.colors.green};
    transform: translate(16.5px, 2.5px);
    z-index: -1;
  `}


  &:before {
    content: '';

    position: absolute;
    bottom: 0px;
    left: -4px;

    height: 5px;
    width: 10px;

    background-color: ${({ theme }) => theme.colors.orange};
    transform: rotate(45deg) translate(-12px, 12px);

    ${({ $displaced }) => $displaced && css`  
      background-color: ${({ theme }) => theme.colors.green};
      z-index: -1;
      transform: rotate(45deg) translate(-13px, 14px);
    `}
  }

  &:after {
    content: '';

    position: absolute;
    bottom: 0px;
    left: -4px;

    height: 5px;
    width: 12px;

    background-color: ${({ theme }) => theme.colors.orange};

    transform: rotate(-45deg) translate(-8px, -10px);

    ${({ $displaced }) => $displaced && css`  
      background-color: ${({ theme }) => theme.colors.green};
      z-index: -1;
      transform: rotate(-45deg) translate(-11px, -11px);
    `}
  }
`;

export const PrescriptionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  position: relative;

  height: calc(100% - 112px);
  width: calc(100% - 24px - 12px);

  overflow: hidden;
`


export const PacientSpan = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  gap: 6px;

  width: 100%;
  height: 24px;

  margin-top: 24px;
  margin-left: 24px;
`

export const PacientIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  width: 24px;
  height: 24px;
`

export const PacientIconStyles = styled.div`
  position: relative;
  top: 6px;

  width: 24px;
  height: 12px; 

  border: 4px solid #fafad3;
  border-bottom: none; 
  border-radius: 36px 36px 0 0;

  &:after {
    content: '';

    position: absolute;
    top: -16px;

    width: 8px;
    height: 8px;

    border-radius: 50%;
    border: 4px solid #fafad3;
  }
  
`


export const PacientName = styled.h2`
  
  font-size: 2rem;
  color: #fafad3;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
 
  transform: translateY(0px);
`


export const ProductCard = styled.div`
  background-color: transparent;


  margin-top: 6px;
`


export const ProductList = styled.div`
  display: flex;
  flex-direction: column;

  overflow-y: none;
  margin-left: 24px;
`;


export const ProductSpan = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  gap: 2px;
`;

export const ProductName = styled.h3<{$isNameLong: boolean}>`
  
  font-size: 1rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
 
  line-height: 16px;
  transform: translateY(2.5px);

  ${({ $isNameLong }) => !$isNameLong && css`
    transform: translateY(4px);
    line-height: 24px;
  `}

  min-height: 24px;
`;


export const ProductIcon = styled.div`
  display: flex;
  // align-items: center;
  // justify-content: center;

  position: relative;

  min-width: 24px;
  min-height: 24px;
`;

export const ProductIconStyles = styled.div`
  position: relative;
  top: 0px;

  width: 20px;
  height: 16px; 

  border: 3px solid #000000;
  border-radius: 0 0 0 12px;

  border-top-width: 0px;
  border-right-width: 0px;

  &::after {
    content: '';

    position: absolute;
    right: -3px; /* alinhada ao fim da linha horizontal */
    bottom: -8px;

    width: 0;
    height: 0;

    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 7px solid #000; /* cor da seta */
  }
`







export const WhyToUseList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: row;
  
  margin-top: 2px;

  
  gap: 6px;
`



export const WhyToUseIconStyleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  
  min-width: 12px;
  min-height: 12px;
`

export const WhyToUseIconStyles = styled.div`
  position: absolute;
  top: 0px;
  left: 6px;

  width: 2.5px;
  height: 12px; 

  background-color: #f16d1e;
 
  transform: rotate(45deg);

  &::after {
    content: '';

    position: absolute;
    left: -2.5px; 
    bottom: -2.5px;

    width: 2.5px;
    height: 8px; 

    transform: rotate(90deg);
    background-color: #f16d1e;
  }
`




export const ProductWhyToUseContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  margin-left: 40px;

`


export const ProductWhyToUse = styled.span`
  font-size: 1rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  line-height: 16px;
`




export const CalendarIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 24px;
  min-height: 24px;

  z-index: 100;
`


export const CalendarIconStyle = styled.div<{
  $isHeader?: boolean;
  $isHandler?: boolean;
  $pos?: string;
  $topDates?: boolean;
  $bottomDates?: boolean;
  $isStringTooLong?: boolean;
}>`
  position: absolute;

  top: 2px; // Favor n remover
  left: 0px;

  width: 24px;
  height: 24px;

  background-color: transparent;
  
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  
  border: 2px solid black;

  
  // If the String is too long we want to align to the string
  ${({ $isStringTooLong }) => $isStringTooLong && css`
    top: 4px;
  `}


  ${({ $isHeader }) => $isHeader && css`
    position: absolute;

    top: 6px;
    left: 0px;

    width: 22px;
    height: 1.5px;

    border-radius: 0px;
    border: none;

    background-color: black;

    &:after {
      content: '';

      position: absolute;
      top: -6px;
      left: 0;

      width: 20px;
      height: 6px;

      background-color: #f16d1e;
    }

  `}

  ${({ $isHandler, $pos }) => $isHandler && css`
    position: absolute;

    top: 1px;
    left: calc(1.5px + ${$pos});

    width: 4px;
    height: 4px;

    border-radius: 50%;
    border: none;

    background-color: black;
    


    &:after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 1.5px;
      height: 6px;

      z-index: 1;
      background-color: black;
      border-radius: 2px;

      transform: translate(1.25px, -5px);
    }
  `}


  ${({ $topDates }) => $topDates && css`
    position: absolute;

    top: 9px;
    left: 8px;

    width: 4px;
    height: 4px;

    border-radius: unset;
    border: unset;

    background-color: #04bfad;
    background-color: black;

    &:before {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 4px;
      height: 4px;

      background-color: black;

      transform: translate(-6px, 0px);
    }

    &:after {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 4px;
      height: 4px;

      background-color: black;

      transform: translate(6px, 0px);
    }
  `}


  ${({ $bottomDates }) => $bottomDates && css`
    position: absolute;

    top: 15px;
    left: 8px;

    width: 4px;
    height: 4px;

    border-radius: unset;
    border: unset;

    background-color: #04bfad;
    background-color: black;

    &:before {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 4px;
      height: 4px;

      background-color: black;

      transform: translate(-6px, 0px);
    }

  `}
`

export const ProductHowToUseContainer = styled.div<{$isStringTooLong?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;



  gap: 6px;
  margin-left: 28px;
  margin-top: 6px;


  // If the String is too long we want to align at the start
  ${({ $isStringTooLong }) => $isStringTooLong && css`
    align-items: flex-start;
  `}
`

export const ProductHowToUse = styled.span`
  font-size: 1rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  line-height: 16px;

  z-index: 100;
`


export const ProductObservation = styled.h2`
  
  font-size: 0.9rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
 

  margin-top: 2px;
  margin-left: 58px;

  strong{
    color: #04bfad;
  }
`


export const ProductAlertIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  min-width: 24px;
  min-height: 24px;
`


export const ProductAlertIconStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  
  width: 4px;
  height: 16px;

  transform: translateY(-3px);

  background-color: #f16d1e;
  border-radius: 2px;

  &:after {
    content: '';

    position: absolute;
    bottom: -7px;
    left: 0;

    width: 4.25px;
    height: 4.25px;

    border-radius: 50%;

    background-color: #f16d1e;
  }


`

export const ProductAlertContainer = styled.div<{$isStringTooLong?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  margin-left: 50px;
  margin-top: 6px;

  // If the String is too long we want to align at the start
  ${({ $isStringTooLong }) => $isStringTooLong && css`
    align-items: flex-start;
  `}
`

export const ProductAlert = styled.span`
  font-size: 0.9rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  line-height: 16px;
`



export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  margin-top: auto;
  position: relative;

  min-width: 60%;
  min-height: 88px;

  z-index: 98;

  background-color: #505050;
  

  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
  
  &:after {
    content: '';
    position: absolute;
    right: -80px;
    top: 0;

    min-width: 160px;
    min-height: 160px;

    z-index: 99;

    background-color: #505050;

    border-radius: 50%;
  }
`








export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  height: 100%;

  gap: 6px;
  margin-left: 12px;

  background-color: #505050;

  position: relative;
  z-index: 2;

`

export const FooterInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;

  width: 100%;

  gap: 6px;
`

export const FooterInfo = styled.span`
  font-size: 0.8rem;
  color: #fafad3;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  line-height: 16px;
`

export const FooterIcon = styled(Image)`
  width: 24px;
  height: 24px;
`

export const MedicineIcon = styled(Image)<{$pos: number}>`
  position: absolute;
  top: 0;
  left: 0;


  z-index: 1;

  pointer-events: none; /* avoids stealing clicks */

  object-fit: contain;
  

  ${({ $pos }) => $pos === 1 && css`
    width: 36px;
    height: 36px;

    transform: translate(24px, -24px);
  `}

  ${({ $pos }) => $pos === 2 && css`
    width: 36px;
    height: 36px;

    transform: translate(96px, -20px) rotate(55deg);
  `}

  ${({ $pos }) => $pos === 3 && css`
    width: 36px;
    height: 36px;

    transform: translate(172px, -26px);
  `}

  ${({ $pos }) => $pos === 4 && css`
    width: 36px;
    height: 36px;

    transform: translate(236px, -26px);
  `}

  ${({ $pos }) => $pos === 5 && css`
    width: 36px;
    height: 36px;

    transform: translate(300px, -16px) rotate(180deg);
  `}

  ${({ $pos }) => $pos === 6 && css`
    width: 36px;
    height: 36px;

    transform: translate(348px, 24px) rotate(15deg);
  `}
`
