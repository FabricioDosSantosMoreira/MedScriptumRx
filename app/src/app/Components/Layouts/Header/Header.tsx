'use client';

import { HeaderButton, HeaderButtonsContainer, HeaderContainer } from "./Header.styles";
import useHandleNavigation from "@/app/Hooks/useHandleNavigation";

export default function Header() {

  const handleNavigation = useHandleNavigation();

  const dumpPrescriptionData = async () => {
    const response = await fetch("/Api/dump", { method: "POST" });
  }


  return (
    <HeaderContainer>
        <HeaderButtonsContainer>
          <HeaderButton onClick={() => handleNavigation("./")}>Índice</HeaderButton>
          <HeaderButton onClick={() => handleNavigation("./Print/")}>Impressão</HeaderButton>
          <HeaderButton onClick={() => handleNavigation("./History/")}>Histórico</HeaderButton>

          <HeaderButton onClick={() => dumpPrescriptionData()}>Dump Data.json</HeaderButton>
        </HeaderButtonsContainer>
    </HeaderContainer>
  );
}
