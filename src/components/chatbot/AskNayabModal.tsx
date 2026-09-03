"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, X, Send, Bot, ExternalLink, Sparkles, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  actionLink?: {
    label: string;
    href: string;
  } | null;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "How do I check my result?",
  "What are the school timings?",
  "How do I pay school fees?",
  "When is the next holiday?",
  "What is the uniform policy?",
];

export default function AskNayabModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Assalam-o-Alaikum! I am Nayab Assistant. How can I help you today? You can ask about exam results, monthly fees, school timings, or upcoming events.",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I am currently unable to fetch an answer. Please try again or contact the school office.",
        actionLink: data.actionLink || null,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Sorry, I am having trouble connecting to the school knowledge base. Please check your internet connection or reach out to the administration directly.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget print-hide fixed z-50 bottom-20 md:bottom-6 right-4 sm:right-6">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-4 py-3.5 rounded-full shadow-2xl border-2 border-[#D4AF37] transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Open School AI Chatbot"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
              <Image
                src="/images/school-logo.png"
                alt="Nayab Bot"
                width={26}
                height={26}
                className="rounded-full"
              />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold leading-tight">Ask Nayab</span>
            <span className="block text-[10px] text-[#D4AF37]">AI Assistant</span>
          </div>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1B2A4A] text-white p-3.5 flex items-center justify-between border-b border-[#D4AF37]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#D4AF37] flex items-center justify-center">
                <Image
                  src="/images/school-logo.png"
                  alt="Nayab School Emblem"
                  width={30}
                  height={30}
                  className="rounded-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>Ask Nayab</span>
                  <span className="text-[10px] bg-[#D4AF37] text-[#111C32] px-1.5 py-0.2 rounded font-extrabold uppercase">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Grounded School Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FB]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-[#1B2A4A] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-[#1B2A4A] text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Link
                        href={m.actionLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B2A4A] bg-[#FCF9EE] border border-[#D4AF37] px-2.5 py-1.5 rounded-md hover:bg-[#D4AF37] hover:text-[#111C32] transition"
                      >
                        <span>{m.actionLink.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      m.sender === "user" ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#1B2A4A] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B2A4A] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B2A4A] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B2A4A] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-500 ml-1">Searching school records...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="bg-white border-t border-slate-100 px-3 py-2 overflow-x-auto whitespace-nowrap flex gap-1.5 text-[11px]">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 bg-slate-100 hover:bg-[#FCF9EE] text-slate-700 hover:text-[#1B2A4A] hover:border-[#D4AF37] border border-slate-200 px-2.5 py-1 rounded-full transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about results, fees, timings..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#1B2A4A] hover:bg-[#111C32] disabled:opacity-50 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0 min-w-[42px] min-h-[42px]"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
