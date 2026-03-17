import { ProductData } from '@/types/ProductData';

type ProductArgs = {
  useListIcon: boolean, 
  useAlertIcon: boolean, 
  useCalendarIcon: boolean, 
  useObservationIcon: boolean,
  disablePrint: boolean,
}

export type ResolvedProductData =
  Omit<
    ProductData,
    | 'defaultWhyToUse'
    | 'defaultHowToUse'
    | 'defaultObservation'
    | 'defaultPresentation'
    | 'defaultAlert'
  > & {
    args: ProductArgs;

    whyToUse:     string[];
    howToUse:     string;
    observation:  string;
    presentation: string;
    alert:        string;

    quantity: number;

    finalPrice?: number;
    internalSystemID: string;
};
