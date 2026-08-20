import { Link, useParams } from "react-router-dom";
import Card from "../../components/ui/Card";

const advisoryContent: Record<string, { title: string; guidance: string[] }> = {
  crop: {
    title: "Crop advisory",
    guidance: ["Prepare land only after assessing soil moisture and drainage.", "Use locally recommended seed varieties and follow extension guidance for spacing.", "Monitor crop development weekly and record any signs of stress."],
  },
  pest: {
    title: "Pest alert",
    guidance: ["Inspect affected plants and nearby rows early in the morning.", "Confirm the pest before applying treatment and follow product-label instructions.", "Contact a local extension officer if damage is spreading quickly."],
  },
  weather: {
    title: "Weather advisory",
    guidance: ["Secure drainage channels and protect stored inputs before heavy rain.", "Avoid spraying when rain or strong wind is expected.", "Use the weather tool for the latest forecast before planning field work."],
  },
  market: {
    title: "Market price advisory",
    guidance: ["Compare current offers with transport and handling costs.", "Confirm quality requirements and payment terms before committing stock.", "Use recent market data as an indicator, not a guaranteed future price."],
  },
};

export default function AdvisoryDetail() {
  const { type, id } = useParams();
  const content = advisoryContent[type ?? ""] ?? {
    title: "Advisory details",
    guidance: ["Review the information below and consult a local specialist when needed."],
  };

  return (
    <div className="mx-auto max-w-3xl py-4">
      <Link to="/app/advisory" className="text-sm font-medium text-green-700 hover:underline dark:text-green-400">
        ← Back to advisory
      </Link>
      <Card className="mt-5 p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700 dark:text-green-400">Advisory #{id}</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{content.title}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Practical next steps for this advisory.</p>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-gray-700 dark:text-gray-200">
          {content.guidance.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </Card>
    </div>
  );
}
