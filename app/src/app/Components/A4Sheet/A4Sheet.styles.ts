import styled, { css } from "styled-components";
import { Orientation } from "./A4Sheet.types";



const sheetSize = (o: Orientation) =>
    o === "portrait"
    ? css`
        width: 210mm;
        height: 297mm;
      `
    : css`
        width: 297mm;
        height: 210mm;
      `;
      

export const Sheet = styled.div<{
  $orientation: Orientation;
  $gap: string;
  $margin: string;
  $padding: string;
  $bgColor: string;
  $outline: boolean;
  $justifyContent: string;
  $alignItems: string;
}>`

  flex-direction: row;
  ${({ $orientation }) => $orientation === "portrait" && css`
    flex-direction: column;
  `}

  ${({ $orientation }) => sheetSize($orientation)};
  display: flex;
  justify-content: ${({ $justifyContent }) => $justifyContent};
  align-items: ${({ $alignItems }) => $alignItems};
  gap: ${({ $gap }) => $gap};
  padding: ${({ $padding }) => $padding};
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

  background-color: ${({ $bgColor }) => $bgColor};
`;


export const PrescriptionWrapper = styled.div<{
  $orientation: Orientation;
  $idx: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ $orientation, $idx }) => $orientation === "portrait" && $idx === 1 && css`
    transform: translate(0px, 75px) rotate(90deg);
  `}

  ${({ $orientation, $idx }) => $orientation === "portrait" && $idx === 2 && css`
    transform: translate(0px, -75px) rotate(90deg);
  `}
`;

