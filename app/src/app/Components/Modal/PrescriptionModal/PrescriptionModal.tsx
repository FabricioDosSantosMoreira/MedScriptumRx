// app/prescriptions/PrescriptionModal.tsx
import React, { useEffect, useState } from 'react';
import * as S from './PrescriptionModal.styles';
import { fetchClients } from '@/lib/utils/clients';
import { fetchProducts } from '@/lib/utils/products';

import type {
  PrescriptionData,
  ResolvedProductData,
  ProductArgs
} from '@/types/PrescriptionData';
import type { ProductData } from '@/types/Index';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void;
  initialData: PrescriptionData | null;
}

const PrescriptionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [clients, setClients] = useState<{ uniqueID: string; name: string; phone?: string }[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  const [clientId, setClientId] = useState<string>(initialData?.clientUniqueID ?? '');
  const [selectedProducts, setSelectedProducts] = useState<ResolvedProductData[]>(
    initialData?.products ?? []
  );

  const [deliveryCost, setDeliveryCost] = useState<number>(initialData?.deliveryCost ?? 0);
  const [hasDeliveryCost, setHasDeliveryCost] = useState<boolean>(!!initialData?.hasDeliveryCost);
  const [finalPrice, setFinalPrice] = useState<number | undefined>(initialData?.finalPrice);
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
  const [isSingle, setIsSingle] = useState<boolean>(initialData?.isSingle ?? false);
  const [isPayed, setIsPayed] = useState<boolean>(initialData?.isPayed ?? false);
  const [useNameIcon, setUseNameIcon] = useState<boolean>(initialData?.args?.useNameIcon ?? false);

  useEffect(() => {
    (async () => {
      try {
        const c = await fetchClients();
        const p = await fetchProducts();
        setClients(c);
        setProducts(p);
      } catch (err) {
        console.error('Error fetching clients/products', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.clientUniqueID ?? '');
      setSelectedProducts(initialData.products ?? []);
      setDeliveryCost(initialData.deliveryCost ?? 0);
      setHasDeliveryCost(!!initialData.hasDeliveryCost);
      setFinalPrice(initialData.finalPrice);
      setIsActive(initialData.isActive ?? true);
      setIsSingle(initialData.isSingle ?? false);
      setIsPayed(initialData.isPayed ?? false);
      setUseNameIcon(initialData.args?.useNameIcon ?? false);
    } else {
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

  const computeDefaultPrice = (prod: ProductData) =>
    (prod as any).discountPriceTag ?? (prod as any).fullPriceTag ?? (prod as any).cost ?? 0;

  const handleAddProduct = () => {
    const sel = document.getElementById('productSelect') as HTMLSelectElement | null;
    if (!sel) return;
    const prodId = sel.value;
    if (!prodId) return;

    const prod = products.find(p => p.uniqueID === prodId);
    if (!prod) return;

    // already added?
    if (selectedProducts.some(p => p.uniqueID === prod.uniqueID)) return;

    const newProd: ResolvedProductData = {
      ...prod,
      args: {},
      finalPrice: computeDefaultPrice(prod),
    };

    setSelectedProducts(prev => [...prev, newProd]);
  };

  const handleRemoveProduct = (uniqueID: string) => {
    setSelectedProducts(prev => prev.filter(p => p.uniqueID !== uniqueID));
  };

  const handleProductFinalChange = (uniqueID: string, value: number) => {
    setSelectedProducts(prev =>
      prev.map(p => (p.uniqueID === uniqueID ? { ...p, finalPrice: Number(value) } : p))
    );
  };

  const handleProductArgChange = (uniqueID: string, argName: keyof ProductArgs, value: boolean) => {
    setSelectedProducts(prev =>
      prev.map(p => (p.uniqueID === uniqueID ? { ...p, args: { ...p.args, [argName]: value } } : p))
    );
  };

  const handleSubmit = () => {
    if (!clientId) {
      alert('Por favor selecione um cliente.');
      return;
    }

    const productsTotal = selectedProducts.reduce((s, p) => s + (Number(p.finalPrice ?? 0)), 0);

    const computedFinalPrice = finalPrice !== undefined
      ? Number(finalPrice)
      : hasDeliveryCost
        ? productsTotal + Number(deliveryCost ?? 0)
        : productsTotal;

    const payload: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'> = {
      clientUniqueID: clientId,
      products: selectedProducts.map(p => ({
        ...p,
        args: p.args ?? {},
        finalPrice: Number(p.finalPrice ?? 0),
      })),
      productlength: selectedProducts.length,
      productsTotalCost: productsTotal,
      deliveryCost: Number(deliveryCost ?? 0),
      hasDeliveryCost,
      finalPrice: Number(computedFinalPrice),
      isActive,
      isSingle,
      isPayed,
      args: { useNameIcon },
    };

    onSave(payload, initialData?.uniqueID);
  };

  return (
    <S.Overlay>
      <S.Modal>
        <h2>{initialData ? 'Editar Prescrição' : 'Nova Prescrição'}</h2>

        <div>
          <label>Cliente</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Selecione um cliente</option>
            {clients.map(c => (
              <option key={c.uniqueID} value={c.uniqueID}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Produtos</label>
          <div>
            <select id="productSelect" defaultValue="">
              <option value="">Selecione um produto</option>
              {products.map(p => (
                <option key={p.uniqueID} value={p.uniqueID}>{p.name}</option>
              ))}
            </select>
            <S.Button onClick={handleAddProduct}>Adicionar</S.Button>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Final</th>
                <th>Ícones</th>
                <th>Remover</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map(p => (
                <tr key={p.uniqueID}>
                  <td>{p.name}</td>
                  <td>
                    <input
                      type="number"
                      value={p.finalPrice ?? 0}
                      onChange={(e) => handleProductFinalChange(p.uniqueID, Number(e.target.value || 0))}
                    />
                  </td>
                  <td>
                    <label>
                      <input type="checkbox" checked={!!p.args?.useListIcon} onChange={(e) => handleProductArgChange(p.uniqueID, 'useListIcon', e.target.checked)} />
                      List
                    </label>
                    <label>
                      <input type="checkbox" checked={!!p.args?.useAlertIcon} onChange={(e) => handleProductArgChange(p.uniqueID, 'useAlertIcon', e.target.checked)} />
                      Alert
                    </label>
                    <label>
                      <input type="checkbox" checked={!!p.args?.useCalendarIcon} onChange={(e) => handleProductArgChange(p.uniqueID, 'useCalendarIcon', e.target.checked)} />
                      Calendar
                    </label>
                    <label>
                      <input type="checkbox" checked={!!p.args?.useObservationIcon} onChange={(e) => handleProductArgChange(p.uniqueID, 'useObservationIcon', e.target.checked)} />
                      Observation
                    </label>
                  </td>
                  <td>
                    <S.SmallButton onClick={() => handleRemoveProduct(p.uniqueID)}>Remover</S.SmallButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div>
          <label>
            <input type="checkbox" checked={hasDeliveryCost} onChange={(e) => setHasDeliveryCost(e.target.checked)} />
            Adicionar custo de entrega
          </label>
          {hasDeliveryCost && (
            <input type="number" value={deliveryCost} onChange={(e) => setDeliveryCost(Number(e.target.value || 0))} />
          )}
        </div>

        <div>
          <label>Preço final (opcional)</label>
          <input type="number" value={finalPrice ?? ''} onChange={(e) => setFinalPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
        </div>

        <div>
          <label><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Ativo</label>
          <label><input type="checkbox" checked={isSingle} onChange={(e) => setIsSingle(e.target.checked)} /> Single</label>
          <label><input type="checkbox" checked={isPayed} onChange={(e) => setIsPayed(e.target.checked)} /> Pago</label>
        </div>

        <div>
          <label><input type="checkbox" checked={useNameIcon} onChange={(e) => setUseNameIcon(e.target.checked)} /> Usar ícone no nome</label>
        </div>

        <S.ButtonRow>
          <S.Button onClick={handleSubmit}>{initialData ? 'Atualizar' : 'Criar'}</S.Button>
          <S.Button onClick={onClose}>Cancelar</S.Button>
        </S.ButtonRow>
      </S.Modal>
    </S.Overlay>
  );
};

export default PrescriptionModal;
