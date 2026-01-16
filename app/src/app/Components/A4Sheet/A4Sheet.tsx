"use client";

import React from "react";
import { A4SheetProps } from "./A4Sheet.types";
import { Sheet } from "./A4Sheet.styles";

export default function A4Sheet({
  children,
  orientation = "landscape",
  margin = "12mm",
  padding = "12mm",
  bgColor = "#fafafaff",
  outline = true,
  gap = '12px',
  justifyContent = "center",
}: A4SheetProps) {
  return (
      <Sheet
        $orientation={orientation}
        $margin={margin}
        $padding={padding}
        $bgColor={bgColor}
        $outline={outline}
        $gap={gap}
        $justifyContent={justifyContent}
      >
        {children}
      </Sheet>
  );
}
