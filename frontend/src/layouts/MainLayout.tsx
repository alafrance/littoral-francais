import {SidebarProvider} from "../ui/sidebar";
import React from "react";
import {AppSidebar} from "../components/AppSidebar";

export function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className={"min-h-screen w-screen"}>
      <SidebarProvider>
        <div className={"flex w-full"}>
          <AppSidebar />
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}