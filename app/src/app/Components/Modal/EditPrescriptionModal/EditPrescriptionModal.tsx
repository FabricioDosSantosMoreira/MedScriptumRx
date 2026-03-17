// 'use client';

// import React, { useEffect, useState } from 'react';
// import { PrescriptionData } from '@/types/PrescriptionData';
// import { ClientData, ResolvedProductData } from '@/app/Types/index';
// import { ProductData } from '@/types/ProductData';
// import { createPrescription, updatePrescription, deletePrescription } from '@/lib/utils/prescription';

// import {
//   Overlay,
//   Modal,
//   ModalHeader,
//   Title,
//   CloseButton,
//   Form,
//   LeftCol,
//   RightCol,
//   Field,
//   Input,
//   NumberInput,
//   ToggleRow,
//   Actions,
//   PrimaryButton,
//   GhostButton,
//   DangerButton,
//   List,
//   ListItem,
//   SmallButton
// } from './EditPrescriptionModal.styles';
// import { PrescriptionModalProps } from './EditPrescriptionModal.types';
// import { getClients } from '@/lib/utils/client';
// import { getProducts } from '@/lib/utils/product';

// // Default form state for a new prescription
// const emptyForm = (): Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'> => ({
//   clientUniqueID:    '',
//   products:          [],
//   productsTotalCost: 0,
//   deliveryCost:      0,
//   finalPrice:        0,
//   isActive:          true,
//   isSingle:          false,
//   isPayed:           false,
//   hasDeliveryCost:   true,
//   args:              { useNameIcon: true },
 
// });

// export default function EditPrescriptionModal({
//   show,
//   prescription,
//   onClose,
//   onSaved,
//   onDeleted
// }: PrescriptionModalProps) {
//   const [form, setForm] = useState<Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>>(emptyForm());
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [clients, setClients] = useState<ClientData[]>([]);
//   const [productsList, setProductsList] = useState<ProductData[]>([]);

//   // Fetch clients and products for dropdown suggestions when modal is shown
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const clientsData = await getClients();
//         setClients(clientsData);
//       } catch {
//         console.error('Error fetching clients');
//       }
//       try {
//         const productsData = await getProducts();
//         setProductsList(productsData);
//       } catch {
//         console.error('Error fetching products');
//       }
//     }
//     if (show) {
//       loadData();
//     }
//   }, [show]);

//   // Initialize form when editing or creating a prescription
//   useEffect(() => {
//     if (show) {
//       if (prescription) {
//         // Populate form with existing prescription data
//         setForm({
//           clientUniqueID: prescription.clientUniqueID,
//           products: prescription.products.map(p => ({
//             uniqueID: p.uniqueID,
//             name: p.name,
//             args: p.args || { useListIcon: true, useAlertIcon: true, useCalendarIcon: true, useObservationIcon: true },
//             finalPrice: p.finalPrice || 0,
//             quantity: p.quantity || 0,

//             whyToUse: p.whyToUse ?? [],
//             howToUse: p.howToUse ?? '',
//             observation: p.observation ?? '',
//             presentation: p.presentation ?? '',
//             alert: p.alert ?? '',
//             internalSystemID: p.internalSystemID ?? "null"
//           })) as unknown as ResolvedProductData[],

//           productsTotalCost: prescription.productsTotalCost,
//           deliveryCost:      prescription.deliveryCost,
//           finalPrice:        prescription.finalPrice || 0,
//           isActive:          prescription.isActive,
//           isSingle:          prescription.isSingle,
//           isPayed:           prescription.isPayed,
//           hasDeliveryCost:   prescription.hasDeliveryCost,
//           args:              prescription.args || { useNameIcon: true },

      
//         });
//       } else {
//         setForm(emptyForm());
//       }
//       setError(null);
//     }
//   }, [prescription, show]);

//   // Update a simple field in the form
//   function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
//     setForm(prev => ({ ...prev, [field]: value }));
//   }

//   // Add a new empty product entry
//   function addProduct() {
//     const newProduct: ResolvedProductData = {
//       uniqueID: '',
//       name: '',

//       // Defaults
//       whyToUse: [],
//       howToUse: '',
//       observation: '',
//       presentation: '',
//       quantity: 1,
//       alert: '',
//       internalSystemID: 'null',

//       args: {
//         useListIcon: true,
//         useAlertIcon: true,
//         useCalendarIcon: true,
//         useObservationIcon: true,
//       },

//       finalPrice: 0,
//     };

//     setForm(prev => ({
//       ...prev,
//       products: [...prev.products, newProduct],
//     }));
//   }

//   // Remove a product entry by index
//   function removeProduct(index: number) {
//     setForm(prev => {
//       const updated = [...prev.products];
//       updated.splice(index, 1);
//       return { ...prev, products: updated };
//     });
//   }

//   // Handle selecting a product by name: set uniqueID and default price
//   function handleProductSelection(index: number, name: string) {
//     const prod = productsList.find(p => p.name === name);

