import { Link } from "react-router-dom";
import Card from "../components/ui/Card";

const articles = [
  { title: "Preparing your produce for marketplace buyers", category: "Selling guide", summary: "A practical checklist for creating clear listings, setting quantities, and building buyer confidence." },
  { title: "How to use market information when selling", category: "Market insights", summary: "Compare local demand, timing, and handling costs before deciding when and where to sell." },
  { title: "Getting started with MlimiConnect", category: "Platform guide", summary: "Learn the first steps for farmers and buyers joining the platform." },
];

export default function Blog() {
  return <main className="min-h-screen bg-gray-50 px-4 py-14 dark:bg-gray-950 sm:px-6"><div className="mx-auto max-w-5xl"><div className="max-w-2xl"><p className="font-semibold text-green-700 dark:text-green-400">MlimiConnect journal</p><h1 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">Practical ideas for better farm trade</h1><p className="mt-4 text-gray-600 dark:text-gray-300">Guides and market insights for Malawi’s farmers, buyers, and partners.</p></div><div className="mt-10 grid gap-6 md:grid-cols-3">{articles.map((article) => <Card key={article.title} className="p-6"><p className="text-sm font-semibold text-green-700 dark:text-green-400">{article.category}</p><h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{article.title}</h2><p className="mt-3 text-gray-600 dark:text-gray-300">{article.summary}</p><Link to="/register" className="mt-5 inline-block font-medium text-green-700 hover:underline dark:text-green-400">Join to explore the platform →</Link></Card>)}</div></div></main>;
}
