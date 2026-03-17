'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  PageWrapper,
  SubContainer,
  Header,
  ControlsRow,
  SearchInput,
  TableWrapper,
  Table,
  Button,
  ActionButton,
  Tag,
  EmptyState,
  LoadingRow,
  TwoColumnControls,
  FilterGroup,
  SmallInput,
  Select,
} from './page.styles';

import { getPrescriptions, deletePrescription, archivePrescription } from '@/app/Lib/utils/prescription';
import { getClients } from '@/app/Lib/utils/client';

import EditPrescriptionModal from '@/components/Modal/EditPrescriptionModal/EditPrescriptionModal';
import PageLayout from '@/components/Layouts/Page/PageLayout';

import { PrescriptionData, ClientData } from '@/app/Types/index';
import { formatDate } from '@/app/Lib/utils';
import { applyFiltersAndSort, FilterOptions, SortOptions } from '@/lib/prescriptionFilters';

export default function PrescriptionsPage() {
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionData | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Independent filters for active and archived containers
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [activeSort, setActiveSort] = useState<SortOptions>({ sortBy: 'createdAt', sortDir: 'desc' });

  const [archivedFilters, setArchivedFilters] = useState<FilterOptions>({});
  const [archivedSort, setArchivedSort] = useState<SortOptions>({ sortBy: 'createdAt', sortDir: 'desc' });

  // Load clients and prescriptions on mount
  useEffect(() => {
    async function loadClients() {
      try {
        const list = await getClients();
        setClients(list);
      } catch (e) {
        console.error('Error fetching clients', e);
      }
    }
    async function loadPrescriptions() {
      setIsLoading(true);
      setError(null);
      try {
        const list = await getPrescriptions();
        setPrescriptions(list);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Erro carregando as prescrições!');
      } finally {
        setIsLoading(false);
      }
    }
    loadClients();
    loadPrescriptions();
  }, []);

  // Delete a prescription from the list
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta prescrição?')) return;
    try {
      await deletePrescription(id);
      const list = await getPrescriptions();
      setPrescriptions(list);
    } catch (err) {
      console.error('Error deleting prescription:', err);
      alert('Erro ao deletar prescrição');
    }
  };

  // Delete a prescription from the list
  const handleArchive = async (id: string) => {
    try {
      await archivePrescription(id);
      const list = await getPrescriptions();
      setPrescriptions(list);
    } catch (err) {
      console.error('Error archiving prescription:', err);
      alert(`Erro ao arquivar prescrição ${err}`);
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

  // After saving (create/update) refresh the list
  const handleModalSaved = (saved: PrescriptionData) => {
    setIsModalOpen(false);
    getPrescriptions()
      .then(list => setPrescriptions(list))
      .catch(err => setError(err.message));
  };

  // After deleting inside modal
  const handleModalDeleted = (id: string) => {
    setIsModalOpen(false);
    getPrescriptions()
      .then(list => setPrescriptions(list))
      .catch(err => setError(err.message));
  };

  // quick global search (applies to both lists as a base filter)
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter(p => {
      const client = clients.find(c => c.uniqueID === p.clientUniqueID);
      const clientName = client?.name || '';
      const productsText = p.products?.map(x => x.name).join(' ') || '';
      const dateText = p.createdAt || '';
      return (
        clientName.toLowerCase().includes(q) ||
        productsText.toLowerCase().includes(q) ||
        dateText.toLowerCase().includes(q) ||
        p.uniqueID.toLowerCase().includes(q)
      );
    });
  }, [prescriptions, query, clients]);

  // split active / archived
  const activePrescriptions = baseFiltered.filter(p => p.isActive === true);
  const archivedPrescriptions = baseFiltered.filter(p => p.isActive === false);

  // apply filters and sort (reusable function)
  const activeFinal = useMemo(() => applyFiltersAndSort(activePrescriptions, activeFilters, activeSort), [activePrescriptions, activeFilters, activeSort]);
  const archivedFinal = useMemo(() => applyFiltersAndSort(archivedPrescriptions, archivedFilters, archivedSort), [archivedPrescriptions, archivedFilters, archivedSort]);

  // helper to set filters (keeps immutability)
  const updateFilter = (isActive: boolean, patch: Partial<FilterOptions>) => {
    if (isActive) setActiveFilters(prev => ({ ...(prev ?? {}), ...patch }));
    else setArchivedFilters(prev => ({ ...(prev ?? {}), ...patch }));
  };

  const updateSort = (isActive: boolean, sort: SortOptions) => {
    if (isActive) setActiveSort(sort);
    else setArchivedSort(sort);
  };

  return (
    <PageLayout>
      <PageWrapper>
        {/* Top container - Active */}
        <SubContainer>
          <Header>
            <h2>Prescrições Atuais</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Tag>{activePrescriptions.length} — total</Tag>
              <Button onClick={handleAddNew}>+ Nova Prescrição</Button>
              <Button $outline onClick={() => getPrescriptions().then(setPrescriptions)}>Atualizar</Button>
            </div>
          </Header>

          <ControlsRow>
            <SearchInput
              placeholder="Pesquisar por cliente, produto ou data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <TwoColumnControls>
              <FilterGroup>
                <label>Período</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SmallInput type="date" onChange={(e) => updateFilter(true, { dateFrom: e.target.value || undefined })} />
                  <SmallInput type="date" onChange={(e) => updateFilter(true, { dateTo: e.target.value || undefined })} />
                </div>
              </FilterGroup>

              <FilterGroup>
                <label>Cliente</label>
                <Select onChange={(e) => updateFilter(true, { clientUniqueID: e.target.value || undefined })}>
                  <option value="">Todos</option>
                  {clients.map(c => <option key={c.uniqueID} value={c.uniqueID}>{c.name}</option>)}
                </Select>
              </FilterGroup>

              <FilterGroup>
                <label>Valor (min / max)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SmallInput type="number" placeholder="min" onChange={(e) => updateFilter(true, { minTotal: e.target.value ? Number(e.target.value) : undefined })} />
                  <SmallInput type="number" placeholder="max" onChange={(e) => updateFilter(true, { maxTotal: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
              </FilterGroup>

              <FilterGroup>
                <label>Ordenar</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Select onChange={(e) => updateSort(true, { ...activeSort, sortBy: e.target.value as any })} value={activeSort.sortBy}>
                    <option value="createdAt">Data</option>
                    <option value="finalPrice">Valor Final</option>
                    <option value="productsTotalCost">Produtos</option>
                  </Select>
                  <Select onChange={(e) => updateSort(true, { ...activeSort, sortDir: e.target.value as any })} value={activeSort.sortDir}>
                    <option value="desc">Maior → Menor</option>
                    <option value="asc">Menor → Maior</option>
                  </Select>
                </div>
              </FilterGroup>
            </TwoColumnControls>
          </ControlsRow>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
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

                {!isLoading && activeFinal.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState>{error ? `Erro: ${error}` : 'Nenhuma prescrição encontrada'}</EmptyState>
                    </td>
                  </tr>
                )}

                {!isLoading && activeFinal.map(p => {
                  const client = clients.find(c => c.uniqueID === p.clientUniqueID);
                  return (
                    <tr key={p.uniqueID}>
                      <td className="nowrap">{formatDate(p.createdAt)}</td>
                      <td><strong>{client?.name || '—'}</strong></td>
                      <td>
                        {p.products && p.products.length > 0 ? (
                          (() => {
                            const names = p.products.map(pr => pr.name || '—');
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
                      <td className="center">{p.products?.length ?? 0}</td>
                      <td className="nowrap">{p.productsTotalCost ?? '—'}</td>
                      <td className="nowrap">{p.hasDeliveryCost ? (p.deliveryCost ?? 0) : 0}</td>
                      <td className="final nowrap">{p.finalPrice ?? '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <ActionButton onClick={() => handleEdit(p)}>Editar</ActionButton>
                          <ActionButton $danger onClick={() => handleDelete(p.uniqueID)}>Excluir</ActionButton>
                          <ActionButton onClick={() => handleArchive(p.uniqueID)}>Arquivar</ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>

          {isModalOpen && (
            <EditPrescriptionModal
              show={isModalOpen}
              prescription={editingPrescription ?? undefined}
              onClose={() => setIsModalOpen(false)}
              onSaved={handleModalSaved}
              onDeleted={handleModalDeleted}
            />
          )}
        </SubContainer>

        {/* Bottom container - Archived */}
        <SubContainer>
          <Header>
            <h2>Arquivo</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Tag>{archivedPrescriptions.length} — total</Tag>
              <Button $outline onClick={() => getPrescriptions().then(setPrescriptions)}>Atualizar</Button>
            </div>
          </Header>

          <ControlsRow>
            <div style={{ flex: 1 }}>
              <SmallInput placeholder="Pesquisar no arquivo..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <TwoColumnControls>
              <FilterGroup>
                <label>Período</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SmallInput type="date" onChange={(e) => updateFilter(false, { dateFrom: e.target.value || undefined })} />
                  <SmallInput type="date" onChange={(e) => updateFilter(false, { dateTo: e.target.value || undefined })} />
                </div>
              </FilterGroup>

              <FilterGroup>
                <label>Cliente</label>
                <Select onChange={(e) => updateFilter(false, { clientUniqueID: e.target.value || undefined })}>
                  <option value="">Todos</option>
                  {clients.map(c => <option key={c.uniqueID} value={c.uniqueID}>{c.name}</option>)}
                </Select>
              </FilterGroup>

              <FilterGroup>
                <label>Valor (min / max)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <SmallInput type="number" placeholder="min" onChange={(e) => updateFilter(false, { minTotal: e.target.value ? Number(e.target.value) : undefined })} />
                  <SmallInput type="number" placeholder="max" onChange={(e) => updateFilter(false, { maxTotal: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
              </FilterGroup>

              <FilterGroup>
                <label>Ordenar</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Select onChange={(e) => updateSort(false, { ...archivedSort, sortBy: e.target.value as any })} value={archivedSort.sortBy}>
                    <option value="createdAt">Data</option>
                    <option value="finalPrice">Valor Final</option>
                    <option value="productsTotalCost">Produtos</option>
                  </Select>
                  <Select onChange={(e) => updateSort(false, { ...archivedSort, sortDir: e.target.value as any })} value={archivedSort.sortDir}>
                    <option value="desc">Maior → Menor</option>
                    <option value="asc">Menor → Maior</option>
                  </Select>
                </div>
              </FilterGroup>
            </TwoColumnControls>
          </ControlsRow>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
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
                {!isLoading && archivedFinal.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState>{error ? `Erro: ${error}` : 'Nenhuma prescrição arquivada encontrada'}</EmptyState>
                    </td>
                  </tr>
                )}

                {!isLoading && archivedFinal.map(p => {
                  const client = clients.find(c => c.uniqueID === p.clientUniqueID);
                  return (
                    <tr key={p.uniqueID}>
                      <td className="nowrap">{formatDate(p.createdAt)}</td>
                      <td><strong>{client?.name || '—'}</strong></td>
                      <td>
                        {p.products && p.products.length > 0 ? (
                          (() => {
                            const names = p.products.map(pr => pr.name || '—');
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
                      <td className="center">{p.products?.length ?? 0}</td>
                      <td className="nowrap">{p.productsTotalCost ?? '—'}</td>
                      <td className="nowrap">{p.hasDeliveryCost ? (p.deliveryCost ?? 0) : 0}</td>
                      <td className="final nowrap">{p.finalPrice ?? '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <ActionButton onClick={() => handleEdit(p)}>Editar</ActionButton>
                          <ActionButton $danger onClick={() => handleDelete(p.uniqueID)}>Excluir</ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </SubContainer>

      </PageWrapper>
    </PageLayout>
  );
}
