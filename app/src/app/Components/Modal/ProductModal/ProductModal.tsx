'use client';

import React, { useEffect, useState } from 'react';
import {
  Overlay,
  Modal,
  ModalHeader,
  Title,
  CloseButton,
  Form,
  LeftCol,
  RightCol,
  Field,
  Input,
  Textarea,
  NumberInput,
  ToggleRow,
  Actions,
  PrimaryButton,
  GhostButton,
  DangerButton,
  WhyList,
  WhyItem,
  SmallButton
} from './ProductModal.styles';

import { ProductData } from '@/types/Index';
import { createProduct, updateProduct, deleteProduct as apiDeleteProduct } from '@/lib/utils/products';

type Props = {
  show: boolean;
  onClose: () => void;
  product?: ProductData | null;
  onSaved: (saved: ProductData) => void;
  onDeleted?: (id: string) => void;
};

const emptyForm = (): Omit<ProductData, 'uniqueID' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  defaultWhyToUse: [''],
  defaultHowToUse: '',
  defaultObservation: '',
  defaultAlert: '',
  defaultPresentation: 0,
  fullPriceTag: 0,
  discountPriceTag: 0,
  defaultDiscount: 0,
  isActive: true
});

export default function ProductModal({ show, onClose, product, onSaved, onDeleted }: Props) {
  const [form, setForm] = useState<Omit<ProductData, 'uniqueID' | 'createdAt' | 'updatedAt'>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? '',
        defaultWhyToUse: (product.defaultWhyToUse && product.defaultWhyToUse.length > 0) ? product.defaultWhyToUse : [''],
        defaultHowToUse: product.defaultHowToUse ?? '',
        defaultObservation: product.defaultObservation ?? '',
        defaultAlert: product.defaultAlert ?? '',
        defaultPresentation: product.defaultPresentation ?? 0,
        fullPriceTag: product.fullPriceTag ?? 0,
        discountPriceTag: product.discountPriceTag ?? 0,
        defaultDiscount: product.defaultDiscount ?? 0,
        isActive: product.isActive ?? true
      });
    } else {
      setForm(emptyForm());
    }
    setError(null);
  }, [product, show]);

  function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function updateWhy(index: number, value: string) {
    const arr = [...form.defaultWhyToUse];
    arr[index] = value;
    updateField('defaultWhyToUse', arr);
  }

  function addWhy() {
    updateField('defaultWhyToUse', [...form.defaultWhyToUse, '']);
  }

  function removeWhy(idx: number) {
    const arr = form.defaultWhyToUse.filter((_, i) => i !== idx);
    updateField('defaultWhyToUse', arr.length ? arr : ['']);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      // normalize blank why entries
      payload.defaultWhyToUse = payload.defaultWhyToUse.map(w => w.trim()).filter(w => w !== '');
      let saved: ProductData;
      if (product && (product.uniqueID)) {
        saved = await updateProduct(product.uniqueID, payload as any);
      } else {
        saved = await createProduct(payload as any);
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product?.uniqueID) return;
    if (!confirm('Deseja excluir este produto? Essa ação é irreversível.')) return;
    setDeleting(true);
    setError(null);
    try {
      await apiDeleteProduct(product.uniqueID);
      if (onDeleted) onDeleted(product.uniqueID);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao excluir produto');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Overlay $show={show}>
      <Modal role="dialog" aria-modal="true" aria-label={product ? 'Editar produto' : 'Criar produto'}>
        <ModalHeader>
          <Title>{product ? 'Editar Produto' : 'Novo Produto'}</Title>
          <div style={{display: 'flex', gap: 8}}>
            {product && <DangerButton onClick={handleDelete} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</DangerButton>}
            <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
          </div>
        </ModalHeader>

        <Form onSubmit={handleSave}>
          <LeftCol>
            <Field>
              <span>Nome</span>
              <Input value={form.name} onChange={e => updateField('name', e.target.value)} required />
            </Field>

            <Field>
              <span>Por que usar (lista)</span>
              <WhyList>
                {form.defaultWhyToUse.map((w, idx) => (
                  <WhyItem key={idx}>
                    <Input value={w} onChange={e => updateWhy(idx, e.target.value)} />
                    <SmallButton type="button" onClick={() => removeWhy(idx)}>Remover</SmallButton>
                  </WhyItem>
                ))}
                <SmallButton type="button" onClick={addWhy}>Adicionar motivo</SmallButton>
              </WhyList>
            </Field>

            <Field>
              <span>Como usar</span>
              <Textarea value={form.defaultHowToUse} onChange={e => updateField('defaultHowToUse', e.target.value)} />
            </Field>

            <Field>
              <span>Observação</span>
              <Textarea value={form.defaultObservation} onChange={e => updateField('defaultObservation', e.target.value)} />
            </Field>

            <Field>
              <span>Alerta</span>
              <Textarea value={form.defaultAlert} onChange={e => updateField('defaultAlert', e.target.value)} />
            </Field>
          </LeftCol>

          <RightCol>
            <Field>
              <span>Apresentação (número)</span>
              <NumberInput value={form.defaultPresentation} onChange={e => updateField('defaultPresentation', Number(e.target.value))} />
            </Field>

            <Field>
              <span>Preço cheio</span>
              <NumberInput step="0.01" value={form.fullPriceTag} onChange={e => updateField('fullPriceTag', Number(e.target.value))} />
            </Field>

            <Field>
              <span>Preço com desconto</span>
              <NumberInput step="0.01" value={form.discountPriceTag} onChange={e => updateField('discountPriceTag', Number(e.target.value))} />
            </Field>

            <Field>
              <span>Desconto padrão</span>
              <NumberInput step="0.01" value={form.defaultDiscount} onChange={e => updateField('defaultDiscount', Number(e.target.value))} />
            </Field>

            <Field>
              <span>Ativo</span>
              <ToggleRow>
                <input type="checkbox" checked={form.isActive} onChange={e => updateField('isActive', e.target.checked)} />
                <span>{form.isActive ? 'Ativo' : 'Inativo'}</span>
              </ToggleRow>
            </Field>

            {error && <div style={{ color: '#8b0000', fontSize: 13 }}>{error}</div>}

            <Actions>
              <GhostButton type="button" onClick={onClose}>Cancelar</GhostButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</PrimaryButton>
            </Actions>
          </RightCol>
        </Form>
      </Modal>
    </Overlay>
  );
}
