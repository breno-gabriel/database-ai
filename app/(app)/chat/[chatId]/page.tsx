"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuid } from "uuid";
import { Message } from "../types";

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello, how can I assist you today?",
    sender: "chatbot",
    timestamp: new Date(),
  },
];

function ChatInput({
  handleSendMessage,
  isPending,
}: {
  handleSendMessage: (
    event: React.FormEvent,
    setMessageContent: React.Dispatch<React.SetStateAction<string>>,
    messageContent: string
  ) => void;
  isPending: boolean;
}) {
  const [messageContent, setMessageContent] = useState("");
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) =>
        handleSendMessage(event, setMessageContent, messageContent)
      }
    >
      <Input
        placeholder="Type your message..."
        className="flex-1"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        Send
      </Button>
    </form>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/chatbot/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.content,
          sender: "user",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chatbotMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chatbotMessage += decoder.decode(value, { stream: true });

        // While the message is being received, you could update it live
        setMessages((prev) => {
          const updated = [...prev];
          // Update last chatbot message if it exists, else add it
          const lastMessage = updated.find(
            (msg) => msg.id === "streaming-chatbot"
          );
          if (lastMessage) {
            lastMessage.content = chatbotMessage;
          } else {
            updated.unshift({
              id: "streaming-chatbot",
              content: chatbotMessage,
              sender: "chatbot",
              timestamp: new Date(),
            });
          }
          return [...updated];
        });
      }

      // After finished, replace the temp "streaming-chatbot" id with a real id
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming-chatbot"
            ? { ...msg, id: uuid(), timestamp: new Date() }
            : msg
        )
      );

      return;
    },
  });

  function handleSendMessage(
    event: React.FormEvent,
    setMessageContent: React.Dispatch<React.SetStateAction<string>>,
    messageContent: string
  ) {
    if (!messageContent.trim()) return;
    setMessageContent("");
    event.preventDefault();

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    mutate(newMessage);
  }

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
        {messages
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .map((message) => (
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
                <ReactMarkdown>{`${message.content}`}</ReactMarkdown>
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
        <ChatInput
          handleSendMessage={handleSendMessage}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
