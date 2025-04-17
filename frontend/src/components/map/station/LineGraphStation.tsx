import * as d3 from 'd3';
import {useRef} from "react";
import {FilterStationDataValue} from "./CardStation.tsx";
import {useD3Line} from "../../../hooks/useD3Line.ts";

// = "Température moyenne"
export function LineGraphStation({stationData,
                                   startAvailableYear,
                                   endAvailableYear,
                                   width = 700, height = 400,
                                   marginTop = 20, marginRight = 20,
                                   marginBottom = 40, marginLeft = 40,
                                   titleText,
                                   colorLine,
                                   offsetY

}: {
  stationData: FilterStationDataValue[] | null, startAvailableYear: number, endAvailableYear: number, width?: number, height?: number,
  marginTop?: number, marginRight?: number, marginBottom?: number, marginLeft?: number, titleText: string, colorLine: string, offsetY?: number
}) {
  const refTemp = useRef<SVGSVGElement>(null);
  const tooltip = d3.select(".tooltip");

  const updateTooltip = (temp: number, date: Date) => {
    tooltip
    .html("" +
      "<p>Température : " + temp.toFixed(2) + " °C</p>" +
      "<p>Année : " + date.getFullYear().toLocaleString("fr-Fr") + "</p>"
    )
    .style("opacity", 1)
  }
  const d3Line = useD3Line(stationData, refTemp, updateTooltip, width, height, marginLeft, marginRight, marginTop, marginBottom, startAvailableYear, endAvailableYear, colorLine, offsetY);
  const {linearRes } = d3Line;
  return (
    <>
      <h1 className={"font-semibold text-lg m-2"}>
        {titleText} de {startAvailableYear} à {endAvailableYear}
      </h1>
      <div className={"relative mb-8"}>
        <div className={"mt-2 border-2 border-gray-300 rounded-md p-2 shadow-md z-10 cursor-default w-44 text-xs absolute left-12 top-2 tooltipTemp"}
             style={{opacity: 0}}
        />
        {stationData && stationData.length > 0 ? (
          <>
            {/*Legend */}
            <div className={"mt-2 border-2 border-gray-300 rounded-md p-2 shadow-md z-10 w-auto text-sm absolute left-12 top-2 bg-white"}>
              <div className={"flex items-center"}>
                <div className={"w-5 h-0.5 mr-2 border-t-2 border-red-600 border-dashed"} />
                Projection linéaire des données (y = {linearRes?.a.toExponential(2)} x + {linearRes?.b.toFixed(1)})
              </div>
              <div className={"mt-4 flex items-center"}>
                <div
                  className={`w-5 h-0.5 mr-2 border-t-2 border-dashed`}
                  style={{
                    borderColor: colorLine,
                  }}
                />
                Données station
              </div>
            </div>

            {/*  Svg*/}
            <svg ref={refTemp}/>
          </>
        ) : (
          <p className={"mt-4 ml-2"}>
            Aucune donnée disponible
          </p>
        )}
      </div>
    </>
  );
}