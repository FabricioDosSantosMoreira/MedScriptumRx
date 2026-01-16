import { StaticImageData } from "next/image";

import { IBreakpoint } from '@/types/Breakpoint';


export type PageLayoutProps = {
  children: React.ReactNode;
};

export interface IPageWrapper extends IBreakpoint {
  $bgImage: StaticImageData;
};
