import React from "react";
import Card from "../components/ui/Card";
import { Shield, FileText, Lock, Users, Calendar, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Last updated: February 14, 2026
          </p>
        </div>

        <Card className="p-8 md:p-12 prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            MlimiConnect ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, USSD service (*1399#), and related services (collectively, the "Services").
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" size={28} /> 1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li><strong>Personal Information:</strong> Name, phone number, email, physical address, National ID/passport (for verification), farm location coordinates (with consent), profile photo, business registration documents.</li>
            <li><strong>Financial Information:</strong> Mobile money details (encrypted), wallet balance, transaction history (stored securely via escrow partners).</li>
            <li><strong>Usage & Device Data:</strong> IP address, browser type, device ID, app version, pages visited, time spent, crash logs.</li>
            <li><strong>Location Data:</strong> Approximate location (via IP or device) for weather/pest alerts, precise GPS (only with explicit consent for traceability).</li>
            <li><strong>Voice Data:</strong> Audio recordings from voice input (Chichewa recognition) are processed locally or deleted immediately after transcription.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Lock className="text-green-600" size={28} /> 2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>To provide, maintain, and improve the Services (marketplace, advisory, traceability, payments)</li>
            <li>To verify identity and prevent fraud (KYC for farmers/buyers)</li>
            <li>To process transactions and release escrow funds</li>
            <li>To send order updates, price alerts, weather notifications (SMS/push)</li>
            <li>To generate anonymized analytics and improve platform performance</li>
            <li>To comply with legal obligations in Malawi (Data Protection Act, financial regulations)</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Users className="text-purple-600" size={28} /> 3. Sharing Your Information
          </h2>
          <p className="mb-4">
            We do <strong>not</strong> sell your personal information. We may share data only in these limited cases:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>With verified buyers/farmers for order fulfillment (name, phone, delivery location)</li>
            <li>With payment processors (Airtel, TNM) for transaction processing</li>
            <li>With government authorities when required by law</li>
            <li>In anonymized form for research or impact reporting</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Calendar className="text-amber-600" size={28} /> 4. Data Retention & Security
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>We keep personal data only as long as necessary (account active + 7 years for financial records)</li>
            <li>Data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Access is strictly role-based (least privilege principle)</li>
            <li>Regular security audits and penetration testing</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Mail className="text-red-600" size={28} /> 5. Your Rights & Choices
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Correction:</strong> Update inaccurate information</li>
            <li><strong>Deletion:</strong> Request account deletion (subject to legal retention)</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing SMS/emails</li>
            <li><strong>Complaints:</strong> Contact the Malawi Communications Regulatory Authority (MACRA) if needed</li>
          </ul>

          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              Questions about privacy? Reach out to our Data Protection Officer:
            </p>
            <a
              href="mailto:privacy@mlimiconnect.mw"
              className="text-xl font-semibold text-green-600 dark:text-green-400 hover:underline"
            >
              privacy@mlimiconnect.mw
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}