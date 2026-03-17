import { ApiResponse, ClientData, PrescriptionData, ResolvedProductData } from '@/app/Types/!Index';


export function formatDate(iso?: string) {
    if (!iso) return '-';
    
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        });
    } catch (e) {
      return iso;
    }
}

export function getDateFormated(): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // NOTE: months are 0-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getDateTimeFormated(timezone: string = 'BRT'): string {
  const date = new Date();

  // TimeZome Map
  const tzMap: Record<string, string> = {
    BRT: "America/Sao_Paulo", // Brazilian timezone
  };

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: tzMap[timezone],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formatter.format(date);
}

export async function handleAPIResponse<T>(res: Response): Promise<T> {
  let json: ApiResponse<T>;

  try {
    json = await res.json();
  } catch {
    throw new Error('Invalid Server Response');
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || res.statusText || 'Request Error');
  }

  if (json.data === undefined) {
    throw new Error('No Server Response');
  }

  return json.data;
}



export type NoExtraKeysFromArray<T, Allowed extends readonly string[]> = Exclude<keyof T, Allowed[number]> extends never ? T : never;

export function validateNoExtraFields<
  Allowed extends readonly string[]
>(
  body: Record<string, unknown>,
  allowed: Allowed
) {
  const invalidFields = Object.keys(body).filter(
    key => !allowed.includes(key)
  );

  return {
    valid: invalidFields.length === 0,
    invalidFields,
  };
}



type PricingInput = Partial<PrescriptionData>;

export function calculatePrescriptionPrices(
  data: PricingInput
): Pick<PrescriptionData, 'productsTotalCost' | 'finalPrice'> {

  const products: ResolvedProductData[] = data.products ?? [];

  const hasDeliveryCost = data.hasDeliveryCost ?? true;
  const deliveryCost = Number(data.deliveryCost ?? 0);

  // 1️⃣ Calculate products total
  const productsTotalCost = products.reduce(
    (sum, p) => sum + Number(p.finalPrice ?? 0),
    0
  );

  // 2️⃣ Calculate final price
  const calculatedFinal =
    productsTotalCost +
    (hasDeliveryCost ? deliveryCost : 0);

  // 3️⃣ Respect manual finalPrice if present
  const finalPrice =
    data.finalPrice !== undefined &&
    data.finalPrice !== null
      ? Number(data.finalPrice)
      : calculatedFinal;

  return {
    productsTotalCost,
    finalPrice,
  };
}