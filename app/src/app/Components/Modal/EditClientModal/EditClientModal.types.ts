import { ClientData } from '@/app/Types/!Index';

export type ClientModalProps = {
  show: boolean;
  client?: ClientData | null;
  
  onClose: () => void;
  onSaved: (saved: ClientData) => void;
  onDeleted?: (id: string) => void;
};
