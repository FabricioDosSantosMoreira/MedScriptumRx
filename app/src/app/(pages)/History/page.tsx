'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { loadPrescriptionHistoryData } from '@/lib/utils/utils';
import { PrescriptionData } from '@/types/PrescriptionData';

import EditPrescriptionModal from "@/components/EditPrescriptionModal/EditPrescriptionModal";
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

  useEffect(() => {
    loadPrescriptionHistoryData().then((data) => setPrescriptions(data));
  }, []);

  // filter states
  const [filterName, setFilterName] = useState<string>(''); // empty = all
  const [dateFrom, setDateFrom] = useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState<string>(''); // yyyy-mm-dd
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // // derive unique names for the select
  // const uniqueClientNames = useMemo(() => {
  //   const names = Array.from(new Set(prescriptions.map((p) => p.clientName).filter(Boolean)));
  //   names.sort((a, b) => a.localeCompare(b));
  //   return names;
  // }, [prescriptions]);

  const uniqueClientNames = useMemo(() => {
    const counts = new Map<string, number>();

    prescriptions.forEach((p) => {
      if (!p.clientName) return;
      counts.set(p.clientName, (counts.get(p.clientName) ?? 0) + 1);
    });

    // retornar uma lista de objetos
    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        label: `[${count}] ${name}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [prescriptions]);

  
  // filtering logic
  const filteredPrescriptions = useMemo(() => {
    // helper to parse strings like: "24/09/2025, 16:12:09"
    const parseCreatedAt = (s?: string | null): Date | null => {
      if (!s || typeof s !== 'string') return null;
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
    };

    const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
    const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

    let out = prescriptions.filter((p) => {
      // filter by name
      if (filterName && filterName !== 'all' && p.clientName !== filterName) return false;

      // filter by date range using the custom parser
      if (fromDate || toDate) {
        const created = parseCreatedAt(p.createdAt);
        if (!created) return false;
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
      }

      return true;
    });

    // sort by createdAt using the custom parser
    out.sort((a, b) => {
      const taDate = parseCreatedAt(a.createdAt);
      const tbDate = parseCreatedAt(b.createdAt);
      const ta = taDate ? taDate.getTime() : 0;
      const tb = tbDate ? tbDate.getTime() : 0;
      return sortOrder === 'recent' ? tb - ta : ta - tb;
    });

    return out;
  }, [prescriptions, filterName, dateFrom, dateTo, sortOrder]);

  // Split array into chunks
  const chunkArray = (arr: any[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  // Chunk only the filtered prescriptions
  const normalGroups: PrescriptionData[][] = chunkArray(filteredPrescriptions, 2);

  // Create final groups
  const prescriptionGroups: PrescriptionData[][] = [
    ...normalGroups,
  ];

  // print hook (optional) - prints all visible sheets
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

  const updatePrescriptionData = () => {
    loadPrescriptionHistoryData().then((data) => setPrescriptions(data));
  }

  return (
    <PageLayout>
      <PageContainer>
        <QuerySelectorContainer>
          <ControlsRow>
            <div>
              <Label>Cliente</Label>
              <Select
                value={filterName || 'all'}
                onChange={(e) => setFilterName(e.target.value === 'all' ? '' : e.target.value)}
              >
                <option value="all">Todos os clientes</option>

                {uniqueClientNames.map((item) => (
                  <option key={item.name} value={item.name}>
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
        

        {filteredPrescriptions.length === 0 ? (
          <EmptyState>Nenhuma prescrição encontrada com os filtros selecionados.</EmptyState>
        ) : (
          <PrintableContainer ref={contentRef}>
            {prescriptionGroups.map((group, groupId) => (
              <PrescriptionGroup key={groupId} group={group} groupId={groupId} groupActionButtons={groupActionButtons} onDataUpdated={updatePrescriptionData} isHistoryData={true}/>
            ))}
          </PrintableContainer>
          )
        }
      </PageContainer>
    </PageLayout>
  );
}
