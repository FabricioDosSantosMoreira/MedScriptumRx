import { ClientData, ProductData } from './Index';

type PrescriptionArgs = {
  useNameIcon?: boolean;
};

type ProductArgs = {
  useListIcon?: boolean; 
  useAlertIcon?: boolean;
  useCalendarIcon?: boolean;
  useObservationIcon?: boolean;
};

export type ResolvedProductData = ProductData & {
  args: ProductArgs;
  finalPrice?: number // If not manually setted when creating, the system must calculate the final price
}

export type PrescriptionData = {
  uniqueID: string;
  clientUniqueID: string;
  
  products: ResolvedProductData[];

  productsTotalCost: number;
  deliveryCost: number;
  finalPrice?: number; // If not manually setted when creating, the system must calculate the final price

  createdAt: string;
  updatedAt: string;
 
  isActive: boolean;
  isSingle: boolean;
  isPayed: boolean;
  hasDeliveryCost: boolean;

  args: PrescriptionArgs;
};
