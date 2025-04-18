import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "../ui/sidebar"
import {Switch} from "../ui/switch";
import {useDispatch, useSelector} from "react-redux";
import {setInfoSidebar as setInfoSidebarSlice, SidebarName} from "../stores/sidebarSlice";
import {Link, useLocation} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartSimple, faMap} from "@fortawesome/free-solid-svg-icons";

export function Sidebar() {

  const sidebar = useSelector((state: any) => state.sidebar);
  const dispatch = useDispatch();
  const setInfoSidebar = (name: string, value: boolean) => {
    dispatch(setInfoSidebarSlice({name, value}))
  }
  const sidebarData = [
    {
      title: "Filtres cartes",
      switch: [
        {
          name: "Global",
          value: sidebar.global,
          setValue: (value: boolean) => setInfoSidebar(SidebarName.GLOBAL, value),
        },
        {
          name: "Station Météo",
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
    },
    {
        title: "Pages",
        type: "pages",
        pages: [
          {
            title: "Carte",
            icon: faMap,
            url: "/littoral-francais"
          },
          {
            title: "Rapport global",
            icon: faChartSimple,
            url: "/littoral-francais/report"
          }
        ]
    }
  ]
  const location = useLocation()
  return (
    <UiSidebar>
      <SidebarContent className="p-2  bg-primary text-white">
        <h1 className="text-2xl mb-4 mx-2 font-medium">
          L'évolution du littoral français depuis le XXème siècle <br />
        </h1>
        {sidebarData.map((data) => (
            <SidebarGroup>
              {/* Title */}
                <h2 className={"text-lg text-white mb-2"}>
                  {data.title}{" "}
                </h2>

              {/* Content */}
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Switch */}
                  {data.switch && data.switch.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <div key={item.name} className={"flex justify-between items-center my-1 cursor-pointer mx-2 " +
                        (item.name === "Global" ? "" : "")}
                           onClick={() => {
                             item.setValue(!item.value)
                           }}
                      >
                        <p className="text-md">{item.name}</p>
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.setValue}
                          className={"cursor-pointer data-[state=checked]:bg-switch"}
                        />
                      </div>
                    </SidebarMenuItem>
                  ))}
                  {/*  Page */}
                  {data.pages && data.pages.map((item) => (
                    <SidebarMenuItem key={item.title} className={"mx-2 mb-1"}>
                      <Link to={item.url}>
                        <SidebarMenuSubButton className={"text-white text-md"} asChild isActive={location.pathname === item.url}>
                          <span>
                            <FontAwesomeIcon icon={item.icon} className={"mr-2 "}/>
                            {item.title}
                          </span>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className={"bg-primary text-white text-sm"}>
        <p className={"text-center"}>
          Données fournies par <a href={"https://meteo.data.gouv.fr/datasets/6569b3d7d193b4daf2b43edc"} className={"underline"}>Météo France</a>
          <span> et <a href={"https://www.data.gouv.fr/fr/datasets/tempetes-et-submersions-historiques/#/resources"} className={"underline"}>l'ASNR</a></span>
        </p>
      </SidebarFooter>
    </UiSidebar>
  )
}