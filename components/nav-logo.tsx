"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import logo from "@/public/logo-light.png";
import Image from "next/image";

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 text-sidebar-accent-foreground">
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
