"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import logo from "../public/logo-light.png";
import Image from "next/image";
import NewChatButton from "./new-chat-button";

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between gap-2 text-sidebar-accent-foreground">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              className="aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground border"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Database AI</span>
            </div>
          </div>

          <div className="pb-4 pr-2 transform transition-transform duration-300 hover:scale-110">
            <NewChatButton />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