//     setForm(prev => {
//       const updated = [...prev.products];

//       if (prod) {
//         updated[index] = {
//           ...updated[index],

//           uniqueID: prod.uniqueID,
//           name: prod.name,

//           // Fill resolved fields from defaults
//           whyToUse:     [...(prod.defaultWhyToUse ?? [])],
//           howToUse:     prod.defaultHowToUse ?? '',
//           observation:  prod.defaultObservation ?? '',
//           quantity:     1,
//           presentation: prod.defaultPresentation ?? '',
//           alert:        prod.defaultAlert ?? '',
//           internalSystemID: prod.internalSystemID ?? 'null',

//           finalPrice:
//             prod.discountedPrice ??
//             prod.originalPrice ??
//             0,
//         };
//       } else {
//         updated[index] = {
//           ...updated[index],
//           uniqueID: '',
//           name,
//         };
//       }

//       return { ...prev, products: updated };
//     });
//   }

//   // Toggle icons for a product entry
//   function handleProductArgChange(index: number, arg: keyof ResolvedProductData['args'], value: boolean) {
//     setForm(prev => {
//       const updated = [...prev.products];
//       const prod = updated[index];
//       if (prod) {
//         prod.args = { ...prod.args, [arg]: value };
//       }
//       return { ...prev, products: updated };
//     });
//   }

//   // Update a product's final price manually
//   function handleProductFinalPriceChange(index: number, value: number) {
//     setForm(prev => {
//       const updated = [...prev.products];
//       const prod = updated[index];
//       if (prod) {
//         prod.finalPrice = value;
//       }
//       return { ...prev, products: updated };
//     });
//   }

//   // Compute the total of all product prices
//   const productsTotal = form.products.reduce((sum, p) => sum + (p.finalPrice * p.quantity || 0), 0);
//   const computedFinalPrice = productsTotal + (form.hasDeliveryCost ? form.deliveryCost : 0);

//   // Save (create or update) prescription
//   async function handleSave(e?: React.FormEvent) {
//     if (e) e.preventDefault();

//     // Ensure at least one product is selected
//     if (form.products.filter(p => p.uniqueID).length === 0) {
//       setError('Pelo menos um produto deve ser selecionado.');
//       return;
//     }

//     setSaving(true);
//     setError(null);
//     try {
//       const payload: any = { ...form };
//       // Remove any product entries without a valid ID
//       payload.products = payload.products.filter((p: any) => p.uniqueID);
//       payload.productsTotalCost = productsTotal;

//       // If finalPrice is falsy (e.g. 0 or empty), use computed value
//       if (!payload.finalPrice) {
//         payload.finalPrice = computedFinalPrice;
//       }

//       let response;
//       if (prescription && prescription.uniqueID) {
//         response = await updatePrescription(prescription.uniqueID, payload);
//       } else {
//         response = await createPrescription(payload);
//       }
//       onSaved(response);
//       onClose();
//     } catch (err: any) {
//       setError(`Erro ao salvar prescrição -> ${err?.message || err?.error}`);
//     } finally {
//       setSaving(false);
//     }
//   }

//   // Delete prescription
//   async function handleDelete() {
//     if (!prescription?.uniqueID) return;
//     if (!confirm('Deseja excluir esta prescrição? Essa ação é irreversível...')) return;
//     setDeleting(true);
//     setError(null);
//     try {
//       await deletePrescription(prescription.uniqueID);
//       onDeleted?.(prescription.uniqueID);
//       onClose();
//     } catch (err: any) {
//       setError(`Erro ao excluir prescrição -> ${err.message || err?.error}`);
//     } finally {
//       setDeleting(false);
//     }
//   }

//   // Resolve selected client name for display in input
//   const selectedClient = clients.find(c => c.uniqueID === form.clientUniqueID);

//   return (
//     <Overlay $show={show}>
//       <Modal role="dialog" aria-modal="true"
//              aria-label={prescription ? 'Editar Prescrição' : 'Nova Prescrição'}>
//         <ModalHeader>
//           <Title>{prescription ? 'Editar Prescrição' : 'Nova Prescrição'}</Title>
//           <div style={{ display: 'flex', gap: 8 }}>
//             {prescription && (
//               <DangerButton onClick={handleDelete} disabled={deleting}>
//                 {deleting ? 'Excluindo...' : 'Excluir'}
//               </DangerButton>
//             )}
//             <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
//           </div>
//         </ModalHeader>

//         <Form onSubmit={handleSave}>
//           <LeftCol>
//             <Field>
//               <span>Cliente</span>
//               <Input
//                 list="clients-list"
//                 value={selectedClient ? selectedClient.name : ''}
//                 onChange={e => {
//                   const name = e.target.value;
//                   const client = clients.find(c => c.name === name);
//                   updateField('clientUniqueID', client ? client.uniqueID : '');
//                 }}
//                 required
//               />
//               <datalist id="clients-list">
//                 {clients.map(c => (
//                   <option key={c.uniqueID} value={c.name} />
//                 ))}
//               </datalist>
//             </Field>

