"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

import NodeLinkImporter from "./NodeLinkImporter";
import GraphViewer, { layouts } from "./GraphViewer";
import LayoutControls from "./LayoutControls";

export default function Page() {
  const [layout, setLayout] = useState<keyof typeof layouts>("cose");
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  const [showPanel, setShowPanel] = useState(true);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [selected, setSelected] = useState<{ id: string; label: string; content: string[] } | null>(null);

  const changeLayout = (l: keyof typeof layouts) => {
    setLayout(l);
    cy?.layout(layouts[l]).run();
  };
  const fit = () => cy?.fit();
  const zoomIn = () => cy && cy.zoom(cy.zoom() * 1.2);
  const zoomOut = () => cy && cy.zoom(cy.zoom() / 1.2);

  return (
    <div style={{ height: "95vh", width: "95vw", position: "relative" }}>
      {/* side-panel toggle */}
      <button
        onClick={() => setShowPanel((v) => !v)}
        style={toggleStyle}
        title={showPanel ? "Hide panel" : "Show panel"}
      >
        {showPanel ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* control panel */}
      {showPanel && (
        <div style={panelStyle}>
          <LayoutControls
            current={layout}
            onChange={changeLayout}
            onFit={fit}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />

          <hr style={{ margin: "10px 0" }} />

          <NodeLinkImporter onLoad={setElements} />
        </div>
      )}

      {/* graph */}
      {elements.length > 0 ? (
        <GraphViewer
          elements={elements}
          layout={layout}
          stylesheet={stylesheet}
          onCyInit={setCy}
          onNodeSelect={setSelected}
        />
      ) : (
        <Empty />
      )}

      {/* node detail */}
      {selected && (
        <div style={detailStyle}>
          <h3>{selected.label}</h3>
          {selected.content.length ? (
            <ul>{selected.content.map((c, i) => <li key={i}>{c}</li>)}</ul>
          ) : (
            <p style={{ fontStyle: "italic", color: "#6b7280" }}>Details not found.</p>
          )}
          <button onClick={() => setSelected(null)} style={closeBtn}>
            <EyeOff size={16} />
            Close
          </button>
        </div>
      )}
    </div>
  );
}

const Empty = () => (
  <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <p style={{ fontSize: 48, fontWeight: "bold" }}>No elements found.</p>
  </div>
);

// @ts-ignore
const stylesheet: cytoscape.Stylesheet[] = [
  { selector: "node", style: { "background-color": "#fff", "border-width": 1, "border-color": "#333", label: "data(label)", "text-wrap": "wrap", "text-valign": "center", "text-halign": "center", "text-max-width": "200px", "font-size": "12px", color: "#000", width: "label", height: "label", padding: "15px", shape: "round-rectangle" } },
  { selector: "node[primary]", style: { "background-color": "#f5f5f5", "border-color": "#000", "border-width": 2, "font-weight": "bold" } },
  { selector: "node:selected", style: { "border-color": "#000", "border-width": 3, "background-color": "#e0e0e0" } },
  { selector: "edge", style: { width: 2, "line-color": "#666", "target-arrow-color": "#666", "target-arrow-shape": "triangle", "curve-style": "bezier", "arrow-scale": 0.8 } }
];

const toggleStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 30,
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: 8,
  cursor: "pointer"
};

const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  left: 50,
  zIndex: 20,
  background: "#fff",
  padding: 12,
  borderRadius: 4,
  boxShadow: "0 2px 6px rgba(0,0,0,.1)",
  maxWidth: 340
};

const detailStyle: React.CSSProperties = {
  position: "absolute",
  top: "40%",
  right: 0,
  zIndex: 20,
  background: "#fff",
  padding: 15,
  borderRadius: 4,
  boxShadow: "0 2px 6px rgba(0,0,0,.1)",
  maxWidth: 300,
  overflowY: "auto",
  maxHeight: "80vh"
};

const closeBtn: React.CSSProperties = {
  marginTop: 10,
  padding: "5px 10px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4
};
