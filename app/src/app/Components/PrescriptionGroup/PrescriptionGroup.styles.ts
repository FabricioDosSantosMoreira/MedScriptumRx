import styled from 'styled-components';

export const PrintableContainer = styled.div`
  display: flex;
  
  width: max-content;
  height: max-content;

  margin: 0px;
`;

export const A4SheetsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 100%;

  gap: 12px;
`;


export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 100%;

  margin-left: 128px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  height: 100%;

`;



export const SidedButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 100%;

  gap: 12px;
`;




export const SideContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;

  width: 128px;

  background-color: ${({ theme }) => theme.colors.gray};

  &:after {
    content: '';

    position: absolute;
    top: 0;
    right: 0;

    width: 4px;
    height: 100%;

    border-right: 4px dashed ${({ theme }) => theme.colors.text};

    transform: translateX(0px);
  }
`;


export const SidePrintButton = styled.button`
  position: relative;

  width: 48px;
  height: 48px;

  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 2px;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.2rem;
  font-weight: 400;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 4px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;


export const PrintButton = styled.button`
  position: relative;

  width: 112px;
  height: 38px;

  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 2px;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.2rem;
  font-weight: 400;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 4px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;

export const UpdateButton = styled.button`
  position: relative;

  width: 196px;
  height: 38px;

  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 2px;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.2rem;
  font-weight: 400;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 4px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;


export const EditButton = styled.button`
  position: relative;

  width: 196px;
  height: 38px;

  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 2px;

  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.2rem;
  font-weight: 400;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 4px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;