//             <Field>
//               <span>Produtos (Lista)</span>
//               <List>
//                 {form.products.map((p, idx) => (
//                   <ListItem key={idx}>
//                     <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
//                       <Input
//                         list="products-list"
//                         placeholder="Escolher produto"
//                         value={p.name}
//                         onChange={e => handleProductSelection(idx, e.target.value)}
//                         required
//                       />
//                       <NumberInput
//                         step="0.01"
//                         placeholder="Preço final"
//                         value={p.finalPrice === 0 ? '' : p.finalPrice}
//                         onChange={e => handleProductFinalPriceChange(idx, Number(e.target.value))}
//                       />
//                       <NumberInput
//                         step="1"
//                         placeholder="Quantidade"
//                         value={p.quantity === 0 ? 0 : p.quantity}
//                         onChange={e => {
//                           const val = e.target.value;

//                           setForm(prev => {
//                             const updated = [...prev.products];
//                             updated[idx].quantity = val;
//                             return { ...prev, products: updated };
//                           });
//                         }}
//                       />
//                       <SmallButton type="button" onClick={() => removeProduct(idx)}>
//                         Remover
//                       </SmallButton>
//                     </div>
//                     <ToggleRow style={{ marginTop: 4, gap: 8 }}>
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={p.args.useListIcon}
//                           onChange={e => handleProductArgChange(idx, 'useListIcon', e.target.checked)}
//                         />
//                         <span>Lista</span>
//                       </label>
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={p.args.useAlertIcon}
//                           onChange={e => handleProductArgChange(idx, 'useAlertIcon', e.target.checked)}
//                         />
//                         <span>Alerta</span>
//                       </label>
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={p.args.useCalendarIcon}
//                           onChange={e => handleProductArgChange(idx, 'useCalendarIcon', e.target.checked)}
//                         />
//                         <span>Calendário</span>
//                       </label>
//                       <label>
//                         <input
//                           type="checkbox"
//                           checked={p.args.useObservationIcon}
//                           onChange={e => handleProductArgChange(idx, 'useObservationIcon', e.target.checked)}
//                         />
//                         <span>Observação</span>
//                       </label>
//                     </ToggleRow>


//                     <Field style={{ marginTop: 8 }}>
//                       <span>Como Usar</span>
//                       <Input
//                         value={p.howToUse}
//                         onChange={e => {
//                           const val = e.target.value;

//                           setForm(prev => {
//                             const updated = [...prev.products];
//                             updated[idx].howToUse = val;
//                             return { ...prev, products: updated };
//                           });
//                         }}
//                       />
//                     </Field>

//                     <Field style={{ marginTop: 8 }}>
//                       <span>Por que Usar</span>
 
//                       {p.whyToUse.map((reason, rIdx) => (
//                         <div key={rIdx} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
//                           <Input
//                             placeholder="Motivo de uso"
//                             value={reason}
//                             onChange={e => {
//                               const val = e.target.value;

//                               setForm(prev => {
//                                 const updated = [...prev.products];
//                                 updated[idx].whyToUse[rIdx] = val;
//                                 return { ...prev, products: updated };
//                               });
//                             }}
//                           />

//                           <SmallButton
//                             type="button"
//                             onClick={() => {
//                               setForm(prev => {
//                                 const updated = [...prev.products];
//                                 updated[idx].whyToUse.splice(rIdx, 1);
//                                 return { ...prev, products: updated };
//                               });
//                             }}
//                           >
//                             ✕
//                           </SmallButton>
//                         </div>
//                       ))}

//                       <SmallButton
//                         type="button"
//                         onClick={() => {
//                           setForm(prev => {
//                             const updated = [...prev.products];
//                             updated[idx].whyToUse.push('');
//                             return { ...prev, products: updated };
//                           });
//                         }}
//                       >
//                         + Adicionar motivo
//                       </SmallButton>
//                     </Field>



//                     <Field>
//                       <span>Observação</span>
//                       <Input
//                         value={p.observation}
//                         onChange={e => {
//                           const val = e.target.value;

//                           setForm(prev => {
//                             const updated = [...prev.products];
//                             updated[idx].observation = val;
//                             return { ...prev, products: updated };
//                           });
//                         }}
//                       />
//                     </Field>

//                     <Field>
//                       <span>Alerta</span>
//                       <Input
//                         value={p.alert}
//                         onChange={e => {
//                           const val = e.target.value;

//                           setForm(prev => {
//                             const updated = [...prev.products];
//                             updated[idx].alert = val;
//                             return { ...prev, products: updated };
//                           });
//                         }}
//                       />
//                     </Field>
//                   </ListItem>
//                 ))}
//                 <SmallButton type="button" onClick={addProduct}>
//                   Adicionar Produto
//                 </SmallButton>
//               </List>
//               <datalist id="products-list">
//                 {productsList.map(prod => (
//                   <option key={prod.uniqueID} value={prod.name} />
//                 ))}
//               </datalist>
//             </Field>
//           </LeftCol>

