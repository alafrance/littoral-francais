import * as d3 from 'd3';
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTemperatureThreeQuarters} from "@fortawesome/free-solid-svg-icons";
import {Button} from "../../../ui/button.tsx";
import {NumberValue} from "d3";

type MetricKey = 'TN' | 'TX' | 'TM';

export function GraphCardStation({stationData,
                                   width = 640, height = 400,
                                   marginTop = 20, marginRight = 20,
                                   marginBottom = 20, marginLeft = 20}: {
  stationData: StationData[], width?: number, height?: number,
  marginTop?: number, marginRight?: number, marginBottom?: number, marginLeft?: number
}) {
  const year = useSelector((state: any) => state.timeline).year;
  const refTemp = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const possibleMetrics: MetricKey[] = ["TN", "TX", "TM"];
  const [currentMetrics, setCurrentMetrics] = useState<MetricKey>(possibleMetrics[0]);

  // Locale FR
  const localeFR = d3.timeFormatLocale({
    "dateTime": "%A, le %e %B %Y, %X",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    "shortMonths": ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]
  })

  useEffect(() => {
    // CREATE SVG
    const svg = d3.select(refTemp.current)
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)

    // Select group
    const container = d3.select(containerRef.current)

    // Remove old d3 elements
    svg.selectAll('g').remove();
    container.selectChild("div#tooltip").remove();

    // Create x axis
    const x = d3.scaleTime()
      .domain([new Date(year, 0, 1), new Date(year, 11, 31)])
      .range([0, width]);
    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(localeFR.format("%B") as (domainValue: Date | NumberValue, index: number) => string )
    svg.append("g")
      .attr("transform", `translate(${marginLeft},${height + marginTop})`)
      .call(xAxis);

    // Create y axis
    const y = d3.scaleLinear()
      .domain([
        -20,
        50
      ])
      .range([height, 0]);
    const yAxis = d3.axisLeft(y);
    svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .call(yAxis);

    // Lines
    const line = d3.line<StationData>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d[currentMetrics]));

    // Add line to svg
    svg
      .selectAll('.line')
      .data([stationData], d => (d as StationData).id)
      .join(
        enter => enter.append('path')
            .attr('fill', 'none')
            .attr('stroke', '#1a1e2e')
            .attr('stroke-width', 1.5)
            .attr('d', line as any)
            .attr("transform", `translate(${marginLeft},${marginTop})`)
            .attr("class", "line")
            .on("end", () => {
              d3.selectAll('circle')
                .transition()
                .duration(500)
                .style('opacity', 1);
            })
            .on("start", () => {
              d3.selectAll('circle')
                .style('opacity', 0);
            }),
            update => update
            .transition()
            .duration(750)
            .attr('d', line as any)
            .attr("transform", `translate(${marginLeft},${marginTop})`)
            .on("end", () => {
              d3.selectAll('circle')
              .transition()
              .duration(500)
              .style('opacity', 1);
            })
            .on("start", () => {
              d3.selectAll('circle')
              .style('opacity', 0);
            }),
    )

    // Tooltip
    const tooltip = container.append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .attr("class", "bg-white border-2 border-gray-300 rounded-md p-2 shadow-md absolute z-10 cursor-default")

    // Mouse events
    const mousemove = function(_e: MouseEvent, d: StationData) {
      tooltip
      .html("Température : " + d[currentMetrics] + "°C")
      .style("opacity", 1)
      .style("left", (x(new Date(d.date)) - 50) + "px")
      .style("top", ((y(d[currentMetrics])) + "px"))
    }

    const mouseleave = function() {
      tooltip
      .style("opacity", 0)
    }

    // Add circles
    svg.selectAll('circle')
      .data(stationData)
      .join(
        enter => enter.append('circle')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d[currentMetrics]))
        .attr('r', 4)
        .attr('fill', '#1a1e2e')
        .attr("transform", `translate(${marginLeft},${marginTop})`)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave),
      update => update
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d[currentMetrics]))
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave),
        exit => exit.remove()
      )
  }, [currentMetrics, height, localeFR, marginBottom, marginLeft, marginRight, marginTop, stationData, width, year]);

  const buttons : {label: string, value: MetricKey}[] = [
    {
      label: "Temp. minimale",
      value: "TN"
    },
    {
      label: "Temp. maximale",
      value: "TX"
    },
    {
      label: "Temp. moyenne",
      value: "TM"
    }
  ]

  const updateData = (value: MetricKey) => {
    setCurrentMetrics(value);
  }

  return (
    <>
      <h1 className={"font-semibold text-lg"}>
        <span className={"mr-2"}><FontAwesomeIcon icon={faTemperatureThreeQuarters}/></span>
        Température par mois en {year}
      </h1>
      <div className={"relative"} ref={containerRef}>
        <div className={"m-2"}>
          {buttons.map((button) => (
            <Button
              className={"cursor-pointer mr-2 text-sm"}
              variant={currentMetrics === button.value ? "default" : "secondary"}
              onClick={() => updateData(button.value)}
              key={button.value}
            >
              {button.label}
            </Button>
          ))}
        </div>

        <div className={"w-full overflow-y-scroll"}>
          <svg ref={refTemp}/>
        </div>
      </div>
    </>
  );
}