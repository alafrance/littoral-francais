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
  const [isTempete, setIsTempete] = useState(true)
  const [isSubmersions, setIsSubmersions] = useState(true)

  const setIsGlobalHandler = (value: boolean) => {
    setIsGlobal(value)
    setIsStations(value)
    setIsTempete(value)
    setIsSubmersions(value)
  }
  const items = [
    {
      name: "Global",
      value: isGlobal,
      setValue: setIsGlobalHandler,
    },
    {
      name: "Stations Météo",
      value: isStations,
      setValue: setIsStations,
    },
    {
      name: "Tempêtes",
      value: isTempete,
      setValue: setIsTempete,
    },
    {
      name: "Submersions",
      value: isSubmersions,
      setValue: setIsSubmersions,
    }
  ]
  return (
    <Sidebar>
      <SidebarContent className="p-2 text-white bg-primary border-0">
        <SidebarGroup>
          {/*<div className="flex">*/}
            <h1 className="text-2xl mb-8 font-medium">
              L'évolution du littoral français depuis le XXème siècle <br />
              <span className={"font-bold text-xl"}>(en cours)</span>
            </h1>
          {/*</div>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <div key={item.name} className={"flex justify-between items-center " +
                (item.name === "Global" ? "mb-12" : "mb-2")}>
                  <p className="text-lg">{item.name}</p>
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.setValue}
                    className={"cursor-pointer data-[state=checked]:bg-switch"}
                  />
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}