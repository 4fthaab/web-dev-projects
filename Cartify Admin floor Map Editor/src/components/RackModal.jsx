// ...existing code...
import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function RackModal({ initial, onSave, onClose, onDelete }) {
  const [form, setForm] = useState(initial || { rack_id: `tmp-${Date.now()}`, name: "", total_columns: 10, orientation: "horizontal", numbering_type: "odd", row_number: 1, category: "", color: "#FEE2E2" });

  const handle = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = () => {
    if (!form.name) { alert("Give a rack name"); return; }
    if (form.total_columns < 1 || form.total_columns > 100) { alert("Columns must be 1-100"); return; }
    onSave(form);
  };

  return (
    <Modal isOpen onRequestClose={onClose} contentLabel="Edit Rack" className="max-w-lg mx-auto mt-20 bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Edit Rack</h2>
      <div className="space-y-2">
        <label className="block">
          <div className="text-sm">Rack Name</div>
          <input value={form.name} onChange={e => handle("name", e.target.value)} className="w-full border p-1"/>
        </label>
        <div className="flex">
          <label className="flex-1">
            <div className="text-sm">Category</div>
            <input value={form.category} onChange={e => handle("category", e.target.value)} className="w-full border p-1"/>
          </label>
          <label className="flex-1">
            <div className="text-sm">Color</div>
            <input type="color" value={form.color || "#FEE2E2"} onChange={e => handle("color", e.target.value)} className="w-full h-9 border"/>
          </label>
        </div>
        <div className="flex">
          <label className="flex-1">
            <div className="text-sm">Total Columns</div>
            <input type="number" value={form.total_columns} onChange={e => handle("total_columns", Number(e.target.value))} className="w-full border p-1"/>
          </label>
        </div>

        <div className="flex gap-2">
          <label className="flex-1">
            <div className="text-sm">Orientation</div>
            <select value={form.orientation} onChange={e => handle("orientation", e.target.value)} className="w-full border p-1">
              <option value="horizontal">horizontal</option>
              <option value="vertical">vertical</option>
            </select>
          </label>

          <label className="flex-1">
            <div className="text-sm">Numbering Type</div>
            <select value={form.numbering_type} onChange={e => handle("numbering_type", e.target.value)} className="w-full border p-1">
              <option value="odd">odd</option>
              <option value="even">even</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => {
            if (window.confirm("Delete this rack?")) {
              if (typeof onDelete === "function") onDelete();
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
