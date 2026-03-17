export type ClientData = {
  name:     string;       
  uniqueID: string;

  address:      string;
  alsoKnownBy:  string[];
  observations: string[];
  
  createdAt: string;
  updatedAt: string;
  
  isActive: boolean;
}
