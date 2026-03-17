export type ProductData = {
  name:     string;  
  uniqueID: string;

  defaultWhyToUse:     string[]
  defaultHowToUse:     string;
  defaultObservation:  string;
  defaultPresentation: string;
  defaultAlert:        string;

  originalPrice:      number;
  discountedPrice:    number;  
  discountPercentage: number;

  createdAt: string;
  updatedAt: string;
  
  isActive: boolean;

  internalSystemID: string; // The Internal PDV ID
}
