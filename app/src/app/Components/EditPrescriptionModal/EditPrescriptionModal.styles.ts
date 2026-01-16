import styled, { css } from 'styled-components';

import defaultbgImage from '@/public/images/background/bg.jpg';
import { StaticImageData } from 'next/image';


export const Overlay = styled.div`
  position: fixed;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.75);

  z-index: 900;

`;

export const Modal = styled.div`
  position: relative;
  width: 35vw;

  /* SEM overflow aqui: o scroll fica no FormContainer */
  padding: 0; /* sem padding duplicado */
  background: transparent; /* Modal só contém o FormContainer visual */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormContainer = styled.div<{
  $bgImage: StaticImageData
}>`
  /* O container que realmente scrolla */
  position: relative;
  width: 35vw;
  max-height: 85vh;

  overflow-y: auto;
  overflow-x: hidden;

  /* importante: sem padding aqui */
  padding: 0;

  /* configuração para scrolling suave em mobile */
  -webkit-overflow-scrolling: touch;

  /* esconder scrollbar nativa se quiser */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }


  ${({ $bgImage }) => $bgImage && css`
    background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${$bgImage.src});

    background-size: cover;
    background-position: left top;
    background-repeat: no-repeat;
  `}
`;

export const FormInner = styled.div`
  /* O wrapper visual: é quem tem padding/borda/background */
  padding: 24px;
  background: transparent;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  align-items: center;

  margin-top: 42px;
  margin-left: 2px;



`;
export const ProductContainer = styled.div`
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #f6f6f6;
`;

export const ButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  background: #aaa;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
`;

export const SaveButton = styled.button`
  background: #2b7cff;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
`;







export const FormHeader = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
  height: 112px;

  background-color: ${({ theme }) => theme.colors.green};

  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 264px;
    height: 6px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;

export const FormHeaderContent = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;
  
  margin-left: 24px;
  margin-top: 24px;
`;

export const FormHeaderTitle = styled.h1`
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.hvd_comic};
  line-height: 32px;

  transform: translateY(-4px);

  span {
    letter-spacing: 1px;
  }
`;

export const FormHeaderSelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  width: 100%;

  margin-left: 24px;
  padding-right: 24px;
  margin-top: 0px;
`;

export const FormHeaderButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: 12px;
`;

export const HistoryIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 24px;
  min-height: 32px;

  background-color: transparent;
  cursor: pointer;
`

export const HistoryIconStyleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 24px;
  min-height: 32px;

  overflow: hidden;

  background-color: transparent;
  cursor: pointer;
