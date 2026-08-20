// src/pages/messages/Inbox.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import Button from "../../components/ui/Button";

// Mock messages
const mockMessages = [
  {
    id: 1,
    sender: "Mary Banda",
    text: "Interested in your tomatoes — can you deliver to Lilongwe? What time tomorrow?",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: 2,
    sender: "Peter Moyo",
    text: "Thanks for the maize. Payment sent via Airtel Money.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    sender: "Grace Nkhoma",
    text: "Do you have more soybeans? I need 100kg next week.",
    time: "2 days ago",
    unread: false,
  },
];

export default function Inbox() {
  const [messages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Simulate sending
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Chat with buyers and sellers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inbox list */}
          <Card className="lg:col-span-1 h-[70vh] overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${msg.unread ? "bg-green-50 dark:bg-green-950/20" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium truncate">{msg.sender}</p>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-2 flex flex-col h-[70vh]">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="font-semibold flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <span>Mary Banda</span>
              </h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Mock conversation */}
              <div className="flex justify-start">
                <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                  <p>Hello! I'm interested in your maize. Can you deliver to Lilongwe?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-green-600 text-white rounded-2xl rounded-tr-none px-4 py-3">
                  <p>Hi Mary! Yes, I can deliver. When do you need it?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                  <p>Tomorrow morning is good. What time works for you?</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-700">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border rounded-full focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <Button type="submit" className="rounded-full p-3">
                  <Send size={20} />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}