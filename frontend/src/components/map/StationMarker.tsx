import {Marker, Tooltip} from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTemperatureHalf} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {setStationId as setStationIdSlice} from "../../stores/mapSlice.ts";

export function StationMarker({station}: {station: Station}) {
  const dispatch = useDispatch();
  const setStationId = (id: string) => {
    dispatch(setStationIdSlice(id));
  }
  const iconHTML = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faTemperatureHalf} size="2x" className={"text-primary"} />
  );

  const stationIconMarker = L.divIcon({
    html: iconHTML,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
  const onClickMarker = () => {
    setStationId(station.id);
  }

  return (
    <Marker position={[station.lat, station.lon]} key={station.id} icon={stationIconMarker}
            eventHandlers={{
              click: () => onClickMarker(),
            }}
    >
      <Tooltip direction={"top"} offset={[-8, -32]}>
        <h1>{station.nom}</h1>
        <p>Cliquer dessus pour avoir plus d'informations</p>
      </Tooltip>
    </Marker>
  )
}