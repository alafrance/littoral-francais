import {SidebarProvider} from "../ui/sidebar";
import {Sidebar} from "../components/Sidebar.tsx";
import {ToggleSidebar} from "../components/ToggleSidebar.tsx";

export function MainLayout({children}: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen w-screen"}>
      <SidebarProvider>
        <div className={"w-full flex"}>
          <Sidebar/>
          <main className={"w-full h-full flex flex-col "}>
            {children}
          </main>
        </div>
        <ToggleSidebar/>
      </SidebarProvider>
    </div>
)
}