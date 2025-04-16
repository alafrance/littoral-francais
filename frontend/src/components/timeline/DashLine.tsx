import {useEffect, useState} from "react";

export function DashLine({containerRef}: {containerRef: React.RefObject<HTMLDivElement | null>}) {
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const spacing = 20;

    const lines = [];

    for (let x = -svgSize.height; x < svgSize.width; x += spacing) {
        lines.push(
          <line
            key={x}
            x1={x}
            y1={svgSize.height}
            x2={x + svgSize.height}
            y2={0}
            stroke="white"
            strokeWidth={2}
          />
        );
    }

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setSvgSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [containerRef]);
    return (
        <div className={"relative w-full rounded-full h-12 overflow-hidden"}>
            <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            width={svgSize.width}
            height={svgSize.height}
            xmlns="http://www.w3.org/2000/svg"
            >
                {lines}
            </svg>
        </div>
    )
}