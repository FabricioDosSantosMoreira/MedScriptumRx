'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Header,
  ControlsRow,
  SearchInput,
  TableWrapper,
  Table,
  Button,
  ActionButton,
  Tag,
  EmptyState,
  SideInfo,
  LoadingRow,
} from './page.styles';

import {
  getPrescriptions,
  deletePrescription,
  createPrescription,
  updatePrescription,
} from '@/app/Lib/utils/prescriptions';

import PrescriptionModal from '@/components/Modal/PrescriptionModal/PrescriptionModal';
import PageLayout from '@/components/Layouts/Page/PageLayout';

import { PrescriptionData } from '@/types/Index';
import { formatDate } from '@/lib/utils/utils';


export default function PrescriptionsPage() {
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionData | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      setPrescriptions(await getPrescriptions());
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro carregando as prescrições!');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta prescrição?')) return;
    try {
      await deletePrescription(id);
      await load();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Erro ao deletar prescrição');
    }
  };

  const handleEdit = (prescription: PrescriptionData) => {
    setEditingPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPrescription(null);
    setIsModalOpen(true);
  };

  const handleSave = async (
    prescription: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    try {
      if (id) {
        await updatePrescription(id, prescription);
      } else {
        await createPrescription(prescription);
      }
      setIsModalOpen(false);
      load();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Erro ao salvar prescrição');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) => {
      const clientName = p.client?.name || '';
      const products = (p.products || []).map((x) => x.name).join(' ');
      const date = p.createdAt || '';
      return (
        clientName.toLowerCase().includes(q) ||
        products.toLowerCase().includes(q) ||
        date.toLowerCase().includes(q) ||
        p.uniqueID.toLowerCase().includes(q)
      );
    });
  }, [prescriptions, query]);

  return (
    <PageLayout>
      <Container>
        <Header>
            <h1>Prescrições</h1>
          <SideInfo>
            <Button onClick={handleAddNew}>+ Nova Prescrição</Button>
          </SideInfo>
        </Header>

        <ControlsRow>
          <SearchInput
            placeholder="Pesquisar por cliente, produto ou data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Tag>{prescriptions.length} total</Tag>
            <Button onClick={load} $outline>
              Atualizar
            </Button>
          </div>
        </ControlsRow>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                {/* ID ficará oculto — mantemos o campo no dataset, não exibimos como coluna */}
                <th>Data</th>
                <th>Cliente</th>
                <th>Produtos</th>
                <th>Qtd</th>
                <th>Produtos Total</th>
                <th>Entrega</th>
                <th>Final</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8}>
                    <LoadingRow>Carregando prescrições...</LoadingRow>
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState>
                      {error ? `Erro: ${error}` : 'Nenhuma prescrição encontrada'}
                    </EmptyState>
                  </td>
                </tr>
              )}

              {!isLoading && filtered.map((p) => (
                <tr key={p.uniqueID}>
                  <td className="nowrap">{formatDate(p.createdAt)}</td>
                  <td>
                    <strong>{p.client?.name || '—'}</strong>
                    {p.client?.phone && <div className="muted">{p.client.phone}</div>}
                  </td>

                  <td>
                    {/* mostra até 3 nomes de produtos e indica quantos a mais */}
                    {p.products && p.products.length > 0 ? (
                      (() => {
                        const names = p.products.map((pr) => pr.name || '—');
                        const first = names.slice(0, 3);
                        const rest = names.length - first.length;
                        return (
                          <div>
                            <div className="product-list">
                              {first.map((n, i) => (
                                <span key={i} className="product-pill">{n}</span>
                              ))}
                              {rest > 0 && <span className="product-more">+{rest} mais</span>}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <span className="muted">Sem produtos</span>
                    )}
                  </td>

                  <td className="center">{p.productlength ?? (p.products ? p.products.length : 0)}</td>

                  <td className="nowrap">{typeof (p as any).productsTotalCost !== 'undefined' ? (p as any).productsTotalCost : '—'}</td>

                  <td className="nowrap">{p.hasDeliveryCost ? (p.deliveryCost ?? 0) : 0}</td>

                  <td className="final nowrap">{typeof p.finalPrice !== 'undefined' ? p.finalPrice : '—'}</td>

                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <ActionButton onClick={() => handleEdit(p)}>Editar</ActionButton>
                      <ActionButton $danger onClick={() => handleDelete(p.uniqueID)}>
                        Excluir
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        {isModalOpen && (
          <PrescriptionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={editingPrescription}
          />
        )}
      </Container>
    </PageLayout>
  );
}
