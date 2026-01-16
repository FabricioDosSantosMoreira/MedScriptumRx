export type ProductData = {
  name:     string;  
  uniqueID: string;  // UUID4

  defaultWhyToUse:     string[]
  defaultHowToUse:     string;
  defaultObservation:  string;
  defaultAlert:        string;
  defaultPresentation: number;

  fullPriceTag:     number;
  discountPriceTag: number;
  defaultDiscount:  number;

  createdAt: string;
  updatedAt: string;
  
  isActive: boolean;
}