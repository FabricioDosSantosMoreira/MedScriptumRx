
import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 28px auto;
  padding: 24px;
  background: url('/images/background/grid-01.jpg');
  border-radius: 12px;
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

export const NewButton = styled.button`
  background: linear-gradient(90deg,#2b9ef6,#2b76f6);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 8px 26px rgba(43,118,246,0.12);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