//           <RightCol>
//             <Field>
//               <span>Ativo</span>
//               <ToggleRow>
//                 <input
//                   type="checkbox"
//                   checked={form.isActive}
//                   onChange={e => updateField('isActive', e.target.checked)}
//                 />
//                 <span>{form.isActive ? 'Ativo' : 'Inativo'}</span>
//               </ToggleRow>
//             </Field>

//             <Field>
//               <span>Única vez</span>
//               <ToggleRow>
//                 <input
//                   type="checkbox"
//                   checked={form.isSingle}
//                   onChange={e => updateField('isSingle', e.target.checked)}
//                 />
//                 <span>{form.isSingle ? 'Sim' : 'Não'}</span>
//               </ToggleRow>
//             </Field>

//             <Field>
//               <span>Pago</span>
//               <ToggleRow>
//                 <input
//                   type="checkbox"
//                   checked={form.isPayed}
//                   onChange={e => updateField('isPayed', e.target.checked)}
//                 />
//                 <span>{form.isPayed ? 'Sim' : 'Não'}</span>
//               </ToggleRow>
//             </Field>

//             <Field>
//               <span>Custo com entrega?</span>
//               <ToggleRow>
//                 <input
//                   type="checkbox"
//                   checked={form.hasDeliveryCost}
//                   onChange={e => updateField('hasDeliveryCost', e.target.checked)}
//                 />
//                 <span>{form.hasDeliveryCost ? 'Sim' : 'Não'}</span>
//               </ToggleRow>
//             </Field>

//             {form.hasDeliveryCost && (
//               <Field>
//                 <span>Custo de Entrega</span>
//                 <NumberInput
//                   step="0.01"
//                   value={form.deliveryCost}
//                   onChange={e => updateField('deliveryCost', Number(e.target.value))}
//                 />
//               </Field>
//             )}

//             <Field>
//               <span>Total Produtos</span>
//               <div>{productsTotal.toFixed(2)}</div>
//             </Field>

//             <Field>
//               <span>Preço Final</span>
//               <NumberInput
//                 step="0.01"
//                 placeholder={computedFinalPrice.toFixed(2)}
//                 value={form.finalPrice || ''}
//                 onChange={e => updateField('finalPrice', Number(e.target.value))}
//               />
//             </Field>

//             {error && <div style={{ color: '#8b0000', fontSize: 13 }}>{error}</div>}

//             <Actions>
//               <GhostButton type="button" onClick={onClose}>Cancelar</GhostButton>
//               <PrimaryButton type="submit" disabled={saving}>
//                 {saving ? 'Salvando...' : 'Salvar'}
//               </PrimaryButton>
//             </Actions>
//           </RightCol>
//         </Form>
//       </Modal>
//     </Overlay>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { PrescriptionData } from '@/types/PrescriptionData';
import { ClientData, ResolvedProductData } from '@/app/Types/index';
import { ProductData } from '@/types/ProductData';
import { createPrescription, updatePrescription, deletePrescription } from '@/lib/utils/prescription';

import {
  Overlay,
  Modal,
  ModalHeader,
  Title,
  CloseButton,
  Body,
  LeftCol,
  RightCol,
  Form,
  Field,
  Label,
  Input,
  NumberInput,
  Textarea,
  ToggleRow,
  List,
  ListItem,
  ProductHeader,
  ProductTitle,
  ProductName,
  ProductMeta,
  CollapseButton,
  ProductDetails,
  SmallButton,
  CompactList,
  CompactItem,
  Divider,
  Actions,
  PrimaryButton,
  GhostButton,
  DangerButton,
  IconButton,
  FooterActions,
  ErrorRow,
  Helper,
  EmptyState,
} from './EditPrescriptionModal.styles';
import { PrescriptionModalProps } from './EditPrescriptionModal.types';
import { getClients } from '@/lib/utils/client';
import { getProducts } from '@/lib/utils/product';

// Default form state for a new prescription
const emptyForm = (): Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'> => ({
  clientUniqueID:    '',
  products:          [],
  productsTotalCost: 0,
  deliveryCost:      0,
  finalPrice:        0,
  isActive:          true,
  isSingle:          false,
  isPayed:           false,
  hasDeliveryCost:   true,
  args:              { useNameIcon: true },
});

