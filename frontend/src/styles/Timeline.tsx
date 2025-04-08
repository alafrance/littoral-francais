import React, { useState, useRef, useEffect } from "react";

interface TimelineProps {
  year: number;
  setYear: (year: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ year, setYear }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const MIN_YEAR = 1800;
  const MAX_YEAR = 2100;

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    let newX = e.clientX - rect.left;
    newX = Math.max(0, Math.min(newX, rect.width));
    const percent = newX / rect.width;
    const newYear = Math.round(MIN_YEAR + percent * (MAX_YEAR - MIN_YEAR));
    setYear(newYear);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const getLeftPosition = () => {
    if (!trackRef.current) return "0%";
    const percent = (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR);
    return `${percent * 100}%`;
  };

  return (
    <div className="relative w-[1200px] h-[200px] mt-12">
      {/* Timeline track */}
      <div
        ref={trackRef}
        className="absolute top-1/2 left-0 right-0 h-[50px] -translate-y-1/2 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 rounded-md"
      />

      {/* Draggable ellipse */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute flex items-center justify-center font-bold text-white border-4 border-white rounded-full cursor-pointer"
        style={{
          backgroundColor: "#926E43",
          width: "65px",
          height: "65px",
          left: getLeftPosition(),
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {year}
      </div>

      {/* Start and End years */}
      <div className="absolute bottom-0 left-0 text-sm font-semibold text-gray-700">1800</div>
      <div className="absolute bottom-0 right-0 text-sm font-semibold text-gray-700">2100</div>
    </div>
  );
};

export default Timeline;
