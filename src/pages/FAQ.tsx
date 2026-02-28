import React from "react";
import Card from "../components/ui/Card";
import { HelpCircle, ChevronDown, Link } from "lucide-react";
import Button from "../components/ui/Button";

const faqItems = [
  {
    question: "How do I register as a farmer or buyer?",
    answer:
      "Click 'Sign Up' on the homepage. Choose your role (Farmer or Buyer), enter your phone/email, create a 4-digit PIN, and complete verification (ID/farm photos for farmers, business docs for buyers). Approval usually takes 2–5 days.",
  },
  {
    question: "How do I pay for products?",
    answer:
      "We support secure escrow payments via Airtel Money, TNM Mpamba, or bank transfer. Funds are held until delivery is confirmed. No cash-on-delivery for new users.",
  },
  {
    question: "What happens if there's a problem with my order?",
    answer:
      "You have 24 hours after delivery confirmation to file a dispute. Go to My Orders → select order → 'File Dispute'. Our team reviews evidence and releases/refunds escrow accordingly.",
  },
  {
    question: "Can I sell or buy without internet?",
    answer:
      "Yes – dial *1399# on any phone for prices, weather, pest tips, order status, and wallet balance. Full app features require internet, but USSD/SMS covers most rural use cases.",
  },
  {
    question: "How do I change language to Chichewa?",
    answer:
      "Go to Profile → Settings → Language. Select Chichewa (or Chitumbuka). The app switches instantly, including voice recognition and USSD prompts.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes – we use encryption, secure escrow wallets, and comply with Malawi data protection laws. PINs are hashed, and 2FA is available for extra security.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <HelpCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Quick answers to the most common questions
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white pr-8">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`h-6 w-6 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Didn't find what you're looking for?
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link to="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}