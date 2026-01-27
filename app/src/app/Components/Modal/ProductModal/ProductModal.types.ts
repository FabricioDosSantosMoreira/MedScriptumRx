import { ProductData } from '@/types/ProductData';

export type ProductModalProps = {
  show: boolean;
  product?: ProductData | null;
  
  onClose: () => void;
  onSaved: (saved: ProductData) => void;
  onDeleted?: (id: string) => void;
};
