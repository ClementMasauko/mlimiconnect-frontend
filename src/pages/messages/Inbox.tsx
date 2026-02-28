// src/pages/messages/Inbox.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { MessageCircle, Send, Users, Plus, Bell, Search, Hash, ChevronRight, Clock } from "lucide-react";

// Mock private conversations
const mockPrivateMessages = [
  {
    id: 1,
    sender: "Mary Banda",
    text: "Interested in your tomatoes — can you deliver to Lilongwe?",
    time: "10:42 AM",
    unread: 2,
    avatar: "MB",
  },
  {
    id: 2,
    sender: "Peter Moyo",
    text: "Payment sent via Airtel Money. Thanks!",
    time: "Yesterday",
    unread: 0,
    avatar: "PM",
  },
  {
    id: 3,
    sender: "Grace Nkhoma",
    text: "Do you have more soybeans? Need 100kg next week.",
    time: "2 days ago",
    unread: 0,
    avatar: "GN",
  },
];

// Mock community channels
const mockChannels = [
  {
    id: "channel-maize",
    name: "Maize Traders Malawi",
    members: 1240,
    lastMessage: "Current maize price in Lilongwe: MWK 42,500/bag",
    lastActive: "5 min ago",
    unread: 3,
  },
  {
    id: "channel-tomatoes",
    name: "Tomato Farmers Central",
    members: 780,
    lastMessage: "Anyone with transport to Blantyre tomorrow?",
    lastActive: "1 hour ago",
    unread: 0,
  },
  {
    id: "channel-advisory",
    name: "Pest & Weather Alerts",
    members: 3200,
    lastMessage: "Army worm alert in Mzimba district – preventive tips attached",
    lastActive: "30 min ago",
    unread: 1,
  },
  {
    id: "channel-buyers",
    name: "Buyers & Wholesalers Network",
    members: 450,
    lastMessage: "Looking for 200 bags of groundnuts – Blantyre",
    lastActive: "2 hours ago",
    unread: 0,
  },
];

export default function Inbox() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = mockChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageCircle className="text-emerald-600" size={36} />
              Messages & Communities
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Chat privately or join public channels to connect with farmers, buyers, and experts
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" className="flex items-center gap-2" asChild>
              <Link to="/app/messages/create-channel">
                <Plus size={20} /> Create Channel
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Send size={20} /> New Message
            </Button>
          </div>
        </div>

        {/* Community Channels Section */}
        <Card className="p-6 mb-10 shadow-lg border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users className="text-emerald-600" size={28} />
              Community Channels
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredChannels.map((channel) => (
              <Link
                key={channel.id}
                to={`/app/messages/${channel.id}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-xl hover:border-emerald-500 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Hash className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {channel.members.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    {channel.unread > 0 && (
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {channel.unread}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                    {channel.lastMessage}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock size={14} />
                    Active {channel.lastActive}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredChannels.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No channels match your search. Try creating one!
            </div>
          )}
        </Card>

        {/* Private Conversations */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <MessageCircle className="text-emerald-600" size={28} />
            Private Messages
          </h2>

          <div className="space-y-4">
            {mockPrivateMessages.map((msg) => (
              <Link
                key={msg.id}
                to={`/app/messages/${msg.id}`}
                className="block"
              >
                <div
                  className={`p-5 border rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-4 ${
                    msg.unread > 0
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-lg">
                    {msg.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {msg.sender}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {msg.text}
                    </p>
                  </div>

                  {msg.unread > 0 && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {msg.unread}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {mockPrivateMessages.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No private messages yet. Start a conversation from the marketplace or channels.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}