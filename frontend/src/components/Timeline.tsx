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
    const dimensions = calculateDimensions();
    const {containerStartX, containerEndX, draggableCenterX} = dimensions;
    const ratio = (draggableCenterX - containerStartX) / (containerEndX - containerStartX);

    const currentYear = Math.round(ratio * (endYear - startYear) + startYear);
    return currentYear;
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
    console.log(leftX);
    const sizeContainer = containerEndX - containerStartX;
    if (leftX < 0 || leftX > sizeContainer) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    draggableRef.current.style.left = `${leftX}px`;
    setYear(calculateYear());

    // const clampedRatio = Math.min(1, Math.max(0, positionDraggable));
    // const maxLeft = draggableEndX - draggableStartX ;
    // const leftX = clampedRatio * (containerEndX - containerStartX) + containerStartX;
    // console.log(leftX);
    // draggableRef.current.style.left = `${100}px`;
    // draggableRef.current.style.transform = `translateX(${x}px)`;
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
    <div className={"w-full bg-primary h-22 bottom-0 left-0 flex items-center justify-center p-2"}
         ref={containerRef}

         onMouseMove={handleMovementMouse}
         onTouchMove={handleMovementTouch}

         onMouseLeave={handleMovementStop}
         onTouchEnd={handleMovementStop}


    >
      <div className={"w-full h-12 bg-timeline-bg flex items-center rounded-full relative"}>
        <p className={"absolute left-4 top-1/4 text-white"}>{startYear}</p>
        <div className={"w-14 h-14 absolute left-0 bg-timeline-round z-10 border-white border-2 " +
          "rounded-full flex items-center justify-center text-md text-white cursor-pointer select-none"}
             ref={draggableRef}
             onMouseDown={handleMovementStart}
             onTouchStart={handleMovementStart}
        >
          {year}
        </div>
        <p className={"absolute right-4 top-1/4 text-white"}>{endYear}</p>
      </div>
    </div>
  )
}