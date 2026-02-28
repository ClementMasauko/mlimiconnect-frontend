// src/pages/CookiePolicy.tsx
import React from "react";
import Card from "../components/ui/Card";
import { Cookie, Shield, Clock, Settings, Info } from "lucide-react";
import Button from "../components/ui/Button";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Cookie className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Cookie Policy & Data Protection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Last updated: February 14, 2026
          </p>
        </div>

        <Card className="p-8 md:p-12 prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-10">
            MlimiConnect uses cookies and similar technologies to enhance your experience, improve security, and provide personalized services. This Cookie Policy explains what cookies we use, why, and how you can manage them. It also includes our Data Protection commitments under Malawi's Data Protection Act and international best practices.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Info className="text-blue-600" size={28} /> 1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files placed on your device when you visit our website or app. They help us recognize you, remember preferences, and provide better functionality. We use both session cookies (deleted when you close your browser) and persistent cookies (remain until expiry or deletion).
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Shield className="text-green-600" size={28} /> 2. Cookies We Use
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Purpose</th>
                  <th className="px-6 py-4 text-left font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left font-semibold">Opt-out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4">Essential Cookies</td>
                  <td className="px-6 py-4">Authentication, security, basic navigation</td>
                  <td className="px-6 py-4">Session or 1 year</td>
                  <td className="px-6 py-4">Cannot be disabled (required for service)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Performance Cookies</td>
                  <td className="px-6 py-4">Analytics (page views, load times) – anonymized</td>
                  <td className="px-6 py-4">Up to 2 years</td>
                  <td className="px-6 py-4">Browser settings or "Do Not Track"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Functional Cookies</td>
                  <td className="px-6 py-4">Language preference, dark mode, saved filters</td>
                  <td className="px-6 py-4">1 year</td>
                  <td className="px-6 py-4">Clear browser cookies</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Advertising Cookies</td>
                  <td className="px-6 py-4">Not currently used</td>
                  <td className="px-6 py-4">—</td>
                  <td className="px-6 py-4">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Clock className="text-amber-600" size={28} /> 3. Data Protection Addendum (Malawi Compliance)
          </h2>
          <ul className="list-disc pl-6 space-y-4 mb-8">
            <li>We collect only necessary personal data (phone, email, farm location with consent) under the Data Protection Act.</li>
            <li>Data is stored securely in encrypted servers (AES-256) and transmitted via TLS 1.3.</li>
            <li>You have the right to access, correct, delete, or restrict processing of your data.</li>
            <li>Cookies do not collect personally identifiable information unless you explicitly provide it (e.g. login).</li>
            <li>Third-party analytics (if enabled) are anonymized and comply with GDPR-equivalent standards.</li>
            <li>No data is sold or shared for marketing without consent.</li>
            <li>For questions or data rights requests: <a href="mailto:privacy@mlimiconnect.mw" className="text-green-600 hover:underline">privacy@mlimiconnect.mw</a></li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
            <Settings className="text-purple-600" size={28} /> 4. Managing Cookies
          </h2>
          <p className="mb-6">
            You can control cookies via your browser settings:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li>Block all cookies (may break login, cart, preferences)</li>
            <li>Block third-party cookies only</li>
            <li>Clear cookies on exit</li>
            <li>Use "Do Not Track" header</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Note: Essential cookies cannot be disabled without affecting core functionality.
          </p>

          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              Need more information about privacy or cookies?
            </p>
            <Button variant="primary" size="lg" asChild>
              <a href="mailto:privacy@mlimiconnect.mw">Contact Privacy Team</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}