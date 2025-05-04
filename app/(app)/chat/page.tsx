"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { PlusCircle, Menu } from "lucide-react";
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

      router.push(`/chat/${data.chatId}`);
    },
  });

  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 absolute top-2 left-2"
          onClick={() => {
            toggleSidebar();
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <h1 className="text-2xl font-bold">Bem-vindo ao Database AI 🤖</h1>
      <Button
        className="mt-4 text-lg cursor-pointer transform transition-transform duration-300 hover:scale-110"
        disabled={isPending || isSuccess}
        onClick={() => mutate()}
      >
        Iniciar uma conversa <PlusCircle />
      </Button>
    </div>
  );
}
