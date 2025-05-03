"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import axiosClient from "@/lib/axios-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "../types";
import shadcnAvatar from "@/public/shadcn-avatar.png";
import logo from "@/public/logo-light.png";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

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
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: session } = authClient.useSession();

  const { chatId } = useParams();

  const { isLoading, isError } = useQuery({
    queryKey: ["chat-messages"],

    queryFn: async () => {
      const response = await axiosClient.get(`/api/message/all/${chatId}`, {});
      setMessages(response.data);
      return response.data;
    },
    enabled: !!chatId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/chatbot/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: message.id,
          chatId: chatId,
          content: message.content,
          role: "user",
          sendAt: new Date().toISOString(),
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
              role: "model",
              sendAt: new Date(),
            });
          }
          return [...updated];
        });
      }

      const chatBotMessageId = uuid();
      const chatBotFinished = new Date();

      await axiosClient.post(`/api/message/create/${chatId}`, {
        id: chatBotMessageId,
        chatId: chatId,
        content: chatbotMessage,
        role: "model",
        sendAt: new Date().toISOString(),
      });

      // After finished, replace the temp "streaming-chatbot" id with a real id
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming-chatbot"
            ? { ...msg, id: chatBotMessageId, sendAt: chatBotFinished }
            : msg
        )
      );

      return;
    },

    onError: (error) => {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: uuid(),
        content: "Erro ao enviar mensagem",
        role: "model" as any,
        sendAt: new Date(),
      };
      setMessages((prev) => {
        const tmp = [...prev];
        const messageIndex = tmp.findIndex(
          (msg) => msg.id === "streaming-chatbot"
        );

        tmp.splice(messageIndex, 1);
        tmp.push(errorMessage);
        return [...tmp];
      });

      axiosClient.post(`/api/message/create/${chatId}`, {
        ...errorMessage,
        chatId,
      });
    },
  });

  console.log("messages", messages);

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

      role: "user",
      sendAt: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    mutate(newMessage);
  }

  return (
    <div className="flex body-height flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <Image
              src={logo}
              alt="Logo"
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </Avatar>
          <h3 className="text-sm font-medium">Database AI 🤖</h3>
        </div>
      </header>
      <div className="flex-1 flex flex-col-reverse gap-4 overflow-y-auto p-4">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading messages</div>}
        {messages
          .sort(
            (a, b) =>
              new Date(b.sendAt).getTime() - new Date(a.sendAt).getTime()
          )
          .map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "model" && (
                <Avatar className="h-8 w-8">
                  <Image
                    src={logo}
                    alt="Logo"
                    sizes="100vw"
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              )}
              <div
                className={`rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm dark:border-gray-800 dark:bg-gray-800 ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : ""
                }`}
              >
                <MarkdownRenderer content={message.content} />
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user.image ?? ""}
                    alt={session?.user.name ?? "You"}
                  />
                  <AvatarFallback>
                    <Image
                      src={shadcnAvatar}
                      alt="User Avatar"
                      sizes="100vw"
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
      </div>
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <ChatInput
          handleSendMessage={handleSendMessage}
          isPending={isPending || isLoading || isError}
        />
      </div>
    </div>
  );
}
