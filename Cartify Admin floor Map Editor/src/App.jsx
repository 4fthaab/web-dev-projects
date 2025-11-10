// src/App.jsx
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import GridCanvas from "./components/GridCanvas";
import RackModal from "./components/RackModal";

export default function App() {
  const FEET_PER_CELL = 3;
  const [storeArea, setStoreArea] = useState({ lengthFt: 75, widthFt: 60 }); // default area
  const [racks, setRacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);

  const lengthRef = useRef(storeArea.lengthFt);
  const widthRef = useRef(storeArea.widthFt);

  /** --------------------------
   *  GRID CALCULATION
   *  -------------------------- */
  const gridSize = {
    length: Math.ceil(storeArea.lengthFt / FEET_PER_CELL),
    width: Math.ceil(storeArea.widthFt / FEET_PER_CELL),
    cellSizePx: 1,
  };

  /** --------------------------
   *  HELPERS
   *  -------------------------- */
  const getRackSize = (orientation, totalColumns) => {
    const depthCells = 1; // rack thickness = 1 block (≈3 ft)
    if (orientation === "horizontal")
      return { w: totalColumns, h: depthCells };
    else return { w: depthCells, h: totalColumns };
  };

  /** --------------------------
   *  RACK ACTIONS
   *  -------------------------- */
  const createRack = () => {
    const id = `rack-${uuidv4().slice(0, 8)}`;
    const defaultCols = 10;
    const orientation = "horizontal";
    const { w, h } = getRackSize(orientation, defaultCols);

    const newRack = {
      rack_id: id,
      name: `Rack ${racks.length + 1}`,
      x: 0,
      y: 0,
      w,
      h,
      meta: {
        total_columns: defaultCols,
        orientation,
        numbering_type: "odd",
        category: "",
        color: "#FEE2E2",
      },
    };
    setRacks((prev) => [...prev, newRack]);
    setEditing(newRack);
    setShowModal(true);
  };

  const updateRack = (updated) => {
    setRacks((prev) =>
      prev.map((r) => (r.rack_id === updated.rack_id ? { ...r, ...updated } : r))
    );
  };

  const saveMeta = (meta) => {
    const { w, h } = getRackSize(meta.orientation, meta.total_columns);
    setRacks((prev) =>
      prev.map((r) =>
        r.rack_id === meta.rack_id
          ? { ...r, name: meta.name, w, h, meta }
          : r
      )
    );
    setShowModal(false);
  };

  const deleteRack = (rack_id) => {
    setRacks((prev) => prev.filter((r) => r.rack_id !== rack_id));
    setShowModal(false);
  };

  /** --------------------------
   *  FILE IMPORT / EXPORT
   *  -------------------------- */
  const exportJSON = () => {
    const out = {
      store_id: "STORE001",
      floor_area: {
        length_ft: storeArea.lengthFt,
        width_ft: storeArea.widthFt,
        feet_per_cell: FEET_PER_CELL,
      },
      racks: racks.map((r) => ({
        rack_id: r.rack_id,
        name: r.name,
        x: r.x,
        y: r.y,
        w: r.w,
        h: r.h,
        meta: r.meta,
      })),
      last_updated: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "store-layout.json";
    a.click();
  };

  const importJSON = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.floor_area || !data.racks) {
          alert("Invalid layout JSON");
          return;
        }
        setStoreArea({
          lengthFt: data.floor_area.length_ft,
          widthFt: data.floor_area.width_ft,
        });
        const imported = data.racks.map((r) => ({
          rack_id: r.rack_id || `rack-${uuidv4().slice(0, 8)}`,
          name: r.name || r.rack_id,
          x: r.x ?? 0,
          y: r.y ?? 0,
          w: r.w ?? 3,
          h: r.h ?? 1,
          meta: r.meta || {},
        }));
        setRacks(imported);
      } catch (err) {
        alert(err.message || "Failed to parse JSON");
      }
    };
    reader.readAsText(f);
  };

  /** --------------------------
   *  AREA APPLY
   *  -------------------------- */
  const applyArea = () => {
    const l = Number(lengthRef.current.value || storeArea.lengthFt);
    const w = Number(widthRef.current.value || storeArea.widthFt);
    if (l < 15 || w < 15) {
      alert("Minimum store size must be at least 15×15 ft");
      return;
    }
    setStoreArea({ lengthFt: l, widthFt: w });
  };

  /** --------------------------
   *  RENDER
   *  -------------------------- */
  return (
    <div className="p-4">
      {/* Control Bar */}
      <div className="flex gap-3 mb-4 items-end flex-wrap">
        <div>
          <label className="block text-sm">Store Length (ft)</label>
          <input
            ref={lengthRef}
            defaultValue={storeArea.lengthFt}
            className="border p-1 w-24"
          />
        </div>
        <div>
          <label className="block text-sm">Store Width (ft)</label>
          <input
            ref={widthRef}
            defaultValue={storeArea.widthFt}
            className="border p-1 w-24"
          />
        </div>

        <button
          onClick={applyArea}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          Apply Area
        </button>

        <button
          onClick={createRack}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add Rack
        </button>

        <button
          onClick={exportJSON}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Export JSON
        </button>

        <label className="px-3 py-1 bg-orange-500 text-white rounded cursor-pointer">
          Import JSON
          <input
            type="file"
            accept="application/json"
            onChange={importJSON}
            className="hidden"
          />
        </label>
      </div>

      <div
        style={{
          width: "100%",
          height: "calc(100vh - 120px)",
          overflow: "hidden",
        }}
      >
        <GridCanvas
          grid={gridSize}
          racks={racks}
          selectedId={selected}
          onSelectRack={(id) => {
            const rack = racks.find((r) => r.rack_id === id);
            setEditing(rack);
            setShowModal(true);
            setSelected(id);
          }}
          onUpdateRack={(r) => updateRack(r)}
        />
      </div>

      {/* Modal */}
      {showModal && editing && (
        <RackModal
          initial={{
            ...editing.meta,
            rack_id: editing.rack_id,
            name: editing.name,
          }}
          onClose={() => setShowModal(false)}
          onSave={saveMeta}
          onDelete={() => deleteRack(editing.rack_id)}
        />
      )}
    </div>
  );
}
