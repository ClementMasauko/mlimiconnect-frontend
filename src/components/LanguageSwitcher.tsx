import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith("ny") ? "ny" : "en";
  return <label className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-gray-300">
    <Languages size={17} aria-hidden="true" />
    {!compact && <span className="sr-only">{t("language")}</span>}
    <select aria-label={t("language")} value={language} onChange={event => void i18n.changeLanguage(event.target.value)} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold dark:border-gray-700 dark:bg-gray-900">
      <option value="en">EN</option><option value="ny">NY</option>
    </select>
  </label>;
}
