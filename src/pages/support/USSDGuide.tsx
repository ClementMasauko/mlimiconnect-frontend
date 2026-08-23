import { Info, LockKeyhole, Radio, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";

export default function USSDGuide() {
  const { t } = useTranslation();
  const steps = [
    [t("dialCode"), t("dialCodeHelp")],
    [t("chooseLanguage"), t("chooseLanguageHelp")],
    [t("enterPin"), t("enterPinHelp")],
    [t("chooseService"), t("chooseServiceHelp")],
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"><Smartphone className="h-10 w-10 text-green-600" /></div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">{t("ussdGuide")}</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">{t("ussdOffline")}</p>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"><Radio className="text-green-600" /></div><div><h2 className="text-2xl font-bold">{t("dialMainCode")}</h2><p className="text-gray-600 dark:text-gray-400">{t("dialFromPhone")}</p></div></div>
          <div className="mt-7 rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-800/50"><div className="font-mono text-4xl font-black text-green-700">*1399#</div><p className="mt-3 text-gray-600 dark:text-gray-300">{t("ussdCodeDescription")}</p></div>
          <p className="mt-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"><Info size={17} className="shrink-0" /> {t("ussdSaveTip")}</p>
        </Card>

        <Card className="mt-10 p-8"><h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">{t("ussdSteps")}</h2><div className="grid gap-6 md:grid-cols-2">{steps.map(([title, help], index) => <div key={title} className="flex gap-4 rounded-xl border border-gray-100 p-5 dark:border-gray-800"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-100 font-bold text-green-700 dark:bg-green-900/30">{index + 1}</div><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{help}</p></div></div>)}</div></Card>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-bold"><Info className="text-blue-600" /> {t("ussdAvailability")}</h2><p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{t("ussdAvailabilityHelp")}</p></Card>
          <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-bold"><LockKeyhole className="text-green-600" /> {t("ussdSafety")}</h2><p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{t("ussdSafetyHelp")}</p></Card>
        </div>
      </div>
    </div>
  );
}