`

export const HistoryIconLabel = styled.span`
  position: absolute;
  top: -16px;
  right: -16px;

  padding: 2px 6px;

  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1;

  border-radius: 999px;
  background-color: #111;
  color: #fff;

  white-space: nowrap;
  pointer-events: none;
  user-select: none;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  /* 🔹 estado inicial */
  opacity: 0;
  transform: translateY(4px) scale(0.95);
  transition: opacity 0.15s ease, transform 0.15s ease;

  /* 🔹 aparece no hover do container */
  ${HistoryIconContainer}:hover & {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;



export const HistoryIconStyle = styled.div<{
  $topCircle?: boolean;
  $middleCircle?: boolean;
  $bottomCircle?: boolean;
  $leftBorder?: boolean;
  $rightBorder?: boolean;
  $isActive?: boolean;
}>`
  position: absolute;

  width: 30px;
  height: 14px;

  background-color: transparent;

  ${({ $topCircle, $isActive }) => $topCircle && css`
    position: absolute;

    top: 0px;
    left: -3px;

    border: 2px solid black;

    border-radius: 45%;

    background-color: ${({ theme }) => theme.colors.green}; 

    z-index: 12;

    ${$isActive && css`
      background-color: ${({ theme }) => theme.colors.orange}; 
    `}
  `}
  
  ${({ $middleCircle, $isActive }) => $middleCircle && css`
    position: absolute;

    top: 8px;
    left: -3px;
 
    border: 2px solid black;

    border-radius: 45%;

    background-color: ${({ theme }) => theme.colors.green};

    z-index: 11;  

    
    ${$isActive && css`
      background-color: ${({ theme }) => theme.colors.orange}; 
    `}
  `}
  
  ${({ $bottomCircle, $isActive }) => $bottomCircle && css`
    position: absolute;

    top: 16px;
    left: -3px;

    border: 2px solid black;

    border-radius: 45%;

    background-color: ${({ theme }) => theme.colors.green};

    z-index: 10;

    ${$isActive && css`
      background-color: ${({ theme }) => theme.colors.orange}; 
    `}
  `}

  ${({ $leftBorder, $isActive }) => $leftBorder && css`
    position: absolute;

    top: 3px;
    left: 0px;

    height: 24px;
    width: 1.35px;
    background-color: ${({ theme }) => theme.colors.black};

    z-index: 13;
  `}

  ${({ $rightBorder, $isActive }) => $rightBorder && css`
    position: absolute;

    top: 3px;
    right: 0px;
    
    height: 24px;
    width: 1.5px;
    background-color: ${({ theme }) => theme.colors.black};

    z-index: 13;
  `}
`














export const PaperIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 48px;
  min-height: 32px;

  background-color: white;

  &:hover {
    cursor: pointer;
  }
`


export const PaperIconStyleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 48px;
  min-height: 32px;

  overflow: hidden;

  background-color: white;

  &:hover {
    cursor: pointer;
  }
`


export const PaperIconLabel = styled.span`
  position: absolute;
  top: -16px;
  right: -16px;

  padding: 2px 6px;

  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1;

  border-radius: 999px;
  background-color: #111;
  color: #fff;

  white-space: nowrap;
  pointer-events: none;
  user-select: none;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  /* 🔹 estado inicial */
  opacity: 0;
  transform: translateY(4px) scale(0.95);
  transition: opacity 0.15s ease, transform 0.15s ease;

  /* 🔹 aparece no hover do container */
  ${PaperIconContainer}:hover & {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;


export const PaperIconStyle = styled.div<{
  $isActive?: boolean;
}>`
  position: absolute;

  width: 30px;
  height: 14px;

  background-color: transparent;
`













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
  
  outline: 1px dashed #000;
  outline-offset: 0px; 
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


export const PacientName = styled.input`
  font-size: 2rem;
  color: #fafad3;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  border: none;
  background: transparent;
  outline: none;

  &:focus,
  &:focus-visible {
    border: none;
    background: transparent;
    outline: none;
  }

  &::placeholder {
    color: rgba(250, 250, 211, 0.5);
  }
`;


export const ProductCard = styled.div`
  background-color: transparent;

  margin-top: 6px;
`


export const ProductList = styled.div`
  display: flex;
  flex-direction: column;

  overflow-y: none;
  margin-left: 24px;

  width: -webkit-fill-available;
`;


export const ProductSpan = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  gap: 2px;
`;

export const ProductName = styled.textarea<{$isNameLong: boolean}>`
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  color: #000000;

  transform: translateY(0px);

  resize: none;
  overflow: hidden;

  min-width: calc(100% - 26px); // Icon Width + gap value

  ${({ $isNameLong }) => !$isNameLong && css`
    transform: translateY(4px);
    max-height: 24px;
  `}

  align-items: center;
  border: none;
  background: transparent;
  outline: none;

  &:focus,
  &:focus-visible {
    border: none;
    background: transparent;
    outline: none;
  }

  &::placeholder {
    color: rgba(250, 250, 211, 0.5);
  }
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

  width: 100%;
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


export const ProductWhyToUse = styled.textarea`
  font-size: 1rem;
  color: #000000;

  font-family: ${({ theme }) => theme.fonts.tilt_neon};

  resize: none;
  overflow: hidden;

  min-width: calc(100% - 18px); // Icon Width + gap value

  max-height: 18px;

  border: none;
  background: transparent;
  outline: none;

  &:focus,
  &:focus-visible {
    border: none;
    background: transparent;
    outline: none;
  }

  &::placeholder {
    color: rgba(250, 250, 211, 0.5);
  }
`




export const CalendarIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  min-width: 24px;
  min-height: 24px;


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
