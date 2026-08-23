import { Link } from "react-router-dom";
import { ArrowRight, Minus, PackageOpen, Plus, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (!items.length) return (
    <div className="mx-auto max-w-3xl py-16 text-center">
      <Card className="p-12">
        <PackageOpen className="mx-auto text-green-700" size={46} />
        <h1 className="mt-5 text-2xl font-extrabold">{t("cartEmpty")}</h1>
        <p className="mt-2 text-slate-500">{t("cartEmptyHelp")}</p>
        <Link to="/app/marketplace"><Button className="mt-7">{t("browseMarketplace")} <ArrowRight className="ml-2" size={17} /></Button></Link>
      </Card>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.15em] text-green-700">{t("yourOrder")}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight dark:text-white">{t("shoppingCart")}</h1></div>
      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">{items.map(item => (
          <Card key={item.product.id} className="flex gap-4 p-4 sm:items-center">
            <img src={item.product.image} alt="" className="hidden h-20 w-24 rounded-lg object-cover sm:block" />
            <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wide text-green-700">{item.product.category}</p><h2 className="mt-1 truncate font-bold text-slate-900 dark:text-white">{item.product.name}</h2><p className="mt-1 text-sm text-slate-500">MWK {item.product.price.toLocaleString()} {t("each")}</p></div>
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-gray-700"><button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2.5 hover:bg-slate-100 dark:hover:bg-gray-800" aria-label={t("decreaseQuantity")}><Minus size={16} /></button><span className="w-7 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2.5 hover:bg-slate-100 dark:hover:bg-gray-800" aria-label={t("increaseQuantity")}><Plus size={16} /></button></div>
            <div className="text-right"><p className="font-extrabold text-slate-900 dark:text-white">MWK {(item.product.price * item.quantity).toLocaleString()}</p><button onClick={() => removeItem(item.product.id)} className="mt-2 text-xs font-semibold text-red-600 hover:underline">{t("remove")}</button></div>
          </Card>
        ))}</div>
        <Card className="h-fit p-6">
          <h2 className="text-xl font-extrabold">{t("orderSummary")}</h2>
          <div className="mt-5 space-y-3 border-b border-slate-200 pb-5 text-sm dark:border-gray-800"><div className="flex justify-between"><span>{t("itemsCount", { count: items.length })}</span><span>MWK {subtotal.toLocaleString()}</span></div><div className="flex justify-between text-slate-500"><span>{t("delivery")}</span><span>{t("calculatedCheckout")}</span></div></div>
          <div className="mt-5 flex justify-between text-lg font-extrabold"><span>{t("subtotal")}</span><span>MWK {subtotal.toLocaleString()}</span></div>
          <Link to="/app/marketplace/checkout" className="mt-6 block"><Button className="w-full" size="lg">{t("proceedCheckout")}</Button></Link>
          <p className="mt-4 flex gap-2 text-xs text-slate-500"><ShieldCheck size={16} className="shrink-0 text-green-700" /> {t("securePaymentNote")}</p>
        </Card>
      </div>
    </div>
  );
}
