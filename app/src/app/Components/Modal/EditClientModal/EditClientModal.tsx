'use client';

import React, { useEffect, useState } from 'react';

import { ClientData } from '@/app/Types/!Index';
import { useArrayField } from '@/hooks/useArrayField';
import { createClient, updateClient, deleteClient } from '@/lib/utils/client';

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
  List,
  ListItem,
  SmallButton
} from './EditClientModal.styles';
import { ClientModalProps } from './EditClientModal.types';


const emptyForm = (): Omit<ClientData, 'uniqueID' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  address: '',
  observations: [''],
  alsoKnownBy: [''],
  isActive: true,
});


export default function EditClientModal({ show, client, onClose, onSaved, onDeleted }: ClientModalProps) {
  const [form, setForm] = useState<Omit<ClientData, 'uniqueID' | 'createdAt' | 'updatedAt'>>(emptyForm());

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loads default values to ClientForm fields
  useEffect(() => {
    if (client) {
      setForm({
        name:         client.name         ?? '',
        address:      client.address      ?? '',
        alsoKnownBy:  client.alsoKnownBy  ?? [''],
        observations: client.observations ?? [''],
        isActive:     client.isActive     ?? true,
      });
    } else {
      setForm(emptyForm());
    }
    setError(null);
  }, [client, show]);

  // Generics to change ClientForm fields
  function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }
  const { updateArrayField, addArrayField, removeArrayField } = useArrayField(form, setForm);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = { ...form };

      // Normalize blank entries
      payload.observations = payload.observations.map(w => w.trim()).filter(w => w !== '');
      payload.alsoKnownBy = payload.alsoKnownBy.map(w => w.trim()).filter(w => w !== '');
      
      let saved: ClientData;
      let response: any;

      // We either update or create the Client here
      if (client && (client.uniqueID)) {
        response = await updateClient(client.uniqueID, payload as any);
      } else {
        response = await createClient(payload as any);
      }

      saved = response;  
      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(`Erro ao salvar cliente -> ${err?.message || err?.error}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!client?.uniqueID) return;
    if (!confirm('Deseja excluir este cliente? Essa ação é irreversível...')) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteClient(client.uniqueID);
      if (onDeleted) onDeleted(client.uniqueID);
      onClose();
    } catch (err: any) {
      setError(`Erro ao excluir cliente -> ${err.message || err?.error}`);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Overlay $show={show}>
      <Modal role="dialog" aria-modal="true" aria-label={client ? 'Editar produto' : 'Criar produto'}>
        <ModalHeader>
          <Title>{client ? 'Editar Produto' : 'Novo Produto'}</Title>
          <div style={{display: 'flex', gap: 8}}>
            {client && <DangerButton onClick={handleDelete} disabled={deleting}>{deleting ? 'Excluindo...' : 'Excluir'}</DangerButton>}
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
              <span>Also Known By (Lista)</span>
              <List>
                {form.alsoKnownBy.map((w, idx) => (
                  <ListItem key={idx}>
                    <Input value={w} onChange={e => updateArrayField('alsoKnownBy', idx, e.target.value)} />
                    <SmallButton type="button" onClick={() => removeArrayField('alsoKnownBy', idx, [''])}>Remover</SmallButton>
                  </ListItem>
                ))}
                <SmallButton type="button" onClick={() => addArrayField('alsoKnownBy', '')}>Adicionar Also</SmallButton>
              </List>
            </Field>

            <Field>
              <span>Observações (Lista)</span>
              <List>
                {form.observations.map((w, idx) => (
                  <ListItem key={idx}>
                    <Input value={w} onChange={e => updateArrayField('observations', idx, e.target.value)} />
                    <SmallButton type="button" onClick={() => removeArrayField('observations', idx, [''])}>Remover</SmallButton>
                  </ListItem>
                ))}
                <SmallButton type="button" onClick={() => addArrayField('observations', '')}>Adicionar</SmallButton>
              </List>
            </Field>

            <Field>
              <span>Endereço</span>
              <Textarea value={form.address} onChange={e => updateField('address', e.target.value)} required/>
            </Field>
          </LeftCol>

          <RightCol>
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
