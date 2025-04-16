import {useEffect, useRef} from "react";
import {RefDiv} from "../../helper/helperTimeline.ts";

export function AvailableZone({containerRef, draggableRef, startYear, endYear, startAvailableYear, endAvailableYear}:
                                {containerRef: RefDiv, draggableRef: RefDiv, startYear: number, endYear: number,
                                  startAvailableYear: number | null, endAvailableYear: number | null}) {
  const availableZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!availableZoneRef.current || !containerRef.current || !startAvailableYear || !endAvailableYear || !draggableRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const leftX = (startAvailableYear - startYear) * (containerRect.width / (endYear - startYear));
    const width = (endAvailableYear - startAvailableYear) * (containerRect.width / (endYear - startYear));

    availableZoneRef.current.style.left = `${leftX}px`;
    availableZoneRef.current.style.width = `${width}px`;
    if (endYear === endAvailableYear) {
      availableZoneRef.current.className = "rounded-r-full " + availableZoneRef.current.className;
    }
    if (startYear === startAvailableYear) {
      availableZoneRef.current.className = "rounded-l-full " + availableZoneRef.current.className;
    }

  }, [containerRef, startAvailableYear, startYear, endAvailableYear, endYear, draggableRef]);
  return (
    <div className={"h-12 absolute top-0 bg-timeline-bg"}
         ref={availableZoneRef}
    />
  )
}