import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Send, Paperclip, Smile, ArrowLeft } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const mockChatPartner = {
  name: "Shoprite Lilongwe",
  avatar: "S",
  status: "Active now",
};

const mockMessages = [
  { id: 1, sender: "buyer", text: "Hello, do you still have 50kg of maize available?", time: "10:32 AM" },
  { id: 2, sender: "farmer", text: "Yes, fresh from yesterday's harvest. Price is MWK 18,000", time: "10:35 AM" },
  { id: 3, sender: "buyer", text: "Can you do MWK 17,000? I need it delivered tomorrow.", time: "10:37 AM" },
  { id: 4, sender: "farmer", text: "Best I can do is MWK 17,500. Delivery to Lilongwe possible for extra MWK 1,500.", time: "10:40 AM" },
  { id: 5, sender: "buyer", text: "Deal. I'll place the order now.", time: "10:42 AM" },
];

export default function ChatConversation() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "farmer", text: input, time: "Now" },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 dark:bg-green-700 text-white px-4 py-3 sm:py-4 flex items-center gap-3 shadow-md">
        <Link to="/app/messages" className="text-white hover:opacity-80">
          <ArrowLeft size={24} />
        </Link>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-green-600 text-xl">
          {mockChatPartner.avatar}
        </div>
        <div>
          <h2 className="font-semibold text-lg">{mockChatPartner.name}</h2>
          <p className="text-xs opacity-90">{mockChatPartner.status}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "farmer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl ${
                msg.sender === "farmer"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-800 shadow-sm rounded-bl-none border border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className="text-base">{msg.text}</p>
              <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button className="text-gray-500 dark:text-gray-400 hover:text-green-600 p-2">
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="text-gray-500 dark:text-gray-400 hover:text-green-600 p-2">
            <Smile size={24} />
          </button>
          <Button
            variant="primary"
            size="icon"
            className="rounded-full h-11 w-11"
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}