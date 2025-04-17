import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../ui/card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useStation} from "../../../hooks/useStation.ts";
import {useDispatch, useSelector} from "react-redux";
import {setAvailableYears, setId} from "../../../stores/stationSlice.ts";
import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {LineGraphStation} from "./LineGraphStation.tsx";

export interface FilterStationDataValue {
  id: number;
  date: Date;
  value: number;
}
export interface FilterStationData {
  RR: FilterStationDataValue[]
  TM: FilterStationDataValue[]
}

export function CardStation() {
  const station = useSelector((state: any) => state.station);
  const stationData = useStation(station.id);
  const [filterData, setFilterData] = useState<FilterStationData | null>(null);
  const dispatch = useDispatch();
  const refCard = useRef(null);
  const hideCard = () => {
      dispatch(setId(null));
  }

  const clickCardContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      hideCard()
    }
  }

  useEffect(() => {
    if (!stationData) return;

    const startAvailableYear = new Date(stationData?.[0]?.date).getFullYear();
    const endAvailableYear = new Date(stationData?.[stationData.length - 1]?.date).getFullYear();

    dispatch(setAvailableYears({
      startAvailableYear,
      endAvailableYear
    }))
  }, [dispatch, stationData]);

  const getValueFromMetric = (aggregatedByYear: [number, StationData[]][], metric: "TM" | "RR") => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return aggregatedByYear.filter(([_, data]) => {
      if (data.find(d => d[metric] === "None")) {
        return false;
      }
      const months = new Set(data.map(d => new Date(d.date).getMonth()));
      return months.size === 12;
    })
      .map(([year, data]) => {
        return {
          id: year,
          date: new Date(year, 0, 1),
          value: d3.mean(data, d => Number(d[metric])) as number,
        }
      })
      .filter(d => d.value !== undefined)
  }
  useEffect(() => {
    if (!stationData) return;
    const aggregatedByYear = d3.groups(stationData, d => new Date(d.date).getFullYear())
    const TM = getValueFromMetric(aggregatedByYear, "TM");
    const RR = getValueFromMetric(aggregatedByYear, "RR");

    setFilterData({TM, RR});
  }, [stationData]);

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
          <span> Alt. {stationData?.[0]?.alt}m </span>
          ({station.startAvailableYear ? station.startAvailableYear : "?"} - {station.endAvailableYear ? station.endAvailableYear : "?"})
        </CardDescription>
      </CardHeader>
      <CardContent className={"overflow-scroll"}>
        {stationData && stationData.length > 0 && filterData ? (
          <>
            <LineGraphStation
              stationData={filterData.TM}
              startAvailableYear={station.startAvailableYear}
              endAvailableYear={station.endAvailableYear}
              titleText={"Température moyenne"}
              colorLine={"#1a1e2e"}
            />

            <LineGraphStation
              stationData={filterData.RR}
              startAvailableYear={station.startAvailableYear}
              endAvailableYear={station.endAvailableYear}
              titleText={"Précipitations cumulées"}
              colorLine={"#1f77b4"}
              offsetY={10}
            />
          </>
        ): (
          <p>
            Aucune donnée disponible pour cette station
          </p>
        )}
      </CardContent>
    </Card>
  </div>
  )
}