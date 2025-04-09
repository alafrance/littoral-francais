import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar"
import {Switch} from "../ui/switch";
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
              L'évolution du littoral français depuis le XXème siècle <br />
              <span className={"font-bold text-xl"}>(en cours de développement)</span>
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