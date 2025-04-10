import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from "react-leaflet-markercluster";
import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import {useStations} from "../hooks/useStation.ts";
import {useSelector} from "react-redux";
import {StationMarker} from "./StationMarker.tsx";

export function Map() {
  const stations = useStations();
  const sidebar = useSelector((state: any) => state.sidebar);

  return (
    <div className={"w-full flex-1 relative"}>
        <MapContainer center={[46.5, 2.35]} zoom={6} scrollWheelZoom={false} className={"w-full h-full"}>
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
    </div>
  )
}