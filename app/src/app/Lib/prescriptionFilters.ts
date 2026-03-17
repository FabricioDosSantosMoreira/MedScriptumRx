
import { PrescriptionData } from '@/app/Types/!Index';

export type FilterOptions = {
  dateFrom?: string; // yyyy-mm-dd
  dateTo?: string; // yyyy-mm-dd
  clientUniqueID?: string;
  minTotal?: number;
  maxTotal?: number;
};

export type SortOptions = {
  sortBy?: 'createdAt' | 'finalPrice' | 'productsTotalCost';
  sortDir?: 'asc' | 'desc';
};

function parseLocalDate(date: string, endOfDay = false): number {
  const [year, month, day] = date.split('-').map(Number);

  if (endOfDay) {
    return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

export function applyFiltersAndSort(
  list: PrescriptionData[],
  filters?: FilterOptions,
  sort?: SortOptions
): PrescriptionData[] {
  let out = list.slice();

  if (filters) {
    if (filters.clientUniqueID) {
      out = out.filter(p => p.clientUniqueID === filters.clientUniqueID);
    }

    // if (filters.dateFrom) {
    //   const from = new Date(filters.dateFrom).setHours(0,0,0,0);
    //   out = out.filter(p => new Date(p.createdAt).getTime() >= from);
    // }

    // if (filters.dateTo) {
    //   // If user provided dateTo we include the whole day
    //   const to = new Date(filters.dateTo);
    //   to.setHours(23,59,59,999);
    //   out = out.filter(p => new Date(p.createdAt).getTime() <= to.getTime());
    // }

    if (filters.dateFrom) {
      const from = parseLocalDate(filters.dateFrom);
      out = out.filter(p => new Date(p.createdAt).getTime() >= from);
    }

    if (filters.dateTo) {
      const to = parseLocalDate(filters.dateTo, true);
      out = out.filter(p => new Date(p.createdAt).getTime() <= to);
    }


    if (filters.minTotal !== undefined) {
      out = out.filter(p => (p.finalPrice ?? 0) >= filters.minTotal!);
    }

    if (filters.maxTotal !== undefined) {
      out = out.filter(p => (p.finalPrice ?? 0) <= filters.maxTotal!);
    }
  }

  // Sorting
  const sortBy = sort?.sortBy ?? 'createdAt';
  const sortDir = sort?.sortDir ?? 'desc';

  out.sort((a, b) => {
    let va: number | string = '';
    let vb: number | string = '';

    if (sortBy === 'createdAt') {
      va = a.createdAt;
      vb = b.createdAt;
    } else if (sortBy === 'finalPrice') {
      va = Number(a.finalPrice ?? 0);
      vb = Number(b.finalPrice ?? 0);
    } else if (sortBy === 'productsTotalCost') {
      va = Number(a.productsTotalCost ?? 0);
      vb = Number(b.productsTotalCost ?? 0);
    }

    if (typeof va === 'string' && typeof vb === 'string') {
      // compare ISO dates as strings works
      if (va === vb) return 0;
      return (va > vb ? 1 : -1) * (sortDir === 'asc' ? 1 : -1);
    }

    const na = Number(va);
    const nb = Number(vb);
    if (na === nb) return 0;

    return (na > nb ? 1 : -1) * (sortDir === 'asc' ? 1 : -1);
  });

  return out;
}
