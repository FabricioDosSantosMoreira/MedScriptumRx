import styled from 'styled-components';

export const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${props => (props.$show ? 1 : 0)};
  visibility: ${props => (props.$show ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
`;

export const LeftCol = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const RightCol = styled.div`
  flex: 1;
  min-width: 200px;
  border-left: 1px solid #eee;
  padding-left: 16px;
`;

export const Field = styled.div`
  margin-bottom: 16px;
  span {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #555;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #66afe9;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #66afe9;
  }
`;

export const NumberInput = styled(Input).attrs({ type: 'number' })`
  /* inherits styles from Input */
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
  }
  span {
    user-select: none;
    color: #333;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

export const PrimaryButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #a0c4ff;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: #555;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
`;

export const DangerButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #e58e99;
    cursor: not-allowed;
  }
`;

export const List = styled.div`
  margin: 0;
  padding: 0;
`;

export const ListItem = styled.div`
  margin-bottom: 8px;
  background: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
`;

export const SmallButton = styled.button`
  padding: 4px 8px;
  background: #eee;
  color: #333;
  border: none;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
`;
