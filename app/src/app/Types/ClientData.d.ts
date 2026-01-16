export type ClientData = {
  name: string;           
  also_known_by: string[];

  address: string;
  observations: string[];

  uniqueID: string;  // UUID4
  createdAt: string;
  
  isActive: boolean;
}
