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
            MlimiConnect ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we plan to collect, use, disclose, and safeguard information when you use our website, mobile application, configured USSD channels, and related services (collectively, the "Services"). Features described here apply only when they are enabled and available.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" size={28} /> 1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li><strong>Personal Information:</strong> Name, phone number, email, physical address, National ID/passport (for verification), farm location coordinates (with consent), profile photo, business registration documents.</li>
            <li><strong>Financial Information:</strong> Payment references, wallet balances and transaction history when payment services are enabled. Licensed payment providers process payment credentials under their own terms.</li>
            <li><strong>Usage & Device Data:</strong> IP address, browser type, device ID, app version, pages visited, time spent, crash logs.</li>
            <li><strong>Location Data:</strong> Approximate location (via IP or device) for weather/pest alerts, precise GPS (only with explicit consent for traceability).</li>
            <li><strong>Voice Data:</strong> Audio recordings from voice input (Chichewa recognition) are processed locally or deleted immediately after transcription.</li>
            <li><strong>Crop photographs:</strong> When you explicitly consent to automated crop-health analysis, MlimiConnect removes embedded metadata and sends the prepared photograph to Kindwise Crop.health. MlimiConnect stores the resulting possibilities, confidence scores, consent record and a non-reversible image fingerprint, but does not retain the submitted photograph in diagnosis history.</li>
            <li><strong>Address searches:</strong> When you press Search in a pickup or delivery form, the place text is sent through the MlimiConnect backend to the OpenStreetMap Nominatim service. Do not enter names, phone numbers or confidential information. Confirmed labels and coordinates may be stored with the delivery.</li>
            <li><strong>Error diagnostics:</strong> When production error reporting is enabled, MlimiConnect sends privacy-filtered technical error details to Sentry. Request bodies, cookies, account identity, passwords, PINs, messages, email addresses, full phone numbers and URL query strings are removed or redacted before transmission.</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Lock className="text-green-600" size={28} /> 2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>To provide, maintain, and improve the Services (marketplace, advisory, traceability, payments)</li>
            <li>To verify identity and prevent fraud (KYC for farmers/buyers)</li>
            <li>To initiate and track transactions through approved payment providers when payment services are enabled</li>
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
            <li>With Kindwise Crop.health only when you explicitly request automated crop-health analysis and consent to the transfer. Kindwise acts as an external image-analysis provider and may temporarily retain provider-side identification data under its own privacy and retention terms.</li>
            <li>With the OpenStreetMap Foundation public Nominatim service when you explicitly submit a location search. Search results are cached to reduce repeated external requests and displayed with OpenStreetMap attribution.</li>
            <li>With Sentry when production error reporting is enabled, solely for application reliability and incident investigation. Session replay is not enabled and MlimiConnect configures both frontend and backend SDKs not to send default personally identifiable information.</li>
            <li>With government authorities when required by law</li>
            <li>In anonymized form for research or impact reporting</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Calendar className="text-amber-600" size={28} /> 4. Data Retention & Security
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>We retain personal data only as long as necessary for the stated purpose and applicable legal obligations</li>
            <li>Production services use encrypted network connections and provider-appropriate storage controls</li>
            <li>Access to production data is restricted according to operational roles</li>
            <li>Security controls are reviewed as the service moves through pilot and production readiness</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Mail className="text-red-600" size={28} /> 5. Your Rights & Choices
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Correction:</strong> Update inaccurate information</li>
            <li><strong>Deletion:</strong> Request account deletion (subject to legal retention)</li>
            <li><strong>Crop diagnosis deletion:</strong> Delete a diagnosis from its history. MlimiConnect immediately erases the local result and requests provider-side deletion; if Kindwise is temporarily unavailable, the record is marked for deletion retry.</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing SMS/emails</li>
            <li><strong>Complaints:</strong> Contact us first so that we can investigate, without limiting your right to approach the appropriate Malawi authority</li>
          </ul>

          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              Questions about privacy? Contact the MlimiConnect privacy team:
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
