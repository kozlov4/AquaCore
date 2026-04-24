"use client";

import { useState } from "react";
import Image from "next/image";
import { Paperclip, SendHorizontal } from "lucide-react";

function MessageBubble({ message }) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[420px] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isMe ? "bg-[#1d72b8] text-white" : "bg-[#5b5757] text-white"
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`mt-1 text-right text-[10px] ${
            isMe ? "text-white/80" : "text-white/70"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}

export function ChatWindow({ chat, messages }) {
  const [message, setMessage] = useState("");

  return (
    <section className="flex h-[calc(100vh-66px)] flex-1 flex-col bg-[#fafafa]">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src={chat.avatar}
              alt={chat.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{chat.name}</p>
            <p className="text-xs text-gray-400">онлайн</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-[760px] space-y-4">
          {messages.map((item) => (
            <MessageBubble key={item.id} message={item} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[760px] items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <button
            type="button"
            className="text-gray-400 transition hover:text-gray-700"
          >
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишіть повідомлення..."
            className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            className="text-[#1d72b8] transition hover:opacity-80"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}