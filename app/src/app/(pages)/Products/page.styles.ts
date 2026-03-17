import Image from 'next/image';
import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: calc(100% - 112px );
  margin: 0px 56px;

  gap: 28px;
`;

export const TableContainer = styled.div`
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,250,252,0.98));
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15,23,42,0.04);
  border: 1px solid rgba(15,23,42,0.04);
`;








export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
`;

export const Controls = styled.div`
  display:flex;
  gap: 8px;
  align-items: center;
`;


export const ControlButton = styled.button`
  color: white;
  border: none;

  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);

  &:hover {
    opacity: 0.8;
    box-shadow: 0 26px 26px rgba(43,118,246,0.12);

  } 
`;

export const ControlButtonIcon = styled(Image)`
  height: 36px;
  width: 36px;
`;




export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 1fr));
  gap: 18px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(3,10,24,0.06);
  border: 1px solid rgba(3,10,24,0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
`;

export const Name = styled.h3`
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  word-break: break-word;
`;

export const TagList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Tag = styled.li`
  background: #f1f6ff;
  color: #153a6b;
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 0.85rem;
`;

export const Body = styled.div`
  font-size: 0.92rem;
  color: #243240;
  min-height: 60px;
`;

export const PriceRow = styled.div`
  display:flex;
  gap: 8px;
  align-items: baseline;
  margin-top: 6px;
`;

export const PriceFull = styled.span`
  font-weight: 700;
`;

export const PriceDiscount = styled.span`
  color: #8b0000;
  text-decoration: line-through;
  opacity: 0.7;
  font-size: 0.9rem;
`;

export const CardFooter = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
`;

export const ActionRow = styled.div`
  display:flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  font-size: 0.95rem;
`;

export const Empty = styled.div`
  text-align: center;
  padding: 24px;
  color: rgba(3,10,24,0.5);
`;
