import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTemperatureHalf} from "@fortawesome/free-solid-svg-icons";
// import {useEffect, useState} from "react";
import {useStation} from "../hooks/useStation.ts";

export function StationMarker({station}: {station: Station}) {
  // const [hovered, setHovered] = useState(false);
  const {station: stationData, loading: loadingData} = useStation(station.id, false);
  const iconHTML = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faTemperatureHalf} size="2x" className={"text-primary"} />
  );

  const stationIconMarker = L.divIcon({
    html: iconHTML,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

  return (
    <Marker position={[station.lat, station.lon]} key={station.id} icon={stationIconMarker}
            eventHandlers={{
              click: () => {
                // setHovered(!hovered)
                // console.log('marker clicked')
              },
            }}
      // eventHandlers={{
      //     mouseover: () => setHovered(true),
      //     mouseout: () => setHovered(false),
      //     {/*}}*/}
    >
      <Popup offset={[-8, -32]} className={""}>
        <div className={"flex flex-col"}>
          <p className={"text-primary text-lg"}>{station.nom}</p>
          {stationData && !loadingData && (
            <p className={"text-primary"}>Température : {stationData[0].TN}°C</p>
          )}
          {loadingData && (
            <p className={"text-primary"}>Chargement...</p>
          )}
        </div>
      </Popup>
      {/*<Tooltip direction="top" opacity={1} offset={[-8, -32]} className={"block lg:hidden"}>*/}
      {/*  <div className={"flex flex-col"}>*/}
      {/*    <p className={"text-primary text-lg"}>{station.nom}</p>*/}
      {/*    {stationData && !loadingData && (*/}
      {/*      <p className={"text-primary"}>Température : {stationData[0].TN}°C</p>*/}
      {/*    )}*/}
      {/*    {loadingData && (*/}
      {/*      <p className={"text-primary"}>Chargement...</p>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</Tooltip>*/}
    </Marker>
  )
}