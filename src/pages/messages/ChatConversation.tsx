// src/pages/messages/ChatConversation.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Send, Paperclip, Smile, ArrowLeft, MoreVertical, Check, CheckCheck, Users } from "lucide-react";
import Button from "../../components/ui/Button";

const mockChatPartner = {
  name: "Mary Banda",
  avatar: "MB",
  status: "Active now",
};

const mockMessages = [
  { id: 1, sender: "partner", senderName: "Mary", text: "Hello! Do you still have 50kg of maize available?", time: "10:32 AM", read: true },
  { id: 2, sender: "me", text: "Yes, fresh from yesterday's harvest. Price is MWK 18,000", time: "10:35 AM", read: true },
  { id: 3, sender: "partner", senderName: "Mary", text: "Can you do MWK 17,000? I need it delivered tomorrow.", time: "10:37 AM", read: true },
  { id: 4, sender: "me", text: "Best I can do is MWK 17,500. Delivery to Lilongwe possible for extra MWK 1,500.", time: "10:40 AM", read: true },
  { id: 5, sender: "partner", senderName: "Mary", text: "Deal. I'll place the order now.", time: "10:42 AM", read: false },
  { id: 6, sender: "me", text: "Perfect! Sending you the order link now.", time: "10:43 AM", read: false },
];

export default function ChatConversation() {
  const { chatId } = useParams();
  const isChannel = chatId?.startsWith("channel-");
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: input.trim(),
      time: "Now",
      read: false,
    };

    setMessages([...messages, newMsg]);
    setInput("");

    // Simulate typing & reply (mock)
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className={`px-4 py-3 sm:py-4 flex items-center justify-between shadow-md ${
        isChannel ? "bg-indigo-600 dark:bg-indigo-700" : "bg-emerald-600 dark:bg-emerald-700"
      } text-white`}>
        <div className="flex items-center gap-3">
          <Link to="/app/messages" className="text-white hover:opacity-80">
            <ArrowLeft size={24} />
          </Link>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-xl"
            style={{ color: isChannel ? "#4f46e5" : "#10b981" }}>
            {mockChatPartner.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{mockChatPartner.name}</h2>
            <p className="text-xs opacity-90 flex items-center gap-1">
              {isChannel ? (
                <>
                  <Users size={14} /> Community Channel • 1,240 members
                </>
              ) : (
                mockChatPartner.status
              )}
            </p>
          </div>
        </div>

        {isChannel && (
          <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
            <Users size={20} />
          </Button>
        )}
        <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2">
          <MoreVertical size={24} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl shadow-sm ${
                msg.sender === "me"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : isChannel
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-gray-900 dark:text-white rounded-bl-none border border-indigo-200 dark:border-indigo-800"
                  : "bg-white dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700"
              }`}
            >
              {isChannel && msg.sender !== "me" && (
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                  {msg.sender} {/* Show sender name in channels */}
                </p>
              )}
              <p className="text-base leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <p className="text-xs opacity-70">{msg.time}</p>
                {msg.sender === "me" && (
                  <div className="text-xs opacity-80">
                    {msg.read ? <CheckCheck size={14} /> : <Check size={14} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-full px-5 py-3 flex gap-1.5">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {isChannel && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              Visible to all channel members
            </span>
          )}
          <button className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isChannel ? "Type a message to the channel..." : "Type your message..."}
            className="flex-1 px-5 py-3 border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-base"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          />
          <button className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Smile size={24} />
          </button>
          <Button
            variant="primary"
            size="icon"
            className="rounded-full h-11 w-11 flex items-center justify-center"
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