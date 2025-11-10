// src/components/GridCanvas.jsx
import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Group, Text } from "react-konva";

export default function GridCanvas({
  grid,
  racks,
  onUpdateRack,
  onSelectRack,
  selectedId,
}) {
  const containerRef = useRef();
  const [stageSize, setStageSize] = useState({
    w: 800,
    h: 600,
    cell: grid.cellSizePx,
  });

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;

      // Fill full width, scroll vertically if needed
      const cellW = cw / grid.length; // each column fits exactly
      const totalH = grid.width * cellW; // height may overflow

      setStageSize({ w: cw, h: totalH, cell: cellW });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [grid.length, grid.width]);

  const toPx = (cell) => cell * stageSize.cell;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflowY: "scroll", // vertical scroll only
        overflowX: "hidden", // lock horizontal scroll
        background: "#fafafa",
      }}
    >
      <Stage
        width={stageSize.w}
        height={stageSize.h}
        style={{
          background: "#fafafa",
          border: "1px solid #ddd",
        }}
      >
        <Layer>
          {/* grid lines */}
          {Array.from({ length: grid.length + 1 }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={i * stageSize.cell}
              y={0}
              width={1}
              height={toPx(grid.width)}
              fill="#eee"
            />
          ))}
          {Array.from({ length: grid.width + 1 }).map((_, j) => (
            <Rect
              key={`h-${j}`}
              x={0}
              y={j * stageSize.cell}
              width={toPx(grid.length)}
              height={1}
              fill="#eee"
            />
          ))}

          {/* racks */}
          {racks.map((r) => {
            const pxX = toPx(r.x);
            const pxY = toPx(r.y);
            const pxW = toPx(r.w);
            const pxH = toPx(r.h);
            const selected = selectedId === r.rack_id;

            return (
              <Group
                key={r.rack_id}
                x={pxX}
                y={pxY}
                draggable
                onClick={() => onSelectRack(r.rack_id)}
                onDragEnd={(e) => {
                  const newX = Math.round(e.target.x() / stageSize.cell);
                  const newY = Math.round(e.target.y() / stageSize.cell);
                  onUpdateRack({ ...r, x: newX, y: newY });
                }}
              >
                <Rect
                  width={pxW}
                  height={pxH}
                  fill={r.meta?.color || "#ffdede"}
                  stroke={selected ? "#333" : "#bbb"}
                  strokeWidth={selected ? 3 : 1}
                  cornerRadius={3}
                />
                <Text
                  text={r.name}
                  x={4}
                  y={4}
                  fontSize={Math.max(10, stageSize.cell / 2.5)}
                  fill="#111"
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
