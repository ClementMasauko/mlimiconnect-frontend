import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Database, RefreshCw, TrendingUp } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

type HistoricalPrice = {
  id: number; district: string; market: string; price_date: string; crop: string;
  currency: string; unit: string; closing_price: string | number; spatially_interpolated: boolean;
};
type HistoricalResponse = {
  results: HistoricalPrice[];
  pagination: { total: number };
  coverage: { crops: string[]; markets: number; earliest_date: string | null; latest_date: string | null };
  source: { name: string; dataset: string; version: string | null; url: string };
  methodology_notice: string; stale: boolean;
};

export default function MarketFeed() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<HistoricalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<HistoricalResponse>("/api/advisory/market-data/history/?page_size=50");
      setData(response.data);
    } catch (requestError) {
      setError(getApiError(requestError, t("marketLoadError")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = data?.results ?? [];

  return <div className="mx-auto max-w-6xl px-4 py-8">
    <Link to="/app/advisory" className="font-semibold text-green-700">← {t("marketBack")}</Link>
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="flex items-center gap-3 text-3xl font-black"><TrendingUp className="text-green-700" />{t("marketTitle")}</h1><p className="mt-2 text-slate-600 dark:text-slate-300">{t("marketDescription")}</p></div>
      <Button variant="outline" disabled={loading} onClick={() => void load()} aria-busy={loading}><RefreshCw size={17} className={`mr-2 ${loading ? "animate-spin" : ""}`} />{t("marketRefresh")}</Button>
    </div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_18rem]">
      <Card className="overflow-hidden p-0"><div className="border-b p-5 dark:border-slate-800"><h2 className="flex items-center gap-2 text-xl font-bold"><Database className="text-green-700" />{t("marketRecords")}</h2></div><div className="overflow-x-auto" aria-live="polite">{rows.length ? <table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 dark:bg-slate-900"><tr><th className="p-3">{t("marketDate")}</th><th className="p-3">{t("marketCrop")}</th><th className="p-3">{t("marketName")}</th><th className="p-3">{t("marketDistrict")}</th><th className="p-3 text-right">{t("marketClosingEstimate")}</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t dark:border-slate-800"><td className="p-3">{new Date(`${row.price_date}T00:00:00`).toLocaleDateString(i18n.language)}</td><td className="p-3 capitalize">{row.crop}</td><td className="p-3">{row.market}</td><td className="p-3">{row.district}</td><td className="p-3 text-right font-semibold">{row.currency} {Number(row.closing_price).toLocaleString(i18n.language)}{row.unit ? ` / ${row.unit}` : ""}</td></tr>)}</tbody></table> : <div className="p-10 text-center text-slate-500">{loading ? t("marketLoading") : t("marketEmpty")}</div>}</div></Card>
      <Card className="h-fit p-6"><h2 className="text-xl font-bold">{t("marketCoverage")}</h2>{data && <dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">{t("marketRecordCount")}</dt><dd className="font-bold">{data.pagination.total.toLocaleString(i18n.language)}</dd></div><div><dt className="text-slate-500">{t("marketMarkets")}</dt><dd className="font-bold">{data.coverage.markets.toLocaleString(i18n.language)}</dd></div><div><dt className="text-slate-500">{t("marketCrops")}</dt><dd className="font-semibold capitalize">{data.coverage.crops.join(", ") || "—"}</dd></div><div><dt className="text-slate-500">{t("marketPeriod")}</dt><dd>{data.coverage.earliest_date || "—"} – {data.coverage.latest_date || "—"}</dd></div><div><dt className="text-slate-500">{t("marketVersion")}</dt><dd>{data.source.version || t("marketNotImported")}</dd></div></dl>}{data?.source.url && <a className="mt-5 inline-block font-semibold text-green-700 underline" href={data.source.url} target="_blank" rel="noreferrer">{t("marketViewSource")}</a>}</Card>
    </div>
    <Card className="mt-6 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>{t(data?.stale ? "marketHistorical" : "marketMethodology")} </strong>{data?.methodology_notice || t("marketFallbackNotice")}</Card>
  </div>;
}
