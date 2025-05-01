"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import axiosClient from "@/lib/axios-client";
import { ChatType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageCircleMore } from "lucide-react";

export function NavMain() {
  const { data } = useQuery({
    queryKey: ["chats-query"],
    queryFn: async (): Promise<ChatType[]> => {
      // Simulate fetching data
      const response = await axiosClient.get("/api/chat/all");
      return response.data ?? [];
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data?.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild className="h-fit">
                <a href={`/chat/${item.id}`} className="truncate">
                  <MessageCircleMore className="h-6 w-6" />
                  <div className=" flex flex-col text-xs text-muted-foreground">
                    <span className="">
                      {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate max-w-[164px]">
                      {item.id}
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
