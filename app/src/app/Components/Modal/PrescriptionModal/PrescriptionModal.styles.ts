// app/prescriptions/PrescriptionModal.styles.tsx
import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);

  h2 {
    margin-top: 0;
  }

  label {
    display: block;
    margin-top: 10px;
  }

  input[type="number"], select {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    th, td {
      border: 1px solid #ddd;
      padding: 5px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  }
`;

export const Button = styled.button`
  padding: 6px 12px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

export const SmallButton = styled.button`
  padding: 4px 8px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

export const ButtonRow = styled.div`
  margin-top: 20px;
  text-align: right;
`;
