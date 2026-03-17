import React from "react";

export type Orientation = "portrait" | "landscape";

export type A4SheetProps = {
  children: React.ReactNode;
  /** portrait (210x297mm) | landscape (297x210mm) */
  orientation?: Orientation;
  /** margem da página (aplicada também no @page) ex: "12mm" */
  margin?: string;
  /** padding interno do conteúdo ex: "12mm" */
  padding?: string;
  /** cor/fundo do papel */
  bgColor?: string;
  /** desenha um contorno leve na visualização de tela */
  outline?: boolean;
  
  gap?: string

  justifyContent?: "center" | "flex-start"
  alignItems?: "center" | "flex-start"
};
