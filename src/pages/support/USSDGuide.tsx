import React from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Smartphone, MessageSquare, Info, ArrowRight } from "lucide-react";

const ussdCodes = [
  { code: "*1399#", desc: "Main MlimiConnect menu (language → PIN → actions)" },
  { code: "*1399*1#", desc: "Quick market prices (follow prompts for crop)" },
  { code: "*1399*2#", desc: "Weather forecast (enter location)" },
  { code: "*1399*3#", desc: "Pest & disease quick tips (enter crop)" },
  { code: "*1399*4#", desc: "Check order status (after PIN)" },
  { code: "*1399*5#", desc: "My wallet balance (after PIN)" },
];

const smsCommands = [
  { cmd: "PRICE MAIZE", to: "1399", desc: "Current maize price in your area" },
  { cmd: "WEATHER LILONGWE", to: "1399", desc: "7-day forecast for Lilongwe" },
  { cmd: "PEST TOMATO", to: "1399", desc: "Common pests & organic control tips" },
  { cmd: "HELP", to: "1399", desc: "Full list of commands" },
  { cmd: "REGISTER", to: "1399", desc: "Start registration via SMS" },
];

export default function USSDGuide() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <Smartphone className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            USSD & SMS Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Access MlimiConnect without internet – perfect for rural areas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* USSD Codes */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Smartphone className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">USSD Codes</h2>
                <p className="text-gray-600 dark:text-gray-400">Dial *1399# from any phone</p>
              </div>
            </div>

            <div className="space-y-6">
              {ussdCodes.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="font-mono font-bold text-green-600 text-lg min-w-[70px]">
                    {item.code}
                  </div>
                  <div>
                    <p className="font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Info size={16} /> Tip: Save *1399# in your phone contacts for quick access
              </p>
            </div>
          </Card>

          {/* SMS Commands */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SMS Commands</h2>
                <p className="text-gray-600 dark:text-gray-400">Send to short code 1399</p>
              </div>
            </div>

            <div className="space-y-6">
              {smsCommands.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="font-mono font-bold text-blue-600 min-w-[140px]">
                    {item.cmd}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.desc}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Send to: {item.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="primary" className="w-full py-6 text-lg">
                Save Short Code to Contacts
              </Button>
            </div>
          </Card>
        </div>

        {/* How it works */}
        <Card className="mt-12 p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            How USSD & SMS Work on MlimiConnect
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Dial or Text</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use any basic phone – no data or app needed
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Follow Prompts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose language, enter PIN, select action
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Instant Info</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Prices, weather, advice – delivered via text
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}