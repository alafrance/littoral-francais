import {MouseEvent, useState} from "react";
import {calculateDimensions, calculateYear, RefDiv} from "../helper/helperTimeline.ts";
import {useDispatch} from "react-redux";
import {setYear as setYearSlice} from "../stores/TimelineSlice.ts";

export function useHandleMouseTimeline(startYear: number, endYear: number, containerRef: RefDiv, draggableRef: RefDiv) {
  const [isMoving, setIsMoving] = useState(false);
  const dispatch = useDispatch();
  const setYear = (year: number) => {
    dispatch(setYearSlice(year));
  }

  const handleMovementMouse = (event: MouseEvent) => {
    const x = event.clientX;
    if (!isMoving) return;

    handleMovementMove(x)
  }
  const handleMovementTouch = (event: any) => {
    const x = event.touches[0].clientX;
    if (!isMoving) return;

    handleMovementMove(x)
  }
  const handleMovementMove = (x: number) => {

    const dimensions = calculateDimensions(containerRef, draggableRef);
    if (!dimensions) return;
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
    setYear(calculateYear(startYear, endYear, containerRef, draggableRef));


  }
  const handleMovementStart = () => {
    setIsMoving(true);
  }

  const handleMovementStop = () => {
    setIsMoving(false);
    const newYear = calculateYear(startYear, endYear, containerRef, draggableRef);
    setYear(newYear);
  }

  const handleClick = (event: MouseEvent) => {
    const x = event.clientX;

    handleMovementMove(x);
  }
  return {
    handleMovementMouse,
    handleMovementTouch,
    handleMovementStart,
    handleMovementStop,
    handleClick,
    isMoving
  }
}