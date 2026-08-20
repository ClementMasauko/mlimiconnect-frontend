import { useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowDownRight, ArrowUpRight, Building2, Download, Landmark, Percent, ReceiptText, ShieldCheck, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COMMISSION_RATE = 0.035;
const PAYMENT_COST_RATE = 0.012;

// These entries should be replaced by settled order records from the API. Keeping the
// calculation here makes the commission, costs and project-account balance auditable.
const settledOrders = [
  { id: "MC-2401", date: "2026-03-04", category: "Maize", amount: 3200000, status: "settled" },
  { id: "MC-2402", date: "2026-04-16", category: "Vegetables", amount: 4100000, status: "settled" },
  { id: "MC-2403", date: "2026-05-09", category: "Legumes", amount: 4800000, status: "settled" },
  { id: "MC-2404", date: "2026-06-21", category: "Maize", amount: 5600000, status: "settled" },
  { id: "MC-2405", date: "2026-07-13", category: "Vegetables", amount: 6700000, status: "settled" },
  { id: "MC-2406", date: "2026-08-05", category: "Other crops", amount: 7500000, status: "settled" },
];

const escrowHeld = 1280000;
const projectAccountOpeningBalance = 450000;
const money = (value: number) => `MWK ${Math.round(value).toLocaleString()}`;

export default function Revenue() {
  const [range, setRange] = useState("6");
  const [account, setAccount] = useState("MlimiConnect operating account • •••• 7284");

  const orders = useMemo(() => settledOrders.slice(-Number(range)), [range]);
  const summary = useMemo(() => {
    const gmv = orders.reduce((sum, order) => sum + order.amount, 0);
    const commission = gmv * COMMISSION_RATE;
    const paymentCosts = gmv * PAYMENT_COST_RATE;
    return { gmv, commission, paymentCosts, net: commission - paymentCosts, balance: projectAccountOpeningBalance + commission - paymentCosts };
  }, [orders]);

  const monthly = useMemo(() => orders.map((order) => ({
    month: new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${order.date}T00:00:00`)),
    gmv: order.amount,
    commission: Math.round(order.amount * COMMISSION_RATE),
    net: Math.round(order.amount * (COMMISSION_RATE - PAYMENT_COST_RATE)),
  })), [orders]);

  const categories = useMemo(() => Object.values(orders.reduce<Record<string, { category: string; gmv: number; commission: number }>>((result, order) => {
    const item = result[order.category] ?? { category: order.category, gmv: 0, commission: 0 };
    item.gmv += order.amount;
    item.commission += order.amount * COMMISSION_RATE;
    result[order.category] = item;
    return result;
  }, {})), [orders]);

  function exportReport() {
    const rows = ["Order,Date,Category,Settled GMV,Platform commission,Payment cost,Net project income", ...orders.map((order) => [order.id, order.date, order.category, order.amount, Math.round(order.amount * COMMISSION_RATE), Math.round(order.amount * PAYMENT_COST_RATE), Math.round(order.amount * (COMMISSION_RATE - PAYMENT_COST_RATE))].join(","))];
    const file = new Blob([rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "mlimiconnect-project-account-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white"><Landmark className="text-emerald-600" size={32} /> Project account & revenue</h1><p className="mt-2 text-gray-600 dark:text-gray-400">Only settled commissions become MlimiConnect income. Buyer funds and farmer payouts remain separate.</p></div>
        <div className="flex gap-3"><select aria-label="Reporting period" value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"><option value="3">Last 3 settlements</option><option value="6">Last 6 settlements</option></select><Button variant="outline" onClick={exportReport} className="flex items-center gap-2"><Download size={16} /> Export CSV</Button></div>
      </div>

      <Card className="mb-6 border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-300"><Building2 size={17} /> Project operating account</p><p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{account}</p><p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Balance available for approved operating expenses: {money(summary.balance)}</p></div><label className="text-sm font-medium text-gray-700 dark:text-gray-200">Receiving account<select value={account} onChange={(event) => setAccount(event.target.value)} className="mt-1 block w-full rounded-lg border bg-white px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800"><option>MlimiConnect operating account • •••• 7284</option><option>MlimiConnect reserve account • •••• 1059</option></select></label></div></Card>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Settled marketplace value" value={money(summary.gmv)} note="Not project revenue" icon={<ReceiptText className="text-blue-600" />} />
        <Metric label="Commission earned" value={money(summary.commission)} note="3.5% of settled orders" icon={<Percent className="text-emerald-600" />} />
        <Metric label="Provider costs" value={money(summary.paymentCosts)} note="1.2% mobile-money & processing" icon={<ArrowDownRight className="text-rose-600" />} />
        <Metric label="Net project income" value={money(summary.net)} note="Commission less provider costs" icon={<TrendingUp className="text-emerald-600" />} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2"><Card className="p-6"><h2 className="font-semibold text-gray-900 dark:text-white">Commission collected over time</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `${value / 1000}k`} /><Tooltip formatter={(value) => money(Number(value))} /><Line type="monotone" dataKey="commission" name="Commission" stroke="#059669" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Card><Card className="p-6"><h2 className="font-semibold text-gray-900 dark:text-white">Settled marketplace value</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `${value / 1000000}M`} /><Tooltip formatter={(value) => money(Number(value))} /><Bar dataKey="gmv" name="GMV" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5"><Card className="p-6 lg:col-span-3"><h2 className="font-semibold text-gray-900 dark:text-white">Income sources</h2><div className="mt-4 divide-y dark:divide-gray-800">{categories.map((category) => <div key={category.category} className="flex items-center justify-between py-4"><div><p className="font-medium">{category.category}</p><p className="text-sm text-gray-500">{money(category.gmv)} settled value</p></div><p className="font-semibold text-emerald-700 dark:text-emerald-400">+{money(category.commission)}</p></div>)}</div></Card><Card className="p-6 lg:col-span-2"><h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><ShieldCheck className="text-amber-600" /> Safeguards</h2><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-gray-500">Held in escrow</dt><dd className="mt-1 font-semibold">{money(escrowHeld)}</dd><p className="mt-1 text-gray-500">Excluded from project income until delivery is settled.</p></div><div><dt className="text-gray-500">Revenue recognition rule</dt><dd className="mt-1 font-semibold">Successful settled order only</dd></div><div><dt className="text-gray-500">Payout control</dt><dd className="mt-1 font-semibold">Reconcile provider settlement before transfer</dd></div></dl></Card></div>
    </div>
  </div>;
}

function Metric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return <Card className="p-5"><div className="flex items-start justify-between"><p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>{icon}</div><p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{value}</p><p className="mt-2 text-xs text-gray-500">{note}</p></Card>;
}
