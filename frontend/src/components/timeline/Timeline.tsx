import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {setYear as setYearSlice} from "../../stores/TimelineSlice.ts";
import {DashLine} from "./DashLine.tsx";
import {AvailableZone} from "./AvailableZone.tsx";
import {useHandleMouseTimeline} from "../../hooks/useHandleMouseTimeline.ts";
import {calculateYear} from "../../helper/helperTimeline.ts";

export function Timeline() {
  const dispatch = useDispatch();
  const timeline = useSelector((state: any) => state.timeline);
  const map = useSelector((state: any) => state.map);
  const draggableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYear = 1950;
  const endYear = 2025;
  const handleMouse = useHandleMouseTimeline(startYear, endYear, containerRef, draggableRef)
  const {handleMovementMouse, handleMovementTouch, handleMovementStart, handleMovementStop, handleClick} = handleMouse;

  useEffect(() => {
    if (!containerRef.current || !draggableRef.current || !timeline.startAvailableYear || !timeline.endAvailableYear) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const leftX = (timeline.startAvailableYear - startYear) * (containerRect.width / (endYear - startYear)) - (draggableRef.current.offsetWidth / 2);
    if (leftX < 0 || timeline.startAvailableYear === timeline.year) {
      draggableRef.current.style.left = `0px`;
      dispatch(setYearSlice(startYear));
      return;
    }
    console.log("leftX", leftX);
    draggableRef.current.style.left = `${leftX}px`;
    dispatch(setYearSlice(calculateYear(startYear, endYear, containerRef, draggableRef)));

  }, [containerRef, timeline.startAvailableYear, timeline.endAvailableYear, map.stationId]);

  useEffect(() => {
    const calculateYearResult = calculateYear(startYear, endYear, containerRef, draggableRef);
    console.log("Year", calculateYearResult)
    dispatch(setYearSlice(calculateYearResult));
  }, [startYear, endYear, containerRef, draggableRef, dispatch]);

  return (
    <div className={"w-full bg-primary h-22 flex items-center justify-center p-2"}>
      <div className={"w-full h-12 bg-timeline-bg flex items-center rounded-full relative cursor-pointer"}
           ref={containerRef}

           onMouseMove={handleMovementMouse}
           onTouchMove={handleMovementTouch}

           onMouseLeave={handleMovementStop}
           onTouchEnd={handleMovementStop}
           onMouseUp={handleClick}
      >
        <p className={"absolute left-4 top-1/4 text-white"}>{startYear}</p>

        <div className={"w-14 h-14 absolute left-0 bg-timeline-round z-10 " +
          "rounded-full flex items-center justify-center text-md text-white cursor-pointer select-none"}
             ref={draggableRef}
             onMouseDown={handleMovementStart}
             onMouseUp={handleMovementStop}
             onTouchStart={handleMovementStart}
              onTouchEnd={handleMovementStop}
        >
          {timeline.year}
        </div>

        <DashLine containerRef={containerRef}/>
        <AvailableZone
          containerRef={containerRef}
          draggableRef={draggableRef}
          startYear={startYear}
          endYear={endYear}
          startAvailableYear={timeline.startAvailableYear}
          endAvailableYear={timeline.endAvailableYear}
        />

        <p className={"absolute right-4 top-1/4 text-white"}>{endYear}</p>
      </div>
    </div>
  )
}