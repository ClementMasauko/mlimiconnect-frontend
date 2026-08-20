import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, Send } from "lucide-react";
import Button from "./Button";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();
  const links = [{ to: "/about", label: "About us" }, { to: "/app/marketplace", label: "Marketplace" }, { to: "/app/listings/new", label: "Sell on MlimiConnect" }, { to: "/pricing", label: "Pricing" }];
  return <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div className="space-y-4"><Link to="/" className="flex items-center gap-2"><span className="rounded-lg bg-green-700 p-2"><Leaf className="text-white" size={24} /></span><span className="text-xl font-bold text-white">Mlimi<span className="text-green-400">Connect</span></span></Link><p className="text-sm leading-relaxed text-slate-400">A trusted marketplace connecting Malawi's farmers, buyers and businesses.</p><Link to="/contact" className="text-sm font-semibold text-green-400 hover:text-green-300">Contact our team</Link></div>
      <div><h3 className="mb-4 font-semibold text-white">Explore</h3><ul className="space-y-3 text-sm">{links.map((link) => <li key={link.to}><Link className="text-slate-400 hover:text-green-400" to={link.to}>{link.label}</Link></li>)}</ul></div>
      <div><h3 className="mb-4 font-semibold text-white">Support</h3><div className="space-y-4 text-sm"><a href="mailto:support@mlimiconnect.mw" className="flex items-center gap-2 text-slate-400 hover:text-green-400"><Mail size={17} />support@mlimiconnect.mw</a><a href="tel:+265999123456" className="flex items-center gap-2 text-slate-400 hover:text-green-400"><Phone size={17} />+265 999 123 456</a><p className="text-slate-500">Mon-Sat, 7AM-6PM CAT</p></div></div>
      <div><h3 className="mb-2 font-semibold text-white">Market updates</h3><p className="mb-4 text-sm text-slate-400">Weekly prices, practical advice and platform news.</p><form className="space-y-3" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" required type="email" placeholder="Your email address" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500" /><Button type="submit" className="w-full"><Send size={16} className="mr-2" />Subscribe</Button></form><p className="mt-3 text-xs text-slate-500" role={subscribed ? "status" : undefined}>{subscribed ? "Thanks — you're on the update list." : "You can unsubscribe at any time."}</p></div>
    </div>
    <div className="border-t border-slate-800"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© {currentYear} MlimiConnect. All rights reserved.</p><div className="flex gap-5"><Link to="/privacy" className="hover:text-green-400">Privacy</Link><Link to="/terms" className="hover:text-green-400">Terms</Link><Link to="/disclaimer" className="hover:text-green-400">Disclaimer</Link></div></div></div>
  </footer>;
}
