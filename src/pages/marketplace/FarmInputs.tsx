import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, FlaskConical, Wrench, ShoppingCart, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { type CartProduct, useCart } from "../../context/CartContext";

const inputs: CartProduct[] = [
  { id: "seed-maize-hybrid", name: "Hybrid maize seed (5 kg)", price: 38500, category: "seed" },
  { id: "seed-groundnut", name: "Groundnut seed (10 kg)", price: 42000, category: "seed" },
  { id: "fertilizer-npk", name: "NPK fertiliser (50 kg)", price: 78500, category: "chemical" },
  { id: "crop-protection", name: "Crop protection pack", price: 24500, category: "chemical" },
  { id: "knapsack-sprayer", name: "Knapsack sprayer (16 L)", price: 68000, category: "tool" },
  { id: "hand-hoe", name: "Heavy-duty hand hoe", price: 14500, category: "tool" },
];

const icons = { seed: Sprout, seeds: Sprout, chemical: FlaskConical, tool: Wrench, tools: Wrench, "farm-inputs": FlaskConical, equipment: Wrench, machinery: Wrench, produce: ShoppingCart, other: ShoppingCart };

export default function FarmInputs() {
  const { addItem } = useCart();
  const [category, setCategory] = useState<"all" | CartProduct["category"]>("all");
  const [notice, setNotice] = useState<string | null>(null);
  const visibleInputs = category === "all" ? inputs : inputs.filter((item) => item.category === category);

  const addToCart = (item: CartProduct) => {
    addItem(item);
    setNotice(`${item.name} added to your cart.`);
  };

  return (
    <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[.15em] text-green-700">Marketplace</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Farm inputs</h1>
            <p className="mt-2 text-slate-500">Seeds, crop-care products, and tools from trusted suppliers.</p>
          </div>
          <Link to="/app/marketplace/cart"><Button variant="outline"><ShoppingCart size={18} className="mr-2" /> View cart</Button></Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter farm inputs">
          {(["all", "seed", "chemical", "tool"] as const).map((filter) => (
            <button key={filter} type="button" onClick={() => setCategory(filter)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${category === filter ? "bg-green-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"}`}>
              {filter === "all" ? "All inputs" : `${filter[0].toUpperCase()}${filter.slice(1)}s`}
            </button>
          ))}
        </div>

        {notice && <p role="status" className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-300">{notice}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleInputs.map((item) => {
            const Icon = icons[item.category];
            return <Card key={item.id} className="group p-0 overflow-hidden hover:-translate-y-1 hover:shadow-lg"><div className="flex h-36 items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/30 dark:to-gray-900"><Icon className="text-green-700" size={48} aria-hidden="true" /></div><div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">{item.category}</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{item.name}</h2>
              <p className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">MWK {item.price.toLocaleString()}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><ShieldCheck size={14} className="text-green-700" /> Trusted supplier</p>
              <Button className="mt-5 w-full" onClick={() => addToCart(item)}>Add to cart</Button></div>
            </Card>;
          })}
        </div>
    </div>
  );
}