export default function EditPrescriptionModal({
  show,
  prescription,
  onClose,
  onSaved,
  onDeleted
}: PrescriptionModalProps) {
  const [form, setForm] = useState<Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clients, setClients] = useState<ClientData[]>([]);
  const [productsList, setProductsList] = useState<ProductData[]>([]);

  // compact mode: when true show only names by default; user can expand each product
  const [compactMode, setCompactMode] = useState(true);

  // track which product indexes are open (expanded)
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  // Fetch clients and products for dropdown suggestions when modal is shown
  useEffect(() => {
    async function loadData() {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch {
        console.error('Error fetching clients');
      }
      try {
        const productsData = await getProducts();
        setProductsList(productsData);
      } catch {
        console.error('Error fetching products');
      }
    }
    if (show) {
      loadData();
    }
  }, [show]);

  // Initialize form when editing or creating a prescription
  useEffect(() => {
    if (show) {
      if (prescription) {
        // Populate form with existing prescription data
        setForm({
          clientUniqueID: prescription.clientUniqueID,
          products: prescription.products.map(p => ({
            uniqueID: p.uniqueID,
            name: p.name,
            args: p.args || { useListIcon: true, useAlertIcon: true, useCalendarIcon: true, useObservationIcon: true },
            finalPrice: p.finalPrice || 0,
            quantity: p.quantity || 0,

            whyToUse: p.whyToUse ?? [],
            howToUse: p.howToUse ?? '',
            observation: p.observation ?? '',
            presentation: p.presentation ?? '',
            alert: p.alert ?? '',
            internalSystemID: p.internalSystemID ?? "null"
          })) as unknown as ResolvedProductData[],

          productsTotalCost: prescription.productsTotalCost,
          deliveryCost:      prescription.deliveryCost,
          finalPrice:        prescription.finalPrice || 0,
          isActive:          prescription.isActive,
          isSingle:          prescription.isSingle,
          isPayed:           prescription.isPayed,
          hasDeliveryCost:   prescription.hasDeliveryCost,
          args:              prescription.args || { useNameIcon: true },
        });

        // default compact mode true and close all product details
        setCompactMode(true);
        setOpenIndexes({});
      } else {
        setForm(emptyForm());
        setCompactMode(true);
        setOpenIndexes({});
      }
      setError(null);
    }
  }, [prescription, show]);

  // whenever the number of products changes, ensure openIndexes has corresponding keys
  useEffect(() => {
    const next: Record<number, boolean> = { ...openIndexes };
    form.products.forEach((_, i) => {
      if (next[i] === undefined) next[i] = false;
    });
    // remove any stale keys
    Object.keys(next).forEach(k => {
      if (Number(k) >= form.products.length) delete next[Number(k)];
    });
    setOpenIndexes(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.products.length]);

  // Update a simple field in the form
  function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Add a new empty product entry
  function addProduct() {
    const newProduct: ResolvedProductData = {
      uniqueID: '',
      name: '',

      // Defaults
      whyToUse: [],
      howToUse: '',
      observation: '',
      presentation: '',
      quantity: 1,
      alert: '',
      internalSystemID: 'null',

      args: {
        useListIcon: true,
        useAlertIcon: true,
        useCalendarIcon: true,
        useObservationIcon: true,
      },

      finalPrice: 0,
    };

    setForm(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));

    // open newly added product
    setOpenIndexes(prev => ({ ...prev, [form.products.length]: true }));
    setCompactMode(false);
  }

  // Remove a product entry by index
  function removeProduct(index: number) {
    setForm(prev => {
      const updated = [...prev.products];
      updated.splice(index, 1);
      return { ...prev, products: updated };
    });
    setOpenIndexes(prev => {
      const copy = { ...prev };
      delete copy[index];
      // shift keys after removed index
      const shifted: Record<number, boolean> = {};
      Object.keys(copy).forEach(k => {
        const n = Number(k);
        shifted[n < index ? n : n - 1] = copy[n];
      });
      return shifted;
    });
  }

  // Handle selecting a product by name: set uniqueID and default price
  function handleProductSelection(index: number, name: string) {
    const prod = productsList.find(p => p.name === name);

    setForm(prev => {
      const updated = [...prev.products];

      if (prod) {
        updated[index] = {
          ...updated[index],

          uniqueID: prod.uniqueID,
          name: prod.name,

          // Fill resolved fields from defaults
          whyToUse:     [...(prod.defaultWhyToUse ?? [])],
          howToUse:     prod.defaultHowToUse ?? '',
          observation:  prod.defaultObservation ?? '',
          quantity:     1,
          presentation: prod.defaultPresentation ?? '',
          alert:        prod.defaultAlert ?? '',
          internalSystemID: prod.internalSystemID ?? 'null',

          finalPrice:
            prod.discountedPrice ??
            prod.originalPrice ??
            0,
        };
      } else {
        updated[index] = {
          ...updated[index],
          uniqueID: '',
          name,
        };
      }

      return { ...prev, products: updated };
    });

    // auto-open details for selection
    setOpenIndexes(prev => ({ ...prev, [index]: true }));
    setCompactMode(false);
  }

  // Toggle icons for a product entry
  function handleProductArgChange(index: number, arg: keyof ResolvedProductData['args'], value: boolean) {
    setForm(prev => {
      const updated = [...prev.products];
      const prod = updated[index];
      if (prod) {
        prod.args = { ...prod.args, [arg]: value };
      }
      return { ...prev, products: updated };
    });
  }

  // Update a product's final price manually
  function handleProductFinalPriceChange(index: number, value: number) {
    setForm(prev => {
      const updated = [...prev.products];
      const prod = updated[index];
      if (prod) {
        prod.finalPrice = value;
      }
      return { ...prev, products: updated };
    });
  }

  // Compute the total of all product prices
  const productsTotal = form.products.reduce((sum, p) => sum + (Number(p.finalPrice || 0) * Number(p.quantity || 0)), 0);
  const computedFinalPrice = productsTotal + (form.hasDeliveryCost ? form.deliveryCost : 0);

  // Save (create or update) prescription
  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();

    // Ensure at least one product is selected
    if (form.products.filter(p => p.uniqueID).length === 0) {
      setError('Pelo menos um produto deve ser selecionado.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: any = { ...form };
      // Remove any product entries without a valid ID
      payload.products = payload.products.filter((p: any) => p.uniqueID);
      payload.productsTotalCost = productsTotal;

      // If finalPrice is falsy (e.g. 0 or empty), use computed value
      if (!payload.finalPrice) {
        payload.finalPrice = computedFinalPrice;
      }

      let response;
      if (prescription && prescription.uniqueID) {
        response = await updatePrescription(prescription.uniqueID, payload);
      } else {
        response = await createPrescription(payload);
      }
      onSaved(response);
      onClose();
    } catch (err: any) {
      setError(`Erro ao salvar prescrição -> ${err?.message || err?.error}`);
    } finally {
      setSaving(false);
    }
  }

  // Delete prescription
  async function handleDelete() {
    if (!prescription?.uniqueID) return;
    if (!confirm('Deseja excluir esta prescrição? Essa ação é irreversível...')) return;
    setDeleting(true);
    setError(null);
    try {
      await deletePrescription(prescription.uniqueID);
      onDeleted?.(prescription.uniqueID);
      onClose();
    } catch (err: any) {
      setError(`Erro ao excluir prescrição -> ${err.message || err?.error}`);
    } finally {
      setDeleting(false);
    }
  }

  // Resolve selected client name for display in input
  const selectedClient = clients.find(c => c.uniqueID === form.clientUniqueID);

  // toggle open for a product index
  function toggleOpen(idx: number) {
    setOpenIndexes(prev => ({ ...prev, [idx]: !prev[idx] }));
    // when opening a product, leave compactMode as-is (user may open several)
  }

  return (
    <Overlay $show={show}>
      <Modal role="dialog" aria-modal="true"
             aria-label={prescription ? 'Editar Prescrição' : 'Nova Prescrição'}>
        <ModalHeader>
          <Title>{prescription ? 'Editar Prescrição' : 'Nova Prescrição'}</Title>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {prescription && (
              <DangerButton onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Excluir'}
              </DangerButton>
            )}
            <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
          </div>
        </ModalHeader>

        <Body>
          <Form onSubmit={handleSave}>
            <LeftCol>
              <Field>
                <Label>Cliente</Label>
                <Input
                  list="clients-list"
                  value={selectedClient ? selectedClient.name : ''}
                  onChange={e => {
                    const name = e.target.value;
                    const client = clients.find(c => c.name === name);
                    updateField('clientUniqueID', client ? client.uniqueID : '');
                  }}
                  required
                />
                <datalist id="clients-list">
                  {clients.map(c => (
                    <option key={c.uniqueID} value={c.name} />
                  ))}
                </datalist>
              </Field>

              <Field>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label>Produtos (Lista)</Label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Helper>{form.products.length} itens</Helper>
                    <ToggleRow style={{ gap: 6 }}>
                      <input
                        id="compact-toggle"
                        type="checkbox"
                        checked={compactMode}
                        onChange={e => setCompactMode(e.target.checked)}
                      />
                      <Label style={{ fontWeight: 500, color: undefined }}>Modo compacto</Label>
                    </ToggleRow>
                  </div>
                </div>

                {/* Compact view: only names with a collapse button */}
                {compactMode ? (
                  <CompactList>
                    {form.products.length === 0 && <EmptyState>No products yet.</EmptyState>}
                    {form.products.map((p, idx) => (
                      <CompactItem key={idx}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <ProductName style={{ fontWeight: 700 }}>{p.name || '— Sem nome —'}</ProductName>
                          <ProductMeta>{p.quantity ? `x${p.quantity}` : ''}</ProductMeta>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <SmallButton
                            type="button"
                            onClick={() => {
                              // quick edit: prefill product name input
                              setOpenIndexes(prev => ({ ...prev, [idx]: true }));
                              setCompactMode(false);
                            }}
                          >
                            Editar
                          </SmallButton>

                          <CollapseButton
                            type="button"
                            onClick={() => toggleOpen(idx)}
                            aria-expanded={!!openIndexes[idx]}
                          >
                            {openIndexes[idx] ? 'Ocultar' : 'Abrir'}
                          </CollapseButton>

                          <SmallButton type="button" onClick={() => removeProduct(idx)}>Remover</SmallButton>
                        </div>

                        <ProductDetails $open={!!openIndexes[idx]}>
                          {/* Render full editable fields for this product */}
                          <div style={{ marginTop: 8 }}>
                            <Field>
                              <Label>Escolher produto</Label>
                              <Input
                                list="products-list"
                                placeholder="Escolher produto"
                                value={p.name}
                                onChange={e => handleProductSelection(idx, e.target.value)}
                              />
                            </Field>

                            <div style={{ display: 'flex', gap: 8 }}>
                              <Field style={{ flex: 1 }}>
                                <Label>Preço final</Label>
                                <NumberInput
                                  step="0.01"
                                  placeholder="Preço final"
                                  value={p.finalPrice === 0 ? '' : p.finalPrice}
                                  onChange={e => handleProductFinalPriceChange(idx, Number(e.target.value))}
                                />
                              </Field>

                              <Field style={{ width: 120 }}>
                                <Label>Quantidade</Label>
                                <NumberInput
                                  step="1"
                                  placeholder="Qtd"
                                  value={p.quantity === 0 ? 0 : p.quantity}
                                  onChange={e => {
                                    const val = Number(e.target.value || 0);
                                    setForm(prev => {
                                      const updated = [...prev.products];
                                      updated[idx].quantity = val;
                                      return { ...prev, products: updated };
                                    });
                                  }}
                                />
                              </Field>
                            </div>

                            <Field>
                              <Label>Como Usar</Label>
                              <Input
                                value={p.howToUse}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].howToUse = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>

                            <Field>
                              <Label>Por que Usar</Label>
                              {p.whyToUse.map((reason, rIdx) => (
                                <div key={rIdx} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                  <Input
                                    placeholder="Motivo de uso"
                                    value={reason}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setForm(prev => {
                                        const updated = [...prev.products];
                                        updated[idx].whyToUse[rIdx] = val;
                                        return { ...prev, products: updated };
                                      });
                                    }}
                                  />
                                  <SmallButton
                                    type="button"
                                    onClick={() => {
                                      setForm(prev => {
                                        const updated = [...prev.products];
                                        updated[idx].whyToUse.splice(rIdx, 1);
                                        return { ...prev, products: updated };
                                      });
                                    }}
                                  >
                                    ✕
                                  </SmallButton>
                                </div>
                              ))}
                              <SmallButton
                                type="button"
                                onClick={() => {
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].whyToUse.push('');
                                    return { ...prev, products: updated };
                                  });
                                }}
                              >
                                + Adicionar motivo
                              </SmallButton>
                            </Field>

                            <Field>
                              <Label>Observação</Label>
                              <Input
                                value={p.observation}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].observation = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>

                            <Field>
                              <Label>Alerta</Label>
                              <Input
                                value={p.alert}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].alert = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>

                            <Divider />
                          </div>
                        </ProductDetails>
                      </CompactItem>
                    ))}
                    <div style={{ marginTop: 8 }}>
                      <SmallButton type="button" onClick={addProduct}>Adicionar Produto</SmallButton>
                    </div>

                    <datalist id="products-list">
                      {productsList.map(prod => (
                        <option key={prod.uniqueID} value={prod.name} />
                      ))}
                    </datalist>
                  </CompactList>
                ) : (
                  // full mode: render each product expanded (like previous UI but with new styles)
                  <List>
                    {form.products.map((p, idx) => (
                      <ListItem key={idx}>
                        <ProductHeader>
                          <ProductTitle>
                            <ProductName>{p.name || '— Sem nome —'}</ProductName>
                            <ProductMeta>{p.internalSystemID ? `ID: ${p.internalSystemID}` : ''}</ProductMeta>
                          </ProductTitle>

                          <div style={{ display: 'flex', gap: 8 }}>
                            <SmallButton onClick={() => removeProduct(idx)}>Remover</SmallButton>
                            <IconButton onClick={() => setOpenIndexes(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                              {openIndexes[idx] ? 'Ocultar' : 'Detalhes'}
                            </IconButton>
                          </div>
                        </ProductHeader>

                        <ProductDetails $open={true}>
                          <div style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <Field style={{ flex: 1 }}>
                                <Label>Escolher produto</Label>
                                <Input
                                  list="products-list"
                                  placeholder="Escolher produto"
                                  value={p.name}
                                  onChange={e => handleProductSelection(idx, e.target.value)}
                                />
                              </Field>

                              <Field style={{ width: 140 }}>
                                <Label>Quantidade</Label>
                                <NumberInput
                                  step="1"
                                  value={p.quantity === 0 ? 0 : p.quantity}
                                  onChange={e => {
                                    const val = Number(e.target.value || 0);
                                    setForm(prev => {
                                      const updated = [...prev.products];
                                      updated[idx].quantity = val;
                                      return { ...prev, products: updated };
                                    });
                                  }}
                                />
                              </Field>

                              <Field style={{ width: 160 }}>
                                <Label>Preço final</Label>
                                <NumberInput
                                  step="0.01"
                                  value={p.finalPrice === 0 ? '' : p.finalPrice}
                                  onChange={e => handleProductFinalPriceChange(idx, Number(e.target.value))}
                                />
                              </Field>
                            </div>

                            <Field>
                              <Label>Como Usar</Label>
                              <Input
                                value={p.howToUse}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].howToUse = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>

                            <Field>
                              <Label>Por que Usar</Label>
                              {p.whyToUse.map((reason, rIdx) => (
                                <div key={rIdx} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                  <Input
                                    placeholder="Motivo de uso"
                                    value={reason}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setForm(prev => {
                                        const updated = [...prev.products];
                                        updated[idx].whyToUse[rIdx] = val;
                                        return { ...prev, products: updated };
                                      });
                                    }}
                                  />
                                  <SmallButton
                                    type="button"
                                    onClick={() => {
                                      setForm(prev => {
                                        const updated = [...prev.products];
                                        updated[idx].whyToUse.splice(rIdx, 1);
                                        return { ...prev, products: updated };
                                      });
                                    }}
                                  >
                                    ✕
                                  </SmallButton>
                                </div>
                              ))}
                             <SmallButton
                                type="button"
                                onClick={() => {
                                  setForm(prev => ({
                                    ...prev,
                                    products: prev.products.map((prod, i) =>
                                      i === idx
                                        ? {
                                            ...prod,
                                            whyToUse: [...prod.whyToUse, ''],
                                          }
                                        : prod
                                    ),
                                  }));
                                }}
                              >
                                + Adicionar motivo
                              </SmallButton>
                            </Field>

                            <Field>
                              <Label>Observação</Label>
                              <Input
                                value={p.observation}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].observation = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>

                            <Field>
                              <Label>Alerta</Label>
                              <Input
                                value={p.alert}
                                onChange={e => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.products];
                                    updated[idx].alert = val;
                                    return { ...prev, products: updated };
                                  });
                                }}
                              />
                            </Field>
                          </div>
                        </ProductDetails>
                      </ListItem>
                    ))}

                    <div style={{ marginTop: 8 }}>
                      <SmallButton type="button" onClick={addProduct}>Adicionar Produto</SmallButton>
                    </div>

                    <datalist id="products-list">
                      {productsList.map(prod => (
                        <option key={prod.uniqueID} value={prod.name} />
                      ))}
                    </datalist>
                  </List>
                )}
              </Field>
            </LeftCol>

            <RightCol>
              <Field>
                <Label>Ativo</Label>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => updateField('isActive', e.target.checked)}
                  />
                  <span>{form.isActive ? 'Ativo' : 'Inativo'}</span>
                </ToggleRow>
              </Field>

              <Field>
                <Label>Única vez</Label>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.isSingle}
                    onChange={e => updateField('isSingle', e.target.checked)}
                  />
                  <span>{form.isSingle ? 'Sim' : 'Não'}</span>
                </ToggleRow>
              </Field>

              <Field>
                <Label>Pago</Label>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.isPayed}
                    onChange={e => updateField('isPayed', e.target.checked)}
                  />
                  <span>{form.isPayed ? 'Sim' : 'Não'}</span>
                </ToggleRow>
              </Field>

              <Field>
                <Label>Custo com entrega?</Label>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={form.hasDeliveryCost}
                    onChange={e => updateField('hasDeliveryCost', e.target.checked)}
                  />
                  <span>{form.hasDeliveryCost ? 'Sim' : 'Não'}</span>
                </ToggleRow>
              </Field>

              {form.hasDeliveryCost && (
                <Field>
                  <Label>Custo de Entrega</Label>
                  <NumberInput
                    step="0.01"
                    value={form.deliveryCost}
                    onChange={e => updateField('deliveryCost', Number(e.target.value))}
                  />
                </Field>
              )}

              <Field>
                <Label>Total Produtos</Label>
                <div>{productsTotal.toFixed(2)}</div>
              </Field>

              <Field>
                <Label>Preço Final</Label>
                <NumberInput
                  step="0.01"
                  placeholder={computedFinalPrice.toFixed(2)}
                  value={form.finalPrice || ''}
                  onChange={e => updateField('finalPrice', Number(e.target.value))}
                />
              </Field>

              {error && <ErrorRow>{error}</ErrorRow>}
            </RightCol>
          </Form>

          {/* Right side footer or helpers could go here if needed */}
        </Body>

        <FooterActions>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <GhostButton type="button" onClick={onClose}>Cancelar</GhostButton>
            {prescription && (
              <DangerButton onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Excluir'}
              </DangerButton>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Helper>Produtos total: {form.products.length}</Helper>
            <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </PrimaryButton>
          </div>
        </FooterActions>
      </Modal>
    </Overlay>
  );
}