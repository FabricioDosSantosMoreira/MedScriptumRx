'use client';

import { HeaderButton, HeaderButtonsContainer, HeaderContainer } from './Header.styles';
import useHandleNavigation from '@/app/Hooks/useHandleNavigation';

export default function Header() {

  const handleNavigation = useHandleNavigation();

  return (
    <HeaderContainer>
        <HeaderButtonsContainer>
          <HeaderButton onClick={() => handleNavigation('./')}>Índice</HeaderButton>
          <HeaderButton onClick={() => handleNavigation('./Print/')}>Impressão</HeaderButton>
          <HeaderButton onClick={() => handleNavigation('./History/')}>Histórico</HeaderButton>
          <HeaderButton onClick={() => handleNavigation('./PickingList/')}>Lista</HeaderButton>

          <div style={{'marginLeft': '128px'}}></div>

          <HeaderButton onClick={() => handleNavigation('./Prescriptions/')}>Prescrições</HeaderButton>
          <HeaderButton onClick={() => handleNavigation('./Products/')}>Produtos</HeaderButton>
          <HeaderButton onClick={() => handleNavigation('./Clients/')}>Clientes</HeaderButton>
        </HeaderButtonsContainer>
    </HeaderContainer>
  );
}
