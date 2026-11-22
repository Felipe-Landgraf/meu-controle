const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const MAX_CENTS = 2_147_483_647;

export function parseCents(input: string) {
  const value = input.trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(",");
  const cents = Number(whole.replaceAll(".", "") + fraction.padEnd(2, "0"));
  return Number.isInteger(cents) && cents > 0 && cents <= MAX_CENTS ? cents : null;
}

export function brl(cents: number) {
  return currency.format(cents / 100);
}

export function moneyInput(cents: number) {
  return decimal.format(cents / 100);
}
