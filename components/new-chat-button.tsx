"use client";

import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MessageCirclePlus } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"



export default function NewChatButton() {

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

        <TooltipProvider>

            <Tooltip>

                <TooltipTrigger asChild>
                    <Button
                        className="mt-4 text-lg cursor-pointer"
                        disabled={isPending || isSuccess}
                        onClick={() => mutate()}
                    >
                        <MessageCirclePlus />
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Criar novo chat</p>
                </TooltipContent>

            </Tooltip>

        </TooltipProvider>



    );

}