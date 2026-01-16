// app/prescriptions/PrescriptionModal.tsx
import React, { useEffect, useState } from 'react';
import * as S from './PrescriptionModal.styles';
import { fetchClients } from '@/lib/utils/clients';
import { fetchProducts } from '@/lib/utils/products';
import {
  PrescriptionData,
  ResolvedProductData,
  ProductData,
  ProductArgs,
  PrescriptionArgs
} from '@/lib/utils/PrescriptionSheet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialData: PrescriptionData | null;
}

const PrescriptionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [clients, setClients] = useState<{ uniqueID: string; name: string }[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [clientId, setClientId] = useState<string>(initialData?.client.uniqueID || '');
  const [selectedProducts, setSelectedProducts] = useState<ResolvedProductData[]>(initialData?.products || []);
  const [deliveryCost, setDeliveryCost] = useState<number>(initialData?.deliveryCost || 0);
  const [hasDeliveryCost, setHasDeliveryCost] = useState<boolean>(initialData?.hasDeliveryCost || false);
  const [finalPrice, setFinalPrice] = useState<number | undefined>(initialData?.finalPrice);
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive || true);
  const [isSingle, setIsSingle] = useState<boolean>(initialData?.isSingle || false);
  const [isPayed, setIsPayed] = useState<boolean>(initialData?.isPayed || false);
  const [useNameIcon, setUseNameIcon] = useState<boolean>(initialData?.args.useNameIcon || false);

  useEffect(() => {
    // Fetch clients and products for selection
    async function fetchData() {
      try {
        const c = await fetchClients();
        setClients(c);
        const p = await fetchProducts();
        setProducts(p);
      } catch (error) {
        console.error('Error fetching clients or products:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // If switching between edit/new, reset or load state accordingly
    if (initialData) {
      setClientId(initialData.client.uniqueID);
      setSelectedProducts(initialData.products);
      setDeliveryCost(initialData.deliveryCost);
      setHasDeliveryCost(initialData.hasDeliveryCost);
      setFinalPrice(initialData.finalPrice);
      setIsActive(initialData.isActive);
      setIsSingle(initialData.isSingle);
      setIsPayed(initialData.isPayed);
      setUseNameIcon(initialData.args.useNameIcon || false);
    } else {
      // resetting for new
      setClientId('');
      setSelectedProducts([]);
      setDeliveryCost(0);
      setHasDeliveryCost(false);
      setFinalPrice(undefined);
      setIsActive(true);
      setIsSingle(false);
      setIsPayed(false);
      setUseNameIcon(false);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleAddProduct = () => {
    const selectElem = document.getElementById('productSelect') as HTMLSelectElement;
    if (!selectElem) return;
    const prodId = selectElem.value;
    const prod = products.find((p) => p.uniqueID === prodId);
    if (prod && !selectedProducts.find((p) => p.product.uniqueID === prodId)) {
      const newProd: ResolvedProductData = {
        product: prod,
        args: {},
        finalPrice: prod.cost,
      };
      setSelectedProducts([...selectedProducts, newProd]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.product.uniqueID !== id));
  };

  const handleProductFinalChange = (id: string, value: number) => {
    setSelectedProducts(selectedProducts.map((p) =>
      p.product.uniqueID === id ? { ...p, finalPrice: value } : p
    ));
  };

  const handleProductArgChange = (id: string, argName: keyof ProductArgs, value: boolean) => {
    setSelectedProducts(selectedProducts.map((p) =>
      p.product.uniqueID === id ? { ...p, args: { ...p.args, [argName]: value } } : p
    ));
  };

  const handleSubmit = () => {
    const client = clients.find(c => c.uniqueID === clientId);
    if (!client) {
      alert('Please select a client.');
      return;
    }
    // Compute productsTotalCost
    let productsTotal = 0;
    selectedProducts.forEach(p => {
      productsTotal += p.finalPrice || 0;
    });

    // Compute final price if not manually entered
    let computedFinalPrice = finalPrice !== undefined
      ? finalPrice
      : (hasDeliveryCost ? productsTotal + deliveryCost : productsTotal);

    const newData: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'> = {
      client: client,
      products: selectedProducts,
      productsTotalCost: productsTotal,
      deliveryCost: deliveryCost,
      hasDeliveryCost: hasDeliveryCost,
      finalPrice: computedFinalPrice,
      isActive: isActive,
      isSingle: isSingle,
      isPayed: isPayed,
      args: { useNameIcon },
    };
    onSave(newData, initialData?.uniqueID);
  };

  return (
    <S.Overlay>
      <S.Modal>
        <h2>{initialData ? 'Edit' : 'New'} Prescription</h2>
        <div>
          <label>Client:</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.uniqueID} value={c.uniqueID}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Products:</label>
          <div>
            <select id="productSelect">
              {products.map((p) => (
                <option key={p.uniqueID} value={p.uniqueID}>{p.name}</option>
              ))}
            </select>
            <S.Button onClick={handleAddProduct}>Add Product</S.Button>
          </div>
        </div>
        {selectedProducts.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Final Price</th>
                <th>Icons</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p) => (
                <tr key={p.product.uniqueID}>
                  <td>{p.product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={p.finalPrice}
                      onChange={(e) => handleProductFinalChange(p.product.uniqueID, parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <label>
                      <input type="checkbox" checked={p.args.useListIcon || false} onChange={(e) => handleProductArgChange(p.product.uniqueID, 'useListIcon', e.target.checked)} />
                      List
                    </label>
                    <label>
                      <input type="checkbox" checked={p.args.useAlertIcon || false} onChange={(e) => handleProductArgChange(p.product.uniqueID, 'useAlertIcon', e.target.checked)} />
                      Alert
                    </label>
                    <label>
                      <input type="checkbox" checked={p.args.useCalendarIcon || false} onChange={(e) => handleProductArgChange(p.product.uniqueID, 'useCalendarIcon', e.target.checked)} />
                      Calendar
                    </label>
                    <label>
                      <input type="checkbox" checked={p.args.useObservationIcon || false} onChange={(e) => handleProductArgChange(p.product.uniqueID, 'useObservationIcon', e.target.checked)} />
                      Observation
                    </label>
                  </td>
                  <td>
                    <S.SmallButton onClick={() => handleRemoveProduct(p.product.uniqueID)}>Remove</S.SmallButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div>
          <label>
            <input type="checkbox" checked={hasDeliveryCost} onChange={(e) => setHasDeliveryCost(e.target.checked)} />
            Add Delivery Cost
          </label>
          {hasDeliveryCost && (
            <input type="number" value={deliveryCost} onChange={(e) => setDeliveryCost(parseFloat(e.target.value))} placeholder="Delivery Cost" />
          )}
        </div>
        <div>
          <label>Final Price:</label>
          <input type="number" value={finalPrice || ''} onChange={(e) => setFinalPrice(parseFloat(e.target.value))} placeholder="Final Price (optional)" />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          <label>
            <input type="checkbox" checked={isSingle} onChange={(e) => setIsSingle(e.target.checked)} />
            Single
          </label>
          <label>
            <input type="checkbox" checked={isPayed} onChange={(e) => setIsPayed(e.target.checked)} />
            Paid
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={useNameIcon} onChange={(e) => setUseNameIcon(e.target.checked)} />
            Use Name Icon
          </label>
        </div>
        <S.ButtonRow>
          <S.Button onClick={handleSubmit}>{initialData ? 'Update' : 'Create'}</S.Button>
          <S.Button onClick={onClose}>Cancel</S.Button>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  );
};

export default PrescriptionModal;
