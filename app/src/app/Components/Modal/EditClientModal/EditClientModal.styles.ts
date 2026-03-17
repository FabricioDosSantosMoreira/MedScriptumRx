import styled, { css } from 'styled-components';

export const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  display: ${({ $show }) => ($show ? 'flex' : 'none')};

  align-items: center;
  justify-content: center;
  background: rgba(4, 8, 15, 0.6);
  z-index: 1200;
  padding: 24px;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 920px;
  max-height: calc(100vh - 64px);
  background: linear-gradient(180deg, rgba(255,255,255,0.98), #fbfbfb);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(3, 10, 24, 0.5);
  overflow: auto;
  padding: 20px;
  position: relative;
  border: 1px solid rgba(0,0,0,0.04);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Title = styled.h2`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
`;

export const Input = styled.input<{ $small?: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-size: ${({ $small }) => ($small ? '0.9rem' : '1rem')};
  outline: none;
  &:focus { box-shadow: 0 0 0 3px rgba(35,150,240,0.06); border-color: rgba(35,150,240,0.3); }
`;

export const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  min-height: 84px;
  resize: vertical;
  outline: none;
  &:focus { box-shadow: 0 0 0 3px rgba(35,150,240,0.06); border-color: rgba(35,150,240,0.3); }
`;

export const NumberInput = styled(Input).attrs({ type: 'number' })``;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: flex-end;
`;

export const PrimaryButton = styled.button`
  background: linear-gradient(90deg,#2b9ef6,#2b76f6);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(43,158,246,0.18);
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const GhostButton = styled.button`
  background: transparent;
  border: 1px solid rgba(15,23,42,0.06);
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

export const DangerButton = styled.button`
  background: #ffdada;
  color: #8b0000;
  border: 1px solid rgba(139,0,0,0.06);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const SmallButton = styled.button`
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(15,23,42,0.06);
  background: white;
  cursor: pointer;
`;
