export type RefDiv = React.RefObject<HTMLDivElement | null>;
export const calculateDimensions = (containerRef: RefDiv, draggableRef: RefDiv) => {
  if (!containerRef.current || !draggableRef.current) return null;
  const containerRect = containerRef.current.getBoundingClientRect();
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

export const calculateYear = (startYear: number, endYear: number, containerRef: RefDiv, draggableRef: RefDiv) => {
  const dimensions = calculateDimensions(containerRef, draggableRef);
  if (!dimensions) return 0;

  const {containerStartX, containerEndX, draggableStartX, draggableEndX} = dimensions;
  const ratio = (draggableStartX - containerStartX) / (containerEndX - containerStartX - (draggableEndX - draggableStartX));

  return Math.min(Math.max(Math.round(ratio * (endYear - startYear) + startYear), startYear), endYear);
};