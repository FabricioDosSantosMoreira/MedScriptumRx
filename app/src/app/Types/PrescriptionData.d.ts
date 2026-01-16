type PrescriptionArgs = {
  useNameIcon?: boolean;
};

type ProductArgs = {
  useListIcon?: boolean; 
  useAlertIcon?: boolean;
  useCalendarIcon?: boolean;
  useObservationIcon?: boolean;
};

export type ClientData = {
  name: string;
  also_known_by: string[];

  address: string;
  observations: string[];

  uniqueID: string;
  createdAt: string;
  
  isActive: boolean;
}

export type PrescriptionData = {
  args?: PrescriptionArgs;

  uniqueID: string;   // Prescription Unique ID (UUID4)
  createdAt: string;  // Prescription Datetime 
  clientID: string; // Prescription Client Name

  isActive: boolean;
  isSingle?: boolean; // Wheter or not a prescription must be on a single page
  
  products: {
    args:        ProductArgs;
    name:        string;
  
    howToUse:  string;
    whyToUse:  string[];

    observation: string;
    alert:       string;
  }[];
};




export type ResolvedPrescription = {
  /** Identidade */
  uniqueID: string;
  client: ClientData;

  createdAt: string;
 
  isActive: boolean;
  isSingle: boolean;

  products: ProductData[];

  args: PrescriptionArgs;
};
