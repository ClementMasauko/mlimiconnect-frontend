import { Link } from "react-router-dom";
import Card from "../components/ui/Card";

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6">
      <Card className="mx-auto max-w-3xl p-7 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disclaimer</h1>
        <div className="mt-6 space-y-4 leading-7 text-gray-600 dark:text-gray-300">
          <p>
            MlimiConnect provides marketplace information, agricultural guidance, and digital tools to help users make informed decisions.
            This information is provided for general guidance and is not a guarantee of crop performance, market prices, availability, or income.
          </p>
          <p>
            Users should assess their own circumstances and seek qualified local advice before making farming, financial, or commercial decisions.
            Listings and information supplied by third parties remain the responsibility of their respective providers.
          </p>
          <p>
            We work to keep information current, but do not warrant that all content is complete, accurate, or continuously available.
          </p>
        </div>
        <Link to="/" className="mt-8 inline-block font-medium text-green-700 hover:underline dark:text-green-400">
          Return home
        </Link>
      </Card>
    </main>
  );
}
