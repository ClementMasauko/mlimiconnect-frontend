import React from "react";
import Card from "../components/ui/Card";
import { Scale, Shield, FileText, Users, Calendar } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Scale className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Last updated: February 14, 2026
          </p>
        </div>

        <Card className="p-8 md:p-12">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <Shield className="text-green-600" size={28} /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using MlimiConnect (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these terms, you may not use our service.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <Users className="text-blue-600" size={28} /> 2. User Accounts & Verification
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>All users must register with accurate information.</li>
              <li>Farmers and buyers may undergo verification (ID, farm photos, business docs).</li>
              <li>Verified status grants higher trust and access to escrow, bulk orders, etc.</li>
              <li>You are responsible for maintaining the confidentiality of your PIN and account.</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <FileText className="text-purple-600" size={28} /> 3. Platform Services & Fees
            </h2>
            <p>
              MlimiConnect provides a marketplace, advisory tools, traceability, and escrow payment system. We charge a commission of 3.5% on successful transactions (subject to change with 30 days' notice).
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <Calendar className="text-amber-600" size={28} /> 4. Dispute Resolution & Escrow
            </h2>
            <p>
              Buyers have 24 hours after delivery confirmation to file a dispute. Disputes are reviewed by our moderation team. Escrow funds are released only after mutual agreement or admin decision.
            </p>

            <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
                By using MlimiConnect, you confirm that you are at least 18 years old and have the legal capacity to enter into these terms.
              </p>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Questions? Contact us at <a href="mailto:support@mlimiconnect.mw" className="text-green-600 hover:underline">support@mlimiconnect.mw</a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}