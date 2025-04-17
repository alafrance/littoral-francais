import {SidebarProvider} from "../ui/sidebar";
import {Sidebar} from "../components/Sidebar.tsx";

export function MainLayout({children}: { children: React.ReactNode }) {
  return (
    <div className={"min-h-screen w-screen"}>
      <SidebarProvider>
        <div className={"flex w-full"}>
          <Sidebar/>
          <main className={"w-full h-full flex flex-col "}>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
)
}