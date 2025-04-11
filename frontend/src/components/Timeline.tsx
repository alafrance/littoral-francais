import {useDispatch, useSelector} from "react-redux";
import {MouseEvent, useEffect, useRef, useState} from "react";
import {setYear as setYearSlice} from "../stores/TimelineSlice.ts";

export function Timeline() {
  const dispatch = useDispatch();
  const year = useSelector((state: any) => state.timeline.year);
  const setYear = (year: number) => {
    dispatch(setYearSlice(year));
  }

  const draggableRef = useRef(null);
  const containerRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const startYear = 1900;
  const endYear = 2025;
  const calculateYear = () => {
    // if (!startX) {
    //   setStartX()
    // }
    const dimensions = calculateDimensions();
    const {containerStartX, containerEndX, draggableStartX, draggableEndX} = dimensions;
    const ratio = (draggableStartX - containerStartX) / (containerEndX - containerStartX - (draggableEndX - draggableStartX));

    return Math.min(Math.max(Math.round(ratio * (endYear - startYear) + startYear), startYear), endYear);
  };

  useEffect(() => {
    setYear(calculateYear());
  }, []);



  const calculateDimensions = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const containerRect = containerRef.current.getBoundingClientRect();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const draggableRect = draggableRef.current.getBoundingClientRect();

    const containerStartX = containerRect.left;
    const containerEndX = containerRect.right;

    const draggableStartX = draggableRect.left;
    const draggableEndX = draggableRect.right;
    const draggableCenterX = draggableStartX + (draggableEndX - draggableStartX) / 2;

    return {
      containerStartX,
      containerEndX,
      draggableStartX,
      draggableEndX,
      draggableCenterX,
    }
  }

  const handleMovementMouse = (event: MouseEvent) => {
    const x = event.clientX;
    handleMovementMove(x)
  }
  const handleMovementTouch = (event: any) => {
    const x = event.touches[0].clientX;

    handleMovementMove(x)
  }
  const handleMovementMove = (x: number) => {
    if (!isMoving) return;

    const dimensions = calculateDimensions();
    const {containerStartX, containerEndX, draggableStartX, draggableEndX} = dimensions;
    const size = x - containerStartX;
    const leftX = size - ((draggableEndX - draggableStartX) / 2)

    if (leftX < 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      draggableRef.current.style.left = `0px`;
      setYear(startYear);
      return;
    }
    if (leftX > (containerEndX - containerStartX - (draggableEndX - draggableStartX))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      draggableRef.current.style.left = `${containerEndX - containerStartX - (draggableEndX - draggableStartX)}px`;
      setYear(endYear);
      return ;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    draggableRef.current.style.left = `${leftX}px`;
    setYear(calculateYear());


  }
  const handleMovementStart = () => {
    setIsMoving(true);
  }

  const handleMovementStop = () => {
    setIsMoving(false);
    const newYear = calculateYear();
    setYear(newYear);
  }

  return (
    <div className={"w-full bg-primary h-22 flex items-center justify-center p-2"}
    >
      <div className={"w-full h-12 bg-timeline-bg flex items-center rounded-full relative"}
           ref={containerRef}

           onMouseMove={handleMovementMouse}
           onTouchMove={handleMovementTouch}

           onMouseLeave={handleMovementStop}
           onTouchEnd={handleMovementStop}
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
          {year}
        </div>
        <p className={"absolute right-4 top-1/4 text-white"}>{endYear}</p>
      </div>
    </div>
  )
}