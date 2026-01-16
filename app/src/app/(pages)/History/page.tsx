'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { loadPrescriptions, loadClients } from '@/lib/utils/utils';
import { PrescriptionData, ClientData } from '@/app/Types/Index';
import { ResolvedPrescription } from '@/types/PrescriptionData';

import PrescriptionGroup from '@/components/PrescriptionGroup/PrescriptionGroup';
import PageLayout from '@/components/Layouts/Page/PageLayout';

import {
  PrintableContainer,
  ButtonsContainer,
  PageContainer,
  PrintButton,
  QuerySelectorContainer,
  ControlsRow,
  Label,
  Select,
  DateInput,
  ClearButton,
  EmptyState,
  SortToggle,
} from './page.styles';


export default function Page() {

  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  useEffect(() => {
    // carregar histórico: passe true para carregar histórico (conforme sua função existente)
    loadPrescriptions(false).then(setPrescriptions);
    loadClients(true).then(setClients);
  }, []);


  const updatePrescriptionData = () => {
    loadPrescriptions(false).then(setPrescriptions);
    loadClients(true).then(setClients);
  }


  // --------------------------------------------------
  // RESOLVE PRESCRIPTIONS -> ResolvedPrescription[]
  // --------------------------------------------------
  const resolvedPrescriptions = useMemo<ResolvedPrescription[]>(() => {
    const clientMap = new Map<string, ClientData>();
    clients.forEach(c => clientMap.set(c.uniqueID, c));

    return prescriptions
      .map((p): ResolvedPrescription | null => {
        // require uniqueID
        if (!p.uniqueID) return null;

        const client = p.clientID ? clientMap.get(p.clientID) ?? null : null;

        // if there's no client, skip — you can change this behavior if you prefer to show "Cliente desconhecido"
        if (!client) return null;

        return {
          uniqueID: p.uniqueID,
          client,
          createdAt: p.createdAt ?? new Date().toISOString(),
          isActive: p.isActive ?? true,
          isSingle: p.isSingle ?? false,
          products: Array.isArray(p.products) ? p.products : [],
          args: p.args ?? {},
        };
      })
      .filter(Boolean) as ResolvedPrescription[];
  }, [prescriptions, clients]);

  // filter states
  const [filterName, setFilterName] = useState<string>(''); // will hold client.uniqueID or ''
  const [dateFrom, setDateFrom] = useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState<string>(''); // yyyy-mm-dd
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // derive unique clients for the select (clientID + name + count)
  const uniqueClients = useMemo(() => {
    const counts = new Map<string, number>();

    resolvedPrescriptions.forEach((p) => {
      if (!p.client?.uniqueID) return;
      counts.set(p.client.uniqueID, (counts.get(p.client.uniqueID) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([clientID, count]) => ({
        clientID,
        name: (clients.find(c => c.uniqueID === clientID)?.name) ?? 'Cliente desconhecido',
        label: `[${count}] ${ (clients.find(c => c.uniqueID === clientID)?.name) ?? 'Cliente desconhecido' }`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [resolvedPrescriptions, clients]);

  // helper: parse createdAt (accepts "dd/MM/yyyy, HH:mm:ss" OR ISO string)
  const parseCreatedAt = (s?: string | null): Date | null => {
    if (!s || typeof s !== 'string') return null;

    // detect dd/MM/yyyy pattern (contains '/')
    if (s.includes('/')) {
      try {
        const parts = s.split(',').map((x) => x.trim());
        if (parts.length === 0) return null;
        const datePart = parts[0]; // dd/MM/yyyy
        const timePart = parts[1] || '00:00:00'; // HH:mm:ss
        const [dd, mm, yyyy] = datePart.split('/').map((n) => Number(n));
        const [hh, min, ss] = timePart.split(':').map((n) => Number(n));
        if ([dd, mm, yyyy, hh, min, ss].some((v) => Number.isNaN(v))) return null;
        return new Date(yyyy, mm - 1, dd, hh || 0, min || 0, ss || 0);
      } catch (e) {
        return null;
      }
    }

    // otherwise, try ISO/parsable date
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
  const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

  // filtering logic operates over resolvedPrescriptions
  const filteredResolved = useMemo(() => {
    let out = resolvedPrescriptions.filter((p) => {
      // filter by client (filterName stores clientID)
      if (filterName && filterName !== 'all' && p.client.uniqueID !== filterName) return false;

      // filter by date range using the custom parser
      if (fromDate || toDate) {
        const created = parseCreatedAt(p.createdAt);
        if (!created) return false;
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
      }

      return true;
    });

    // sort by createdAt
    out.sort((a, b) => {
      const taDate = parseCreatedAt(a.createdAt);
      const tbDate = parseCreatedAt(b.createdAt);
      const ta = taDate ? taDate.getTime() : 0;
      const tb = tbDate ? tbDate.getTime() : 0;
      return sortOrder === 'recent' ? tb - ta : ta - tb;
    });

    return out;
  }, [resolvedPrescriptions, filterName, dateFrom, dateTo, sortOrder]);

  // Split array into chunks
  const chunkArray = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.max(1, Math.ceil(arr.length / size)) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  // Chunk only the filtered prescriptions (2 per group)
  const normalGroups: ResolvedPrescription[][] = chunkArray(filteredResolved, 2);

  // Create final groups
  const prescriptionGroups: ResolvedPrescription[][] = [
    ...normalGroups,
  ];

  // print hook (prints all visible sheets)
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    documentTitle: 'Histórico',
  });

  // clear filters
  const clearFilters = () => {
    setFilterName('');
    setDateFrom('');
    setDateTo('');
    setSortOrder('recent');
  };

  const groupActionButtons: GroupActionButtons[] = [
    {
      buttonName: "Imprimir 🖨️",
      buttonType: "print",
      buttonCallbackFunc: () => handlePrint
    }
  ];



  return (
    <PageLayout>
      <PageContainer>
        <QuerySelectorContainer>
          <ControlsRow>
            <div>
              <Label>Cliente</Label>
              <Select
                value={filterName || 'all'}
                onChange={(e) =>
                  setFilterName(e.target.value === 'all' ? '' : e.target.value)
                }
              >
                <option value="all">Todos os clientes</option>

                {uniqueClients.map((item) => (
                  <option key={item.clientID} value={item.clientID}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Data (de)</Label>
              <DateInput
                type='date'
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label>Data (até)</Label>
              <DateInput
                type='date'
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div>
              <Label>Ordenar por</Label>
              <SortToggle>
                <label>
                  <input
                    type='radio'
                    name='sort'
                    checked={sortOrder === 'recent'}
                    onChange={() => setSortOrder('recent')}
                  />
                  Mais recente
                </label>
                <label>
                  <input
                    type='radio'
                    name='sort'
                    checked={sortOrder === 'oldest'}
                    onChange={() => setSortOrder('oldest')}
                  />
                  Mais antigo
                </label>
              </SortToggle>
            </div>
          </ControlsRow>

          <ButtonsContainer>
            <ClearButton onClick={clearFilters}>Limpar filtros</ClearButton>

            <PrintButton onClick={handlePrint}>Imprimir Tudo</PrintButton>
          </ButtonsContainer>
        </QuerySelectorContainer>

        {/* hidden wrapper for print hook */}

        {filteredResolved.length === 0 ? (
          <EmptyState>Nenhuma prescrição encontrada com os filtros selecionados.</EmptyState>
        ) : (
          <PrintableContainer ref={contentRef}>
            {prescriptionGroups.map((group, groupId) => (
              <PrescriptionGroup
                key={groupId}
                group={group}
                groupId={groupId}
                groupActionButtons={groupActionButtons}
                onDataUpdated={updatePrescriptionData}
                isHistoryData={true}
              />
            ))}
          </PrintableContainer>
        )}
      </PageContainer>
    </PageLayout>
  );
}
