import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api, { getApiError } from "../../lib/api";
import type { MarketResponse, RawMarketResponse } from "../../lib/apiTypes";
import { normalizeMarketResponse } from "../../lib/market";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function MarketFeed() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<RawMarketResponse>("/api/advisory/market-data/");
      setData(normalizeMarketResponse(response.data));
    } catch (requestError) {
      setError(getApiError(requestError, t("marketLoadError")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = data?.markets ?? [];

  return <div className="mx-auto max-w-6xl px-4 py-8">
    <Link to="/app/advisory" className="font-semibold text-green-700">← {t("marketBack")}</Link>
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="flex items-center gap-3 text-3xl font-black"><TrendingUp className="text-green-700" />{t("marketTitle")}</h1><p className="mt-2 text-slate-600 dark:text-slate-300">{t("marketDescription")}</p></div>
      <Button variant="outline" disabled={loading} onClick={() => void load()} aria-busy={loading}><RefreshCw size={17} className={`mr-2 ${loading ? "animate-spin" : ""}`} />{t("marketRefresh")}</Button>
    </div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mt-7 grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2"><h2 className="flex items-center gap-2 text-xl font-bold"><BarChart3 className="text-green-700" />{t("marketChartTitle")}</h2><div className="mt-5 h-80" aria-live="polite">{rows.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={rows}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="category" /><YAxis tickFormatter={value => `${Math.round(Number(value) / 1000)}k`} /><Tooltip formatter={value => [`MWK ${Number(value).toLocaleString()}`, t("marketAveragePrice")]} /><Bar dataKey="average_price" fill="#15803d" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-slate-500">{loading ? t("marketLoading") : t("marketEmpty")}</div>}</div></Card>
      <Card className="h-fit p-6"><h2 className="text-xl font-bold">{t("marketCoverage")}</h2><dl className="mt-4 space-y-4">{rows.map(row => <div key={row.category} className="border-b pb-3 last:border-0 dark:border-slate-800"><dt className="font-semibold capitalize">{row.category}</dt><dd className="mt-1 text-sm text-slate-500">{row.listings} {t(row.listings === 1 ? "marketActiveListing" : "marketActiveListings")} · MWK {row.average_price.toLocaleString()} {t("marketAverage")}</dd></div>)}</dl>{data?.updated_at && <p className="mt-5 text-xs text-slate-500">{t("marketUpdated", { date: new Date(data.updated_at).toLocaleString(i18n.language) })}</p>}</Card>
    </div>
    <Card className="mt-6 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>{t("marketCautionTitle")}</strong> {t("marketCaution")}</Card>
  </div>;
}
