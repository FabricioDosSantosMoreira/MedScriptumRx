import { ResolvedProductData } from '@/types';


type PrescriptionArgs = {
  useNameIcon?: boolean;
};

type ProductArgs = {
  useListIcon?:        boolean; 
  useAlertIcon?:       boolean;
  useCalendarIcon?:    boolean;
  useObservationIcon?: boolean;
};

export type PrescriptionData = {
  uniqueID:       string;
  clientUniqueID: string;
  
  products: ResolvedProductData[];

  productsTotalCost: number;
  deliveryCost:      number;
  finalPrice:        number;

  createdAt: string;
  updatedAt: string;
 
  isActive: boolean;
  isPayed:  boolean;
  hasDeliveryCost: boolean;

  args: PrescriptionArgs;
};
