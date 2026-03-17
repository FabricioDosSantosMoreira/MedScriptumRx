import { ProductData } from '@/types/ProductData';


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
