"use client";

import { SidebarShadcnProvider } from "@/providers/sidebar-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShadcnProvider>{children}</SidebarShadcnProvider>;
}
