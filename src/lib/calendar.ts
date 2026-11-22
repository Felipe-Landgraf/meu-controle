export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const calendarFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
});

export function today(now = new Date()) {
  const parts = calendarFormatter.formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return [part("year"), part("month"), part("day")].join("-");
}

export function calendarDate(value: string) {
  return new Date(value + "T00:00:00.000Z");
}

export function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function validDate(value: string) {
  if (!/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = calendarDate(value);
  return Number.isFinite(parsed.getTime()) && dateKey(parsed) === value;
}

export function validMonth(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(value);
}

export function shiftMonth(month: string, offset: number) {
  const date = calendarDate(month + "-01");
  date.setUTCMonth(date.getUTCMonth() + offset);
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  return year + "-" + String(date.getUTCMonth() + 1).padStart(2, "0");
}

export function monthRange(month: string) {
  const gte = calendarDate(month + "-01");
  const lt = new Date(gte);
  lt.setUTCMonth(lt.getUTCMonth() + 1);
  return { gte, lt };
}

export function monthLabel(month: string) {
  return MONTH_NAMES[Number(month.slice(5)) - 1] + " de " + month.slice(0, 4);
}

export function displayDate(date: string) {
  return date.split("-").reverse().join("/");
}
