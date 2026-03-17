import styled, { css } from 'styled-components';

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 28px auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 120px;
`;

export const SubContainer = styled.section`
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,250,252,0.98));
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15,23,42,0.04);
  border: 1px solid rgba(15,23,42,0.04);
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
    letter-spacing: -0.2px;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 14px;
  align-items: center;
  justify-content: space-between;
`;

export const TwoColumnControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;
  label { font-size: 12px; color: #6b7280; }
`;

export const SearchInput = styled.input`
  flex: 1 1 420px;
  max-width: 680px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.06);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
  font-size: 14px;
  outline: none;
  transition: box-shadow .15s ease, border-color .15s ease;

  &:focus { border-color: rgba(59,130,246,0.9); box-shadow: 0 6px 20px rgba(59,130,246,0.08); }
`;

export const SmallInput = styled.input`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.06);
  outline: none;
  min-width: 110px;
  font-size: 13px;
`;

export const Select = styled.select`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.06);
  outline: none;
  font-size: 13px;
`;

export const Tag = styled.span`
  background: rgba(99,102,241,0.08);
  color: #4f46e5;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  display: inline-block;
`;

export const Button = styled.button<{ $outline?: boolean }>`
  border: none;
  background: #0f172a;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(15,23,42,0.06);

  ${(p) => p.$outline && css`
    background: transparent;
    color: #0f172a;
    border: 1px solid rgba(15,23,42,0.06);
    box-shadow: none;
  `}

  &:hover { transform: translateY(-1px); }
`;

export const TableWrapper = styled.div`
  margin-top: 12px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,0.04);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 900px;

  thead tr th {
    text-align: left;
    font-size: 12px;
    padding: 14px 18px;
    background: linear-gradient(180deg, rgba(250,250,252,1), rgba(245,247,250,1));
    color: #374151;
    position: sticky;
    top: 0;
  }

  tbody tr {
    transition: background .12s ease, transform .12s ease;
    border-bottom: 1px solid rgba(15,23,42,0.04);
  }

  tbody tr:hover { background: rgba(99,102,241,0.02); }

  td { padding: 14px 18px; font-size: 14px; vertical-align: middle; color: #0f172a; }

  td.center { text-align: center; }
  td.nowrap { white-space: nowrap; }
  td.final { font-weight: 700; }

  .muted { color: #6b7280; font-size: 13px; }

  .product-list { display:flex; gap:8px; flex-wrap:wrap; }
  .product-pill { background: rgba(15,23,42,0.04); padding: 6px 10px; border-radius: 999px; font-size: 13px; }
  .product-more { font-size: 13px; color: #6b7280; padding: 6px 8px; }
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: rgba(15,23,42,0.06);

  ${(p) => p.$danger && css`
    background: rgba(239,68,68,0.08);
    color: #dc2626;
  `}

  &:hover { transform: translateY(-1px); }
`;

export const EmptyState = styled.div`
  padding: 26px;
  text-align: center;
  color: #6b7280;
`;

export const LoadingRow = styled.div`
  padding: 26px;
  text-align: center;
  color: #6b7280;
`;
