'use client';

import styled from 'styled-components';

/* Page layout */
export const TableContainer = styled.div`
  min-height: 25vh;

  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
  padding: 28px;

  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0f172a;

  border-round: 25%;

  margin: 0 48px;
`;

export const ListContainer = styled.div`
  display: flex;

  padding: 28px;
  margin: 0 48px;

  align-items: center;
  justify-content: center;
  
`;




/* Header */
export const Header = styled.header`
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: #0b1220;
`;

/* Controls row */
export const ControlsRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0 20px;
  align-items: center;
`;

/* Search input */
export const SearchInput = styled.input`
  flex: 1;
  max-width: 420px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e6eef8;
  background: white;
  box-shadow: 0 1px 0 rgba(16,24,40,0.02);
  font-size: 14px;
  &:focus {
    outline: none;
    box-shadow: 0 6px 18px rgba(37,99,235,0.12);
    border-color: #2563eb;
  }
`;

/* Table wrapper */
export const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(13, 24, 44, 0.04);
  margin-bottom: 92px;
  overflow: auto;
`;

/* Table components */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: #fbfdff;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 10px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #eef3f8;
  font-size: 13px;
`;

export const Td = styled.td`
  padding: 12px 10px;
  vertical-align: middle;
  color: #16324f;
  border-bottom: 1px dashed #eef3f8;
  font-size: 13px;
`;

/* select in table */
export const PrescriptionSelect = styled.select`
  margin-top: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6eef8;
  font-size: 13px;
  background: #ffffff;
`;

/* small toggle button */
export const SmallToggle = styled.button`
  margin-left: 8px;
  margin-top: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e6eef8;
  font-size: 12px;
  cursor: pointer;
`;

/* collapsible product area */
export const CollapsibleProducts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 6px;
  border-radius: 8px;
  background: #ffffff;
`;

export const ProductRow = styled.div`
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 13px;
  color: #123;
`;

/* Footer bar fixed */
export const FooterBar = styled.div`

  padding: 12px 28px;
  background: rgba(255,255,255,0.96);
  border-top: 1px solid #eef3f8;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
  z-index: 1000;
`;

/* Buttons */
export const GerarButton = styled.button`
  background: linear-gradient(180deg,#2563eb,#1f4ed8);
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(37,99,235,0.14);
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const PrintButton = styled.button`
  background: #0f172a;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;


export const PickingTitle = styled.h1`
  display: flex;

  text-align: center;
  font-size: 18px;

  
  color: ${({ theme }) => theme.colors.black};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.8rem;
  font-weight: 400;
  
  margin-left: calc(50% - 122.5px);
`;


export const ClientName = styled.h2`
  text-align: flex-start;
  margin: 0 0 6px;
  font-size: 18px;

  color: ${({ theme }) => theme.colors.black};

  font-family: ${({ theme }) => theme.fonts.tilt_neon};
  font-style: normal;
  font-size: 1.2rem;
  font-weight: 400;
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  font-size: 12px;
  color: #334155;
  margin-bottom: 12px;
`;

/* Items table */
export const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
  font-size: 12px;
`;

export const ItemsTh = styled.th`
  border: 1px solid #0b1220;
  padding: 2px 0 2px 8px;
  text-align: left;
  font-weight: 700;
  background: #f8fafc;
`;

export const ItemsTd = styled.td<{ $maxWidth?: string }>`
  border: 1px solid #0b1220;


  padding: 2px 0 2px 8px;
  vertical-align: top;
  
  max-width: ${({ $maxWidth }) => $maxWidth};
`;

/* states */
export const EmptyState = styled.div`
  padding: 28px;
  text-align: center;
  color: #475569;
  background: #ffffff;
  border-radius: 10px;
`;

export const LoadingState = styled(EmptyState)``;

export const ErrorMessage = styled.div`
  color: #b91c1c;
  padding: 16px;
  background: #fff1f2;
  border-radius: 8px;
`;

export const PrintableContainer = styled.div`
  display: flex;

  width: max-content;
  height: max-content;

  margin: 0px;
`;