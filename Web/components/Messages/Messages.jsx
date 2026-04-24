"use client";

import { useState } from "react";
import { Sidebar } from "../Profile/Sidebar";
import { Header } from "../Profile/Header";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import { EmptyChatState } from "./EmptyChatState";

const chatList = [
  {
    id: 1,
    name: "Sweetie",
    avatar: "/images/Avatar.png",
    message: "I love you so much!",
    time: "8:32 PM",
    unread: 0,
  },
  {
    id: 2,
    name: "Jane Cooper",
    avatar: "/images/Avatar.png",
    message: "📷 Photo",
    time: "3:27 PM",
    unread: 0,
  },
  {
    id: 3,
    name: "Serge",
    avatar: "/images/Avatar.png",
    message: "✨",
    time: "10:54 AM",
    unread: 0,
  },
  {
    id: 4,
    name: "kiguk",
    avatar: "/images/Avatar.png",
    message: "📷 Photo",
    time: "3:36 AM",
    unread: 0,
  },
  {
    id: 5,
    name: "iceChat",
    avatar: "/images/Avatar.png",
    message: "I reeeaally love this animation! It is so smot...",
    time: "Thu",
    unread: 57,
  },
  {
    id: 6,
    name: "iceDSGN",
    avatar: "/images/Avatar.png",
    message: "🎉 Happy New Year! 🎉",
    time: "Thu",
    unread: 0,
  },
  {
    id: 7,
    name: "About The Dot",
    avatar: "/images/Avatar.png",
    message: "🐞 Bugs and Suggestions Dark As some of you ar...",
    time: "Mon",
    unread: 0,
  },
  {
    id: 8,
    name: "kiguK_en",
    avatar: "/images/Avatar.png",
    message: "📄 Design Review Poster",
    time: "04:01",
    unread: 0,
  },
];

const demoMessages = [
  {
    id: 1,
    text: "Can you explain me how do auto-layouts work?",
    time: "10:03 AM",
    sender: "other",
  },
  {
    id: 2,
    text: "Can you explain me how do auto-layouts work?",
    time: "10:03 AM",
    sender: "other",
  },
  {
    id: 3,
    text: "Sure!",
    time: "9:58 AM",
    sender: "me",
  },
  {
    id: 4,
    text: "Hey, heard about variants in figma?",
    time: "10:03 AM",
    sender: "me",
  },
  {
    id: 5,
    text: "Hey, heard about variants in figma?",
    time: "10:03 AM",
    sender: "me",
  },
  {
    id: 6,
    text: "Nope. What is this?",
    time: "10:03 AM",
    sender: "other",
  },
  {
    id: 7,
    text: "So convinient!",
    time: "10:03 AM",
    sender: "other",
  },
  {
    id: 8,
    text: "Sup",
    time: "10:03 AM",
    sender: "other",
  },
  {
    id: 9,
    text: "What do u think about creating some additional screens for our case?",
    time: "10:03 AM",
    sender: "other",
  },
];

export function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="ml-[88px]">
        <Header />

        <main className="flex">
          <ChatList
            chats={chatList}
            selectedChatId={selectedChat?.id}
            onSelectChat={setSelectedChat}
          />

          {selectedChat ? (
            <ChatWindow chat={selectedChat} messages={demoMessages} />
          ) : (
            <EmptyChatState />
          )}
        </main>
      </div>
    </div>
  );
}