// === page.styles.ts ===
import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;  
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 28px 20px;
  width: 100%;
`;

export const QuerySelectorContainer = styled.div`
  display: flex;  
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  width: min(1000px, 95%);
  padding: 20px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  gap: 12px;
`;

export const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: end;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

export const Label = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted || '#666'};
  margin-bottom: 6px;
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e6e6e6'};
  background: ${({ theme }) => theme.colors.background || '#fff'};
  font-size: 0.95rem;
`;


export const PrintableContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;

  width: max-content;
  height: max-content;

  margin: 0px;
`;



export const DateInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e6e6e6'};
  font-size: 0.95rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  margin-top: 8px;
`;

export const PrintButton = styled.button`
  position: relative;
  width: 112px;
  height: 38px;
  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.orange};
    border-radius: 0 0 6px 6px;
  }
`;

export const UpdateButton = styled.button`
  position: relative;
  width: 160px;
  height: 38px;
  background-color: ${({ theme }) => theme.colors.green};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.orange};
    border-radius: 0 0 6px 6px;
  }
`;

export const ClearButton = styled.button`
  height: 38px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e6e6e6'};
  background: transparent;
  cursor: pointer;
`;

export const SortToggle = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.95rem;

  label {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;

    input[type='radio'] {
      width: 16px;
      height: 16px;
    }
  }
`;

export const EmptyState = styled.div`
  padding: 28px;
  color: ${({ theme }) => theme.colors.muted || '#777'};
  font-size: 1rem;
  background: transparent;
`;

export const A4SheetsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonsContainerLegacy = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 12px;
`;

export const UpdateButtonLegacy = UpdateButton; // keep backward compat
export const PrintButtonLegacy = PrintButton;



export const PrescriptionWrapper = styled.div``; // placeholder in case it's imported elsewhere
