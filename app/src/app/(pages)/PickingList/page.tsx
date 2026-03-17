'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  TableContainer,
  Header,
  Title,
  ControlsRow,
  SearchInput,
  TableWrapper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  PrescriptionSelect,
  SmallToggle,
  CollapsibleProducts,
  ProductRow,
  FooterBar,
  GerarButton,
  PrintButton,
  PickingTitle,
  MetaRow,
  ItemsTable,
  ItemsTh,
  ItemsTd,
  EmptyState,
  LoadingState,
  ErrorMessage,
  PrintableContainer,
  ListContainer,
  ClientName,
} from './page.styles';

import { getPrescriptions } from '@/app/Lib/utils/prescription';
import { getClients } from '@/app/Lib/utils/client';
import { resolvePrescriptions } from '@/app/Lib/resolvePrescriptions';
import { getDateFormated } from '@/app/Lib/utils';
import {
  ResolvedPrescription,
  PrescriptionData,
  ClientData,
} from '@/types/index';
import PageLayout from '@/app/Components/Layouts/Page/PageLayout';
import A4Sheet from '@/app/Components/A4Sheet/A4Sheet';

type ProductSelection = {
  includeAll: boolean;
  selectedProductIDs: Set<string>; // product.uniqueID or product.internalSystemID as identifier (use uniqueID if available)
  expanded?: boolean;
};

export default function PickingListPage(): JSX.Element {
  const [prescriptions, setPrescriptions] = useState<ResolvedPrescription[]>(
    []
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map prescriptionUniqueID -> ProductSelection
  const [selectionMap, setSelectionMap] = useState<Record<string, ProductSelection>>(
    {}
  );

  const [generated, setGenerated] = useState(false);
  const [aggregatedItems, setAggregatedItems] = useState<any[]>([]);
  const [aggregatedClientsNames, setAggregatedClientsNames] = useState<string[]>([]);


  const printRef = useRef<HTMLDivElement | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rawPrescriptions, clients] = await Promise.all([
        getPrescriptions(),
        getClients(),
      ]);

      // filter active prescriptions (user asked: active prescriptions)
      const active = (rawPrescriptions as PrescriptionData[]).filter(
        (p) => (p as any).isActive === true || (p as any).status === 'active'
      );

      const resolved = resolvePrescriptions(
        active as PrescriptionData[],
        clients as ClientData[]
      ) as ResolvedPrescription[];

      setPrescriptions(resolved);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Erro carregando prescrições');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // filter by search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) => {
      return (
        p.client.name.toLowerCase().includes(q) ||
        p.client.uniqueID?.toLowerCase().includes(q)
      );
    });
  }, [prescriptions, search]);

  // toggle selection (checkbox)
  function togglePrescriptionSelection(prescriptionID: string) {
    setSelectionMap((prev) => {
      const copy = { ...prev };
      if (!copy[prescriptionID]) {
        // default to includeAll true
        copy[prescriptionID] = {
          includeAll: true,
          selectedProductIDs: new Set(),
          expanded: false,
        };
      } else {
        delete copy[prescriptionID];
      }
      return copy;
    });
    setGenerated(false);
  }

  // change select option for a prescription
  function setSelectMode(prescriptionID: string, mode: 'includeAll' | 'choose') {
    setSelectionMap((prev) => {
      const copy = { ...prev };
      const cur = copy[prescriptionID] ?? {
        includeAll: true,
        selectedProductIDs: new Set<string>(),
        expanded: false,
      };
      if (mode === 'includeAll') {
        cur.includeAll = true;
        cur.selectedProductIDs = new Set();
        cur.expanded = false;
      } else {
        cur.includeAll = false;
        // keep existing selected products if any, otherwise preselect all
        if (cur.selectedProductIDs.size === 0 && prescriptions.length) {
          const p = prescriptions.find((x) => x.uniqueID === prescriptionID);
          if (p) p.products.forEach((prod) => cur.selectedProductIDs.add(prod.uniqueID));
        }
        cur.expanded = true;
      }
      copy[prescriptionID] = cur;
      return copy;
    });
    setGenerated(false);
  }

  function toggleProductInPrescription(
    prescriptionID: string,
    productID: string
  ) {
    setSelectionMap((prev) => {
      const copy = { ...prev };
      if (!copy[prescriptionID]) {
        copy[prescriptionID] = {
          includeAll: false,
          selectedProductIDs: new Set([productID]),
          expanded: true,
        };
      } else {
        const cur = copy[prescriptionID];
        const setCopy = new Set(cur.selectedProductIDs);
        if (setCopy.has(productID)) setCopy.delete(productID);
        else setCopy.add(productID);
        cur.selectedProductIDs = setCopy;
        cur.includeAll = false;
        copy[prescriptionID] = cur;
      }
      return copy;
    });
    setGenerated(false);
  }

  const formatCurrency = (value) => {
    try {
      // Tenta converter para número, caso venha como string
      const num = Number(value);
      
      // Se não for um número válido (NaN), lança erro para cair no catch
      if (isNaN(num)) throw new Error("Invalid number");

      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(num);
    } catch (error) {
      // Fallback: retorna o valor original com o prefixo R$
      return `R$${value}`;
    }
  };

  // build aggregated picking items grouped by internalSystemID
  function handleGenerate() {
    const selectedPrescriptionIDs = Object.keys(selectionMap);
    if (selectedPrescriptionIDs.length === 0) return;

    const aggMap: Record<string, {
      internalSystemID: string;
      name: string;
      presentation?: string;
      totalQty: number;
      value: number;
      clients: Set<string>;
      perClient?: { clientID: string; clientName: string; qty: number }[];
    }> = {};

    for (const prescID of selectedPrescriptionIDs) {
      const presc = prescriptions.find((p) => p.uniqueID === prescID);


      const name = presc?.client.name;
      if (name) {
        setAggregatedClientsNames((prevNames) => {
          // 1. Correct way to check for a value in an array
          if (prevNames.includes(name)) {
            return prevNames; 
          }
          // 2. Return a NEW array with the new name added
          return [...prevNames, name];
        });
      }



      if (!presc) continue;
      const sel = selectionMap[prescID];
      const productsToIterate = sel.includeAll
        ? presc.products
        : presc.products.filter((prod) =>
            sel.selectedProductIDs.has(prod.uniqueID)
          );

      console.log(productsToIterate);

      productsToIterate.forEach((prod) => {
        const key = prod.uniqueID;
        if (!aggMap[key]) {
          aggMap[key] = {
            internalSystemID: prod.internalSystemID,
            value: prod.finalPrice,
            name: prod.name,
            presentation: prod.presentation,
            totalQty: 0,
            clients: new Set(),
            perClient: [],
          };
        }
        const qty = Number(prod.quantity ?? 1) || 1;
        aggMap[key].totalQty += qty;
        aggMap[key].clients.add(presc.client.name);
        aggMap[key].perClient?.push({
          clientID: presc.client.uniqueID,
          clientName: presc.client.name,
          qty,
        });
      });

      
    }

    const aggregated = Object.values(aggMap).map((v) => ({
      ...v,
      clients: Array.from(v.clients).join(', '),
    }));

    // sort by name
    aggregated.sort((a, b) => a.name.localeCompare(b.name));

    setAggregatedItems(aggregated);
    setGenerated(true);
    // scroll to bottom / to the print sheet? we leave printing for user.

    console.log(aggregatedClientsNames)
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    preserveAfterPrint: true,
    documentTitle: `Picking-List-${getDateFormated()}`,
  });

  // helpers
  const anySelected = Object.keys(selectionMap).length > 0;

  return (

    <PageLayout>
      
      <TableContainer>
        <Header>
          <Title>Gerar Lista de Separação Agrupada</Title>
        </Header>

        <ControlsRow>
          <SearchInput
            placeholder="Procurar por nome do cliente ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ControlsRow>

        {loading ? (
          <LoadingState>Carregando prescrições...</LoadingState>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : filtered.length === 0 ? (
          <EmptyState>Nenhuma prescrição ativa encontrada.</EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <Thead>
                <Tr>
                  <Th style={{ width: 40 }}>Sel</Th>
                  <Th>Cliente</Th>
                  <Th>Cliente ID</Th>
                  <Th>Produtos</Th>
                  <Th style={{ width: 220 }}>Opção</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((p) => {
                  const selection = selectionMap[p.uniqueID];
                  return (
                    <React.Fragment key={p.uniqueID}>
                      <Tr>
                        <Td>
                          <input
                            type="checkbox"
                            checked={!!selection}
                            onChange={() => togglePrescriptionSelection(p.uniqueID)}
                            aria-label={`Selecionar prescrição ${p.client.name}`}
                          />
                        </Td>
                        <Td>
                          <strong>{p.client.name}</strong>
                          <div style={{ fontSize: 12, color: '#556' }}>
                            {p.client.address ?? ''}
                          </div>
                        </Td>
                        <Td>{p.client.uniqueID}</Td>
                        <Td>{p.products.length}</Td>

                        <Td>
                          <PrescriptionSelect
                            value={selection?.includeAll ? 'includeAll' : 'choose'}
                            onChange={(e) =>
                              setSelectMode(p.uniqueID, e.target.value === 'includeAll' ? 'includeAll' : 'choose')
                            }
                            disabled={!selection}
                            aria-label="Modo seleção de produtos"
                          >
                            <option value="includeAll">Incluir todos os produtos</option>
                            <option value="choose">Selecionar produtos</option>
                          </PrescriptionSelect>

                          {/* expand toggle */}
                          {selection && (
                            <SmallToggle
                              onClick={() =>
                                setSelectionMap((prev) => {
                                  const copy = { ...prev };
                                  copy[p.uniqueID] = {
                                    ...copy[p.uniqueID],
                                    expanded: !copy[p.uniqueID].expanded,
                                  };
                                  return copy;
                                })
                              }
                            >
                              {selection.expanded ? 'Ocultar' : 'Produtos'}
                            </SmallToggle>
                          )}
                        </Td>
                      </Tr>

                      {/* Collapsible product list */}
                      {selection && selection.expanded && (
                        <Tr>
                          <Td colSpan={5} style={{ padding: 8 }}>
                            <CollapsibleProducts>
                              {p.products.map((prod) => {
                                const prodKey = prod.uniqueID;
                                const checked =
                                  selection.includeAll ||
                                  selection.selectedProductIDs.has(prodKey);
                                return (
                                  <ProductRow key={prodKey}>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          toggleProductInPrescription(
                                            p.uniqueID,
                                            prodKey
                                          )
                                        }
                                      />{' '}
                                      <strong>{prod.name}</strong>{' '}
                                      <span style={{ color: '#555' }}>
                                        ({prod.presentation ?? '—'}) — qtd:{' '}
                                        {prod.quantity ?? 1}
                                      </span>
                                    </label>
                                  </ProductRow>
                                );
                              })}
                            </CollapsibleProducts>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
        )}


        <FooterBar>
          <GerarButton disabled={!anySelected} onClick={handleGenerate}>
            Gerar
          </GerarButton>

          {generated && (
            <PrintButton onClick={handlePrint}>Imprimir</PrintButton>
          )}
        </FooterBar>
      </TableContainer>

        
      {generated && (
        <ListContainer>
          <PrintableContainer ref={printRef}>
            <A4Sheet
              orientation="portrait"
              padding="24px"
              gap="12px"
              justifyContent='flex-start'
              alignItems='flex-start'
            >

              <PickingTitle>Lista de Separação</PickingTitle>
              <ClientName>
                {aggregatedClientsNames.length > 1 ? "Clientes" : "Cliente"}: {aggregatedClientsNames.join(", ")}
              </ClientName>
              

              <ItemsTable>
                <thead>
                  <tr>
                    <ItemsTh>&#x2714;</ItemsTh>
                    <ItemsTh>ID Interno</ItemsTh>
                    <ItemsTh>Produto</ItemsTh>
                    <ItemsTh>Valor Un.</ItemsTh>
                    <ItemsTh>Valor Total</ItemsTh>
                    <ItemsTh>Qtd Total</ItemsTh>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedItems.map((it, idx) => (
                    <tr key={it.internalSystemID + idx}>
                      <ItemsTd $width='4%'></ItemsTd>
                      <ItemsTd $width='10%'>{it.internalSystemID}</ItemsTd>
                      <ItemsTd>{it.name + ' ' + it.presentation}</ItemsTd>
                      <ItemsTd $width='10%'>{formatCurrency(it.value)}</ItemsTd>
                      <ItemsTd $width='10%'>{formatCurrency(it.value * it.totalQty)}</ItemsTd>
                      <ItemsTd $width='8%'>{it.totalQty}</ItemsTd>
                    </tr>
                  ))}
                </tbody>
              </ItemsTable>


              <div style={{ marginTop: 24, fontSize: 11, color: '#444', flexDirection: 'column'}}>
                <p>Observações:</p>
                
                <p>
                  {'- - -> Qtd Total de Itens: ' + aggregatedItems.reduce((acc, item) => {return acc + item.totalQty}, 0)}
                 
                </p>

                <p>
                   {'- - -> Valor Total Est.: ' + formatCurrency(aggregatedItems.reduce((acc, item) => {
                    const price = (parseFloat(item.value) || 0) * item.totalQty;
                    return acc + price;
                  }, 0))}
                </p>
              
              </div>

              <MetaRow>
                <div>Gerado em: {getDateFormated()}</div>
                <div>Prescrições: {Object.keys(selectionMap).length}</div>
              </MetaRow>

            </A4Sheet>

          </PrintableContainer>
        </ListContainer>
      )}

  
    
    </PageLayout>
  );
}