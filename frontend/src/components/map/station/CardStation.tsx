import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../ui/card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useStation} from "../../../hooks/useStation.ts";
import {useDispatch, useSelector} from "react-redux";
import {setStationId} from "../../../stores/mapSlice.ts";
import React, {useEffect, useMemo, useRef} from "react";
import {GraphCardStation} from "./GraphCardStation.tsx";
import {setAvailableYears} from "../../../stores/TimelineSlice.ts";

export function CardStation() {
  const map = useSelector((state: any) => state.map);
  const timeline = useSelector((state: any) => state.timeline);
  const stationData = useStation(map.stationId);
  const dispatch = useDispatch();
  const refCard = useRef(null);
  const hideCard = () => {
      dispatch(setStationId(null));
  }

  const clickCardContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      hideCard()
    }
  }

  const currentYearStationData : StationData[] | undefined = useMemo(() => {
    return stationData?.filter((data: StationData) =>
      new Date(data.date).getFullYear() === timeline.year);
  }, [stationData, timeline.year]);


  useEffect(() => {
    if (!stationData) return;
    dispatch(setAvailableYears(
      {
        startAvailableYear: new Date(stationData?.[0]?.date).getFullYear(),
        endAvailableYear: new Date(stationData?.[stationData.length - 1]?.date).getFullYear(),
      }
    ))
  }, [stationData]);
  const rangeYear = useMemo(() => {
    if (!stationData || stationData.length === 0 || stationData === undefined) return {firstYear: null, lastYear: null};
    const firstYear = new Date(stationData?.[0].date).getFullYear();
    const lastYear = new Date(stationData[stationData.length - 1].date).getFullYear();
    return {firstYear, lastYear}
  }, [stationData])

  return (
  <div className={"absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black/40"} onClick={clickCardContainer}>
    <Card className={"opacity-100 bg-white w-80/100 h-85/100 lg:w-3/4 lg:h-90/100 relative"} ref={refCard}>
      <CardHeader className={"w-full bg-white z-10 h-12 sticky top-0 left-0"}>
        <CardTitle className={"flex justify-between "}>
          <p className={"mr-4"}>
            {stationData?.[0]?.nom ?? "Station non trouvée"}
          </p>
          <FontAwesomeIcon icon={faXmark} className={"cursor-pointer"} onClick={hideCard}/>
        </CardTitle>
        <CardDescription>
          {timeline.year} ({rangeYear.firstYear ? rangeYear.firstYear : "?"} - {rangeYear.lastYear ? rangeYear.lastYear : "?"})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentYearStationData?.length !== 0 && currentYearStationData  ? (
          <GraphCardStation stationData={currentYearStationData}/>
        ) : (
          <p>
            Pas de données disponibles à cette date.
          </p>
        )}
      </CardContent>
    </Card>
  </div>
  )
}