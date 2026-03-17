'use client';

import React, { useEffect, useState } from 'react';

import { ProductData } from '@/types/ProductData';
import { createProduct, updateProduct, deleteProduct } from '@/lib/utils/products';

import { ProductModalProps } from './ProductModal.types';
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


const emptyForm = (): Omit<ProductData, 'uniqueID' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  defaultWhyToUse: [''],
  defaultHowToUse: '',
  defaultObservation: '',
  defaultAlert: '',
  defaultPresentation: '',
  originalPrice: 0.0,
  discountedPrice: 0.0,
  discountPercentage: 0,
  isActive: true,
  internalSystemID: '',
});

export default function ProductModal({ show, product, onClose, onSaved, onDeleted }: ProductModalProps) {
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
        defaultPresentation: product.defaultPresentation ?? '',
        originalPrice: product.originalPrice ?? 0,
        discountedPrice: product.discountedPrice ?? 0,
        discountPercentage: product.discountPercentage ?? 0,
        isActive: product.isActive ?? true,
        internalSystemID: product.internalSystemID ?? ''
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
      let response: any;
      if (product && (product.uniqueID)) {
        response = await updateProduct(product.uniqueID, payload as any);
      } else {
        response = await createProduct(payload as any);
      }

      console.log(response);
      saved = response;  
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message || err?.error || 'Erro ao salvar produto');
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
      await deleteProduct(product.uniqueID);
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
              <span>ID Interno</span>
              <NumberInput value={form.internalSystemID} onChange={e => updateField('internalSystemID', e.target.value)} required />
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
              <span>Apresentação (string)</span>
              <Textarea value={form.defaultPresentation} onChange={e => updateField('defaultPresentation', e.target.value)} required />
            </Field>

            <Field>
              <span>Preço cheio</span>
              <NumberInput step="0.01" value={form.originalPrice === 0 ? '' : form.originalPrice} onChange={e => updateField('originalPrice', Number(e.target.value))} required/>
            </Field>

            <Field>
              <span>Preço com desconto</span>
              <NumberInput step="0.01" value={form.discountedPrice} onChange={e => updateField('discountedPrice', Number(e.target.value))} />
            </Field>

            <Field>
              <span>Desconto padrão</span>
              <NumberInput step="1" value={form.discountPercentage} onChange={e => updateField('discountPercentage', Number(e.target.value))}/>
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
