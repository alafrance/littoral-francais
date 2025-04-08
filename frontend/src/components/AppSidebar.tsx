import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu, SidebarTrigger,
} from "./ui/sidebar"
import {Switch} from "./ui/switch.tsx";
import {useState} from "react";

export function AppSidebar() {
  const [isGlobal, setIsGlobal] = useState(true)
  const [isStations, setIsStations] = useState(true)
  return (
    <Sidebar>
      <SidebarContent className="p-2 text-white bg-primary border-0">
        <SidebarGroup>
          {/*<div className="flex">*/}
            <h1 className="text-2xl mb-8 font-medium">
              L'évolution du littoral français depuis le XXème siècle
            </h1>
          {/*</div>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex justify-between items-center mb-12">
                <p className="text-xl">Global</p>
                <Switch
                  checked={isGlobal}
                  onCheckedChange={setIsGlobal}
                  className={"cursor-pointer data-[state=checked]:bg-switch"}
                />
              </div>
              <div className={"flex justify-between items-center mb-12"}>
                <p className="text-lg">Stations Météo</p>
                <Switch
                  checked={isStations}
                  onCheckedChange={setIsStations}
                  className={"cursor-pointer data-[state=checked]:bg-switch"}
                />
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}