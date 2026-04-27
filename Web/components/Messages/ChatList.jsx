"use client";

import Image from "next/image";

export function ChatList({ chats, selectedChatId, onSelectChat }) {
  return (
    <aside className="w-[320px] shrink-0 border-r border-gray-200 bg-white">
      <div className="h-[calc(100vh-66px)] overflow-y-auto">
        {chats.map((chat) => {
          const isActive = selectedChatId === chat.id;

          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat)}
              className={`flex w-full items-start gap-3 cursor-pointer px-4 py-4 text-left transition hover:bg-gray-100 ${
                isActive ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {chat.name}
                  </p>

                  <span className="shrink-0 text-xs text-gray-400">
                    {chat.time}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-gray-400">
                    {chat.message}
                  </p>

                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-700 px-1 text-[10px] font-semibold text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}