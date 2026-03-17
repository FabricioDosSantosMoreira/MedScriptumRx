// import styled from 'styled-components';

// export const Overlay = styled.div<{ $show: boolean }>`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: rgba(0, 0, 0, 0.4);
//   opacity: ${props => (props.$show ? 1 : 0)};
//   visibility: ${props => (props.$show ? 'visible' : 'hidden')};
//   transition: opacity 0.3s ease, visibility 0.3s ease;
//   z-index: 1000;
// `;

// export const Modal = styled.div`
//   background: #fff;
//   border-radius: 8px;
//   width: 90%;
//   max-width: 800px;
//   max-height: 90%;
//   overflow-y: auto;
//   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
// `;

// export const ModalHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 16px;
//   border-bottom: 1px solid #ddd;
// `;

// export const Title = styled.h2`
//   margin: 0;
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: #333;
// `;

// export const CloseButton = styled.button`
//   background: none;
//   border: none;
//   font-size: 1.2rem;
//   line-height: 1;
//   cursor: pointer;
//   padding: 4px;
//   color: #333;
// `;

// export const Form = styled.form`
//   display: flex;
//   flex-wrap: wrap;
//   padding: 16px;
//   gap: 24px;
// `;

// export const LeftCol = styled.div`
//   flex: 1;
//   min-width: 250px;
// `;

// export const RightCol = styled.div`
//   flex: 1;
//   min-width: 200px;
//   border-left: 1px solid #eee;
//   padding-left: 16px;
// `;

// export const Field = styled.div`
//   margin-bottom: 16px;
//   span {
//     display: block;
//     margin-bottom: 4px;
//     font-weight: 500;
//     color: #555;
//   }
// `;

// export const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 1rem;
//   &:focus {
//     outline: none;
//     border-color: #66afe9;
//   }
// `;

// export const Textarea = styled.textarea`
//   width: 100%;
//   height: 80px;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 1rem;
//   resize: vertical;
//   &:focus {
//     outline: none;
//     border-color: #66afe9;
//   }
// `;

// export const NumberInput = styled(Input).attrs({ type: 'number' })`
//   /* inherits styles from Input */
// `;

// export const ToggleRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   input[type="checkbox"] {
//     width: 16px;
//     height: 16px;
//     margin: 0;
//   }
//   span {
//     user-select: none;
//     color: #333;
//   }
// `;

// export const Actions = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 8px;
//   margin-top: 16px;
// `;

// export const PrimaryButton = styled.button`
//   padding: 8px 16px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   font-size: 0.95rem;
//   border-radius: 4px;
//   cursor: pointer;
//   &:disabled {
//     background-color: #a0c4ff;
//     cursor: not-allowed;
//   }
// `;

// export const GhostButton = styled.button`
//   padding: 8px 16px;
//   background: transparent;
//   color: #555;
//   border: 1px solid #ccc;
//   font-size: 0.95rem;
//   border-radius: 4px;
//   cursor: pointer;
// `;

// export const DangerButton = styled.button`
//   padding: 8px 16px;
//   background-color: #dc3545;
//   color: white;
//   border: none;
//   font-size: 0.95rem;
//   border-radius: 4px;
//   cursor: pointer;
//   &:disabled {
//     background-color: #e58e99;
//     cursor: not-allowed;
//   }
// `;

// export const List = styled.div`
//   margin: 0;
//   padding: 0;
// `;

// export const ListItem = styled.div`
//   margin-bottom: 8px;
//   background: #f9f9f9;
//   padding: 8px;
//   border-radius: 4px;
// `;

// export const SmallButton = styled.button`
//   padding: 4px 8px;
//   background: #eee;
//   color: #333;
//   border: none;
//   font-size: 0.8rem;
//   border-radius: 4px;
//   cursor: pointer;
// `;




import styled, { css, keyframes } from 'styled-components';

// Design tokens (you can move these to a theme file)
const vars = {
  radius: '12px',
  spacing: '12px',
  bg: '#ffffff',
  surface: '#f7f8fb',
  soft: '#f1f5f9',
  border: '#e6e9ef',
  primary: '#2563eb',
  primaryHover: '#1e4fd8',
  danger: '#ef4444',
  text: '#0f172a',
  muted: '#475569',
  shadow: '0 8px 30px rgba(12, 18, 31, 0.12)'
};

export const Overlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2,6,23,0.55);
  backdrop-filter: blur(4px) saturate(1.02);
  opacity: ${p => (p.$show ? 1 : 0)};
  visibility: ${p => (p.$show ? 'visible' : 'hidden')};
  transition: opacity 220ms ease, visibility 220ms ease;
  z-index: 1200;
  padding: 24px;
`;

export const Modal = styled.div`
  background: linear-gradient(180deg, ${vars.bg} 0%, ${vars.surface} 100%);
  border-radius: ${vars.radius};
  width: min(1150px, 98vw);
  max-height: calc(100vh - 80px);
  overflow: hidden;
  box-shadow: ${vars.shadow};
  display: flex;
  flex-direction: column;
  border: 1px solid ${vars.border};
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid ${vars.border};
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${vars.text};
  letter-spacing: -0.2px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  line-height: 1;
  border-radius: 8px;
  cursor: pointer;
  color: ${vars.muted};
  transition: background 130ms ease, color 130ms ease;

  &:hover { background: ${vars.soft}; color: ${vars.text}; }
  &:focus { outline: 3px solid rgba(37,99,235,0.15); }
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 18px;
  padding: 18px;
  overflow: auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftCol = styled.div`
  min-width: 320px;
`;

export const RightCol = styled.aside`
  min-width: 260px;
  border-left: 1px solid ${vars.border};
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const Field = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${vars.muted};
`;

const baseInput = css`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${vars.border};
  background: white;
  font-size: 0.98rem;
  color: ${vars.text};
  box-shadow: none;

  &:focus { outline: none; box-shadow: 0 0 0 4px rgba(37,99,235,0.06); border-color: ${vars.primary}; }
`;

export const Input = styled.input`
  ${baseInput}
`;

export const Textarea = styled.textarea`
  ${baseInput}
  min-height: 88px;
  resize: vertical;
`;

export const NumberInput = styled(Input).attrs({ type: 'number' })``;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${vars.text};

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${vars.primary};
  }
`;

export const InlineRow = styled.div`
  display:flex;
  gap:8px;
  align-items:center;
`;

export const Actions = styled.div`
  display:flex;
  justify-content:flex-end;
  gap:10px;
  padding: 10px 18px 18px;
`;

export const PrimaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: ${vars.primary};
  color: white;
  transition: transform 120ms ease, background 120ms ease;

  &:hover { background: ${vars.primaryHover}; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform:none; }
`;

export const GhostButton = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${vars.border};
  background: transparent;
  cursor: pointer;
`;

export const DangerButton = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: ${vars.danger};
  color: white;
  cursor: pointer;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.div`
  background: linear-gradient(180deg, #ffffff, ${vars.soft});
  border: 1px solid ${vars.border};
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(9,30,66,0.03);
`;

export const ProductHeader = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
`;

export const ProductTitle = styled.div`
  display:flex;
  flex-direction:column;
  gap:2px;
`;

export const ProductName = styled.div`
  font-weight:700;
  color: ${vars.text};
  font-size: 1rem;
`;

export const ProductMeta = styled.div`
  font-size: 0.82rem;
  color: ${vars.muted};
`;

export const CollapseButton = styled.button`
  background: transparent;
  border: 1px solid ${vars.border};
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight:600;
  display:flex;
  gap:8px;
  align-items:center;

  &:hover { background: ${vars.soft}; }
`;

const openAnim = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const ProductDetails = styled.div<{ $open: boolean }>`
  margin-top: 10px;
  overflow: hidden;
  transition: max-height 260ms ease, opacity 180ms ease;
  max-height: ${p => (p.$open ? '800px' : '0')};
  opacity: ${p => (p.$open ? 1 : 0)};
  animation: ${p => (p.$open ? css`${openAnim} 180ms ease` : 'none')};
  display: ${p => (p.$open ? 'block' : 'block')};
`;

export const SmallButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid ${vars.border};
  background: transparent;
  cursor: pointer;
  font-size: 0.86rem;
`;

export const IconButton = styled.button`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:6px;
  border-radius:8px;
  border:none;
  background:transparent;
  cursor:pointer;

  &:hover { background: ${vars.soft}; }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${vars.border};
  margin: 8px 0;
`;

export const Tag = styled.span`
  display:inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${vars.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const Badge = styled.span`
  display:inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${vars.soft};
  color: ${vars.muted};
  font-size: 0.77rem;
`;

// compact list view for 'only names' mode
export const CompactList = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;
`;

export const CompactItem = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #fff, #fbfdff);
  border: 1px solid ${vars.border};
`;

export const EmptyState = styled.div`
  padding: 18px;
  border-radius: 10px;
  border: 1px dashed ${vars.border};
  color: ${vars.muted};
  text-align: center;
`;

export const ErrorRow = styled.div`
  color: ${vars.danger};
  font-size: 0.85rem;
`;

// utilities
export const Helper = styled.div`
  font-size: 0.82rem;
  color: ${vars.muted};
`;

export const FooterActions = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding: 12px 18px;
  border-top: 1px solid ${vars.border};
`;

export default {};
