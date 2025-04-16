import {SidebarProvider} from "../ui/sidebar";
import React from "react";
import {Sidebar} from "../components/Sidebar.tsx";

export function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className={"min-h-screen w-screen"}>
      <SidebarProvider>
        <div className={"flex w-full"}>
          <Sidebar />
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}