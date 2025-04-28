"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "chatbot";
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello, how can I assist you today?",
    sender: "chatbot",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const {} = useMutation({
    mutationFn: async (message: Message) => {
      // Simulate sending a message to the server

      const response = await axiosClient.post("/api/chatbot/send-message", {
        message: message.content,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
    },
  });

  return (
    <div className="flex body-height flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="Chatbot" />
            <AvatarFallback>CB</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-medium">Chatbot</h3>
        </div>
      </header>
      <div className="flex-1 flex flex-col-reverse gap-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "justify-end" : ""
            }`}
          >
            {message.sender === "chatbot" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Chatbot" />
                <AvatarFallback>CB</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm dark:border-gray-800 dark:bg-gray-800 ${
                message.sender === "user"
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  : ""
              }`}
            >
              <p>{message.content}</p>
            </div>
            {message.sender === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="You" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <form className="flex items-center gap-2">
          <Input placeholder="Type your message..." className="flex-1" />
          <Button>Send</Button>
        </form>
      </div>
    </div>
  );
}
