'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import PageLayout from '@/components/Layouts/Page/PageLayout';
import PrescriptionGroup from '@/components/PrescriptionGroup/PrescriptionGroup';

import { getPrescriptions } from '@/lib/utils/prescription';
import { getClients } from '@/lib/utils/client';
import { resolvePrescriptions } from '@/lib/resolvePrescriptions';

import { PrescriptionData } from '@/types/PrescriptionData';
import { ClientData } from '@/types/ClientData';
import { ResolvedPrescription } from '@/types/ResolvedPrescription';

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
  const [prescriptions, setPrescriptions] =
    useState<ResolvedPrescription[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------
     Load + Resolve
  -------------------------------- */

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [raw, clients] = await Promise.all([
        getPrescriptions(),
        getClients(),
      ]);

      // only inactive (history)
      const history = (raw as PrescriptionData[]).filter(
        p => p.isActive === false
      );

      const resolved = resolvePrescriptions(
        history,
        clients as ClientData[]
      );

      setPrescriptions(resolved);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Erro carregando histórico');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* --------------------------------
     Filters
  -------------------------------- */

  const [filterClientID, setFilterClientID] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] =
    useState<'recent' | 'oldest'>('recent');

  /* --------------------------------
     Client Select
  -------------------------------- */

  const uniqueClients = useMemo(() => {
    const counts = new Map<string, number>();

    prescriptions.forEach(p => {
      counts.set(
        p.client.uniqueID,
        (counts.get(p.client.uniqueID) ?? 0) + 1
      );
    });

    return Array.from(counts.entries())
      .map(([id, count]) => {
        const name =
          prescriptions.find(p => p.client.uniqueID === id)?.client
            .name ?? 'Cliente desconhecido';

        return {
          id,
          label: `[${count}] ${name}`,
          name,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [prescriptions]);

  /* --------------------------------
     Date Parser
  -------------------------------- */

  const parseDate = (s?: string | null): Date | null => {
    if (!s) return null;

    if (s.includes('/')) {
      try {
        const [date, time = '00:00:00'] = s.split(', ');
        const [d, m, y] = date.split('/').map(Number);
        const [h, min, sec] = time.split(':').map(Number);

        return new Date(y, m - 1, d, h, min, sec);
      } catch {
        return null;
      }
    }

    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const fromDate = dateFrom
    ? new Date(dateFrom + 'T00:00:00')
    : null;

  const toDate = dateTo
    ? new Date(dateTo + 'T23:59:59')
    : null;

  /* --------------------------------
     Filtered Data
  -------------------------------- */

  const filtered = useMemo(() => {
    let out = prescriptions.filter(p => {
      if (
        filterClientID &&
        p.client.uniqueID !== filterClientID
      ) {
        return false;
      }

      if (fromDate || toDate) {
        const created = parseDate(p.createdAt);
        if (!created) return false;

        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
      }

      return true;
    });

    out.sort((a, b) => {
      const ta = parseDate(a.createdAt)?.getTime() ?? 0;
      const tb = parseDate(b.createdAt)?.getTime() ?? 0;

      return sortOrder === 'recent' ? tb - ta : ta - tb;
    });

    return out;
  }, [prescriptions, filterClientID, fromDate, toDate, sortOrder]);

  /* --------------------------------
     Grouping
  -------------------------------- */

  const chunk = <T,>(arr: T[], size: number): T[][] =>
    Array.from(
      { length: Math.ceil(arr.length / size) },
      (_, i) => arr.slice(i * size, i * size + size)
    );

  const groups: ResolvedPrescription[][] = chunk(filtered, 2);

  /* --------------------------------
     Print
  -------------------------------- */

  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    preserveAfterPrint: true,
    documentTitle: 'Histórico',
  });

  /* --------------------------------
     Helpers
  -------------------------------- */

  const clearFilters = () => {
    setFilterClientID('');
    setDateFrom('');
    setDateTo('');
    setSortOrder('recent');
  };

  const groupActionButtons: GroupActionButtons[] = [
    {
      buttonName: 'Imprimir 🖨️',
      buttonType: 'print',
      buttonCallbackFunc: handlePrint,
    },
  ];

  /* --------------------------------
     UI
  -------------------------------- */

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PageLayout>
      <PageContainer>
        <QuerySelectorContainer>
          <ControlsRow>
            {/* CLIENT */}
            <div>
              <Label>Cliente</Label>

              <Select
                value={filterClientID || 'all'}
                onChange={e =>
                  setFilterClientID(
                    e.target.value === 'all'
                      ? ''
                      : e.target.value
                  )
                }
              >
                <option value="all">
                  Todos os clientes
                </option>

                {uniqueClients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* DATE FROM */}
            <div>
              <Label>Data (de)</Label>
              <DateInput
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>

            {/* DATE TO */}
            <div>
              <Label>Data (até)</Label>
              <DateInput
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>

            {/* SORT */}
            <div>
              <Label>Ordenar</Label>

              <SortToggle>
                <label>
                  <input
                    type="radio"
                    checked={sortOrder === 'recent'}
                    onChange={() =>
                      setSortOrder('recent')
                    }
                  />
                  Mais recente
                </label>

                <label>
                  <input
                    type="radio"
                    checked={sortOrder === 'oldest'}
                    onChange={() =>
                      setSortOrder('oldest')
                    }
                  />
                  Mais antigo
                </label>
              </SortToggle>
            </div>
          </ControlsRow>

          <ButtonsContainer>
            <ClearButton onClick={clearFilters}>
              Limpar filtros
            </ClearButton>

            <PrintButton onClick={handlePrint}>
              Imprimir Tudo
            </PrintButton>
          </ButtonsContainer>
        </QuerySelectorContainer>

        {filtered.length === 0 ? (
          <EmptyState>
            Nenhuma prescrição encontrada.
          </EmptyState>
        ) : (
          <PrintableContainer ref={contentRef}>
            {groups.map((group, i) => (
              <PrescriptionGroup
                key={i}
                group={group}
                groupActionButtons={groupActionButtons}
                onDataUpdated={loadData}
              />
            ))}
          </PrintableContainer>
        )}
      </PageContainer>
    </PageLayout>
  );
}
