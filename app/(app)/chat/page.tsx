"use client";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatLanding() {
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post("/api/chat/create");
      return response.data;
    },
    onSuccess(data) {
      console.log("Chat created successfully:", data);
      // Redirect to the chat page or perform any other action
      router.push(`/chat/${data.chatId}`);
    },
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Bem-vindo ao Database AI 🤖</h1>
      <Button
        className="mt-4 text-lg cursor-pointer transform transition-transform duration-300 hover:scale-110"
        disabled={isPending || isSuccess}
        onClick={() => mutate()}
      >
        Criar novo Chat <PlusCircle />
      </Button>
    </div>
  );
}
