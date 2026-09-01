import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CloudRain, Droplets, Gauge, RefreshCw, Sprout, Thermometer, Wind } from "lucide-react";
import Card from "../../components/ui/Card";
import api, { getApiError } from "../../lib/api";

type ForecastDay = { date: string; condition: string; weather_code: number | null; temperature_max_c: number | null; temperature_min_c: number | null; rain_probability_percent: number | null; precipitation_mm: number | null; et0_mm: number | null };
type WeatherResponse = {
  location: string;
  current: { condition: string; temperature_c: number | null; humidity_percent: number | null; precipitation_mm: number | null; wind_speed_kmh: number | null; soil_temperature_c: number | null; soil_moisture: number | null };
  forecast: ForecastDay[]; source: string; source_url: string; collected_at: string; stale: boolean; cached: boolean; disclaimer: string;
};

const districts = ["Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga", "Kasungu", "Likoma", "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje", "Mwanza", "Mzimba", "Mzuzu", "Neno", "Nkhata Bay", "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe", "Rumphi", "Salima", "Thyolo", "Zomba"];
const display = (amount: number | null, suffix: string) => amount === null ? "Not available" : `${amount}${suffix}`;

function planningNotes(weather: WeatherResponse) {
  const notes: string[] = [];
  const rain = Math.max(...weather.forecast.map(day => day.rain_probability_percent ?? 0));
  const et0 = Math.max(...weather.forecast.map(day => day.et0_mm ?? 0));
  if (rain >= 70) notes.push("Heavy rain is possible this week. Clear drainage and protect harvested produce.");
  else if (rain >= 40) notes.push("Showers are possible. Check the daily forecast before spraying or harvesting.");
  else notes.push("Rain chances are limited. Check soil moisture before planning irrigation.");
  if ((weather.current.wind_speed_kmh ?? 0) >= 25) notes.push("Current wind may cause spray drift. Delay pesticide application until winds ease.");
  if ((weather.current.humidity_percent ?? 0) >= 80) notes.push("High humidity can favour fungal disease. Inspect crops and improve airflow where practical.");
  if (et0 >= 5) notes.push("High estimated water loss is forecast. Monitor young and shallow-rooted crops closely.");
  return notes;
}

export default function WeatherAdvisory() {
  const [district, setDistrict] = useState("Lilongwe");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const notes = useMemo(() => weather ? planningNotes(weather) : [], [weather]);

  const loadWeather = async (selectedDistrict: string) => {
    setLoading(true); setError("");
    try { setWeather((await api.get<WeatherResponse>("/api/advisory/weather/", { params: { district: selectedDistrict } })).data); }
    catch (requestError) { setError(getApiError(requestError, "Weather information is temporarily unavailable.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadWeather("Lilongwe"); }, []);

  return <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <Link to="/app/advisory" className="mb-4 inline-flex font-medium text-green-700 hover:underline dark:text-green-400">&larr; Back to Advisory</Link>
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">Live forecast with source attribution</p><h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white"><CloudRain className="text-blue-600" /> Weather and farm planning</h1><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Current conditions and a seven-day forecast for Malawi districts, presented with practical planning indicators.</p></div>
      <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void loadWeather(district); }}><label className="sr-only" htmlFor="weather-district">Select district</label><select id="weather-district" value={district} onChange={(event) => setDistrict(event.target.value)} className="min-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">{districts.map(name => <option key={name}>{name}</option>)}</select><button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Update</button></form>
    </header>
    {error && <div role="alert" className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:bg-red-950/30 dark:text-red-200">{error}</div>}
    {loading && !weather && <p role="status" className="py-16 text-center">Loading live weather...</p>}
    {weather && <>
      {weather.stale && <div role="status" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><AlertTriangle className="mr-2 inline" size={18} />Open-Meteo is temporarily unavailable. This is the most recent cached forecast.</div>}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-0"><div className="bg-gradient-to-br from-blue-700 to-cyan-600 p-6 text-white"><p className="text-sm font-medium text-blue-100">Current conditions</p><h2 className="mt-1 text-2xl font-bold">{weather.location}</h2><div className="mt-6 flex items-center gap-4"><Thermometer size={46} /><div><p className="text-4xl font-black">{display(weather.current.temperature_c, " C")}</p><p className="text-blue-100">{weather.current.condition}</p></div></div></div><dl className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700"><Metric icon={<Droplets />} label="Humidity" value={display(weather.current.humidity_percent, "%")} /><Metric icon={<Wind />} label="Wind" value={display(weather.current.wind_speed_kmh, " km/h")} /><Metric icon={<CloudRain />} label="Rain now" value={display(weather.current.precipitation_mm, " mm")} /><Metric icon={<Sprout />} label="Soil temperature" value={display(weather.current.soil_temperature_c, " C")} /></dl></Card>
        <Card className="p-6 lg:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-2xl font-bold">Seven-day outlook</h2><p className="text-sm text-slate-500">Daily high/low, expected rain and estimated crop-water loss</p></div>{loading && <RefreshCw className="animate-spin text-green-700" />}</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{weather.forecast.map(day => <article key={day.date} className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800"><p className="font-bold">{new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(`${day.date}T12:00:00`))}</p><p className="text-xs text-slate-500">{new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(new Date(`${day.date}T12:00:00`))}</p><CloudRain className="mx-auto my-3 text-blue-600" /><p className="font-bold">{display(day.temperature_max_c, " C")}</p><p className="text-xs text-slate-500">Low {display(day.temperature_min_c, " C")}</p><p className="mt-3 text-xs font-medium text-blue-700 dark:text-blue-300">Rain {display(day.rain_probability_percent, "%")}</p><p className="text-xs text-slate-500">{display(day.precipitation_mm, " mm")}</p><p className="mt-2 line-clamp-2 text-xs">{day.condition}</p></article>)}</div></Card>
      </section>
      <section className="mt-6 grid gap-6 md:grid-cols-2"><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Sprout className="text-green-700" />Farm planning notes</h2><ul className="mt-4 space-y-3">{notes.map(note => <li key={note} className="flex gap-3 rounded-lg bg-green-50 p-3 text-sm text-green-950 dark:bg-green-950/30 dark:text-green-100"><span aria-hidden="true">&#8226;</span><span>{note}</span></li>)}</ul></Card><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Gauge className="text-blue-700" />How to read this forecast</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-semibold">Rain chance</dt><dd className="text-slate-600 dark:text-slate-400">Likelihood of measurable rain at the selected district centre.</dd></div><div><dt className="font-semibold">Rainfall (mm)</dt><dd className="text-slate-600 dark:text-slate-400">Estimated total depth of rain for that day.</dd></div><div><dt className="font-semibold">ET0</dt><dd className="text-slate-600 dark:text-slate-400">Estimated reference crop water loss; higher values can indicate greater irrigation demand.</dd></div></dl></Card></section>
      <footer className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"><p>{weather.disclaimer}</p><p className="mt-2">Source: <a className="font-semibold text-green-700 underline dark:text-green-400" href={weather.source_url} target="_blank" rel="noreferrer">{weather.source}</a> | Updated {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(weather.collected_at))}{weather.cached ? " | Cached response" : " | Live response"}</p></footer>
    </>}
  </div></main>;
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="bg-white p-4 text-center dark:bg-slate-900"><span className="mx-auto mb-2 block w-fit text-blue-600">{icon}</span><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>;
}
