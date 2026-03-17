import { PrescriptionData } from '@/app/Types/!Index';

export type PrescriptionModalProps = {
  show: boolean;
  prescription?: PrescriptionData | null;
  
  onClose: () => void;
  onSaved: (saved: PrescriptionData) => void;
  onDeleted?: (id: string) => void;
};
