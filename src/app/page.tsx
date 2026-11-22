import { today } from "@/lib/calendar";
import { DashboardView } from "@/features/finance/dashboard-view";
import { selectedMonth, type Search } from "@/features/finance/filters";
import { categories, dashboard } from "@/features/finance/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Search> }) {
  const current = today();
  const month = selectedMonth(await searchParams, current);
  const [options, data] = await Promise.all([categories(), dashboard(month)]);
  return <DashboardView month={month} today={current} options={options} data={data} />;
}
