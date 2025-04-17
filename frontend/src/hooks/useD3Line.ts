import {useEffect, useState} from "react";
import * as d3 from "d3";
import {localeFR} from "../lib/utils.ts";
import {BaseType, NumberValue} from "d3";
import {FilterStationDataValue} from "../components/map/station/CardStation.tsx";
import {getLinearRegression, ResLinearRegression} from "../api/linearRegressionApi.ts";

export const useD3Line = (stationData: FilterStationDataValue[] | null,
                          refSvg: React.RefObject<SVGSVGElement | null>,
                          tooltip: d3.Selection<BaseType, unknown, HTMLElement, any>,
                          updateTooltip: (temp: number, date: Date) => void,
                          width: number, height: number,
                          marginLeft: number, marginRight: number, marginTop: number, marginBottom: number,
                          startAvailableYear: number, endAvailableYear: number,
                          colorLine: string,
                          offsetY: number | undefined) => {
  const [linearRes, setLinearRes] = useState<ResLinearRegression | null>(null);

  useEffect( () => {
    if (!stationData || !refSvg.current) return;

    // CREATE SVG
    const svg = d3.select(refSvg.current)
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom)

    // Remove old d3 elements
    svg.selectAll('g').remove();

    // Create x axis
    const x = d3.scaleTime()
    .domain([new Date(startAvailableYear, 0, 1), new Date(endAvailableYear + 1, 0, 1)])
    .range([0, width]);
    const xAxis = d3.axisBottom(x)
    .ticks(d3.timeYear.every(endAvailableYear - startAvailableYear > 50 ? 2 : 1))
    .tickFormat(localeFR.format("%Y") as (domainValue: Date | NumberValue, index: number) => string )
    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${marginLeft},${height + marginTop})`)
    .call(xAxis);
    svg.selectAll("g.x-axis text")
    .attr("transform", "rotate(-50)")
    .style("text-anchor", "end")
    // Create y axis
    const y = d3.scaleLinear()
    .domain([
      d3.min(stationData, d => d.value) as number - 0.5,
      d3.max(stationData, d => d.value) as number + 0.5 + (offsetY || 0)
    ])
    .range([height, 0]);
    const yAxis = d3.axisLeft(y);
    svg.append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`)
    .call(yAxis);

    // Lines
    const line = d3.line<FilterStationDataValue>()
    .x(d => x(d.date))
    .y(d => y(d.value));

    // Add line to svg
    svg
    .selectAll('.line')
    .data([stationData], d => (d as FilterStationDataValue).id)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', colorLine)
    .attr('stroke-width', 1.5)
    .attr('d', line as any)
    .attr("transform", `translate(${marginLeft},${marginTop})`)
    .attr("class", "line")


    // Mouse events
    const mousemove = function(_e: MouseEvent, d: FilterStationDataValue) {
      updateTooltip(d.value, d.date);
    }

    // Add circles
    svg.selectAll('circle')
    .data(stationData)
    .enter()
    .append('circle')
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.value))
    .attr('r', 4)
    .attr('fill', colorLine)
    .attr("transform", `translate(${marginLeft},${marginTop})`)
    .on("mousemove", mousemove)

    // Add Linear Regression
    getLinearRegression(stationData).then((res) => {
      setLinearRes(res);
      const xMinDate = x.domain()[0];
      const yMinDate = x.domain()[1];
      const xMin = xMinDate.getTime();
      const xMax = yMinDate.getTime();
      const yMin = res.a * xMin + res.b;
      const yMax = res.a * xMax + res.b;
      svg.append("line")
      .attr("x1", x(xMinDate) + marginLeft)
      .attr("y1", y(yMin) + marginTop)
      .attr("x2", x(yMinDate) + marginLeft)
      .attr("y2", y(yMax) + marginTop)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    })

  }, [stationData, refSvg]);

  return {
    linearRes
  }
}