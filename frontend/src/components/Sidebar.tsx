import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar"
import {Switch} from "../ui/switch";
import {useDispatch, useSelector} from "react-redux";
import {setInfoSidebar as setInfoSidebarSlice, SidebarName} from "../stores/sidebarSlice";

export function Sidebar() {

  const sidebar = useSelector((state: any) => state.sidebar);
  const dispatch = useDispatch();
  const setInfoSidebar = (name: string, value: boolean) => {
    dispatch(setInfoSidebarSlice({name, value}))
  }
  const items = [
    // {
    //   name: "Global",
    //   value: sidebar.global,
    //   setValue: (value: boolean) => setInfoSidebar(SidebarName.GLOBAL, value),
    // },
    {
      name: "Stations Météo",
      value: sidebar.stations,
      setValue: (value: boolean) => setInfoSidebar(SidebarName.STATIONS, value),
    },
    // {
    //   name: "Tempêtes",
    //   value: sidebar.tempete,
    //   setValue: (value: boolean) => setInfoSidebar(SidebarName.TEMPETE, value),
    // },
    // {
    //   name: "Submersions",
    //   value: sidebar.submersions,
    //   setValue: (value: boolean) => setInfoSidebar(SidebarName.SUBMERSIONS, value),
    // }
  ]
  return (
    <UiSidebar>
      <SidebarContent className="p-2 text-white bg-primary border-0">
        <SidebarGroup>
            <h1 className="text-2xl mb-8 font-medium">
              L'évolution du littoral français depuis le XXème siècle <br />
            </h1>
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
              {items.length >= 1 && (
                <div className={"mt-2"}>
                  Autre données à venir...
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </UiSidebar>
  )
}