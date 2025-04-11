import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar"
import {Switch} from "../ui/switch";
import {useDispatch, useSelector} from "react-redux";
import {setInfoSidebar as setInfoSidebarSlice, SidebarName} from "../stores/sidebarSlice";

export function AppSidebar() {

  const sidebar = useSelector((state: any) => state.sidebar);
  const dispatch = useDispatch();
  const setInfoSidebar = (name: string, value: boolean) => {
    dispatch(setInfoSidebarSlice({name, value}))
  }
  const items = [
    {
      name: "Global",
      value: sidebar.global,
      setValue: (value: boolean) => setInfoSidebar(SidebarName.GLOBAL, value),
    },
    {
      name: "Stations Météo",
      value: sidebar.stations,
      setValue: (value: boolean) => setInfoSidebar(SidebarName.STATIONS, value),
    },
    {
      name: "Tempêtes",
      value: sidebar.tempete,
      setValue: (value: boolean) => setInfoSidebar(SidebarName.TEMPETE, value),
    },
    {
      name: "Submersions",
      value: sidebar.submersions,
      setValue: (value: boolean) => setInfoSidebar(SidebarName.SUBMERSIONS, value),
    }
  ]
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