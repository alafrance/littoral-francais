import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from "react-leaflet-markercluster";
import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import {useStations} from "../../hooks/useStation.ts";
import {useSelector} from "react-redux";
import {StationMarker} from "./StationMarker.tsx";
import {CardStation} from "./station/CardStation.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useSidebar} from "../../ui/sidebar.tsx";

export function Map() {
  const stations = useStations();
  const sidebar = useSelector((state: any) => state.sidebar);
  const station = useSelector((state: any) => state.station);
  const { toggleSidebar } = useSidebar()

  return (
    <div className={"w-full flex-1 relative"}>
      <button className={"absolute top-0 bg-white right-0 w-12 h-12 z-10 flex items-center justify-center rounded-bl-md cursor-pointer "}
           onClick={() => {
             toggleSidebar()
           }}
      >
        <FontAwesomeIcon icon={faBars} className={"w-8 h-8 text-black"} />
      </button>
      <MapContainer center={[46.5, 2.35]} zoom={6} scrollWheelZoom={false} className={"w-full h-full z-1"}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={"w-full h-full"}
          />

        <MarkerClusterGroup>
          {stations && sidebar.stations && stations.map((station: Station) => (
            <StationMarker station={station} key={station.id} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      {station.id && (
        <CardStation />
      )}
    </div>
  )
}