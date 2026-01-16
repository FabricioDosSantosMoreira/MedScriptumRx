// page.styles.ts
import styled from 'styled-components';

export const PageContainer = styled.div`
  font-family: ${props => props.theme.fonts.roboto};
  background: ${props => props.theme.colors.gray};
  min-height: 100vh;
  padding: 2rem;
  color: ${props => props.theme.colors.white};
`;

export const ClientList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const ClientItem = styled.div`
  background: ${props => props.theme.colors.black};
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px ${props => props.theme.colors.orange};
`;

export const ClientForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid ${props => props.theme.colors.orange};
  border-radius: 4px;
  background: ${props => props.theme.colors.white};
  font-size: 1rem;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  font-family: ${props => props.theme.fonts.workbench};
  background: ${props => (props.$primary ? props.theme.colors.green : 'transparent')};
  color: ${props => (props.$primary ? props.theme.colors.black : props.theme.colors.white)};
  border: 2px solid ${props => (props.$primary ? props.theme.colors.green : props.theme.colors.orange)};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
