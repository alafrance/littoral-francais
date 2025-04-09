import {SidebarProvider} from "../components/ui/sidebar.tsx";
import React from "react";
import {AppSidebar} from "../components/AppSidebar.tsx";
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