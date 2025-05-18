"use client";
import React from "react";
import { 
  LayoutGrid, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  Eye, 
  EyeOff
} from "lucide-react";
import { layouts } from "./GraphViewer";

type Props = {
  current: keyof typeof layouts;
  onChange: (l: keyof typeof layouts) => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;

  showEdgeLabels: boolean;
  showNodeLabels: boolean;
  showNodeBubbles: boolean;
  onToggleEdgeLabels: () => void;
  onToggleNodeLabels: () => void;
  onToggleNodeBubbles: () => void;
};

const LayoutButton = ({
  name,
  current,
  onClick
}: {
  name: keyof typeof layouts;
  current: string;
  onClick: (n: keyof typeof layouts) => void;
}) => (
  <button
    onClick={() => onClick(name)}
    style={{
      padding: "4px 8px",
      background: current === name ? "#3b82f6" : "#e5e7eb",
      color: current === name ? "#fff" : "#000",
      border: "none",
      borderRadius: 4,
      cursor: "pointer"
    }}
  >
    {name}
  </button>
);

const ToggleButton: React.FC<{
  label: string;
  active: boolean;
  onToggle: () => void;
}> = ({ label, active, onToggle }) => (
  <button onClick={onToggle} style={toggleBtnStyle(active)}>
    {active ? <Eye size={16} /> : <EyeOff size={16} />}
    {label}
  </button>
);

export const LayoutControls: React.FC<Props> = ({
  current,
  onChange,
  onFit,
  onZoomIn,
  onZoomOut,
  showEdgeLabels,
  showNodeLabels,
  showNodeBubbles,
  onToggleEdgeLabels,
  onToggleNodeLabels,
  onToggleNodeBubbles,
}) => (
  <>
    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
      <LayoutGrid size={18} />
      Layout Controls
    </h3>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
      {Object.keys(layouts).map((l) => (
        <LayoutButton key={l} name={l as keyof typeof layouts} current={current} onClick={onChange} />
      ))}
    </div>

    {/* Zoom to fit */}
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={onFit} style={btnStyle}>
        <RefreshCw size={16} />
        Fit
      </button>
      <button onClick={onZoomIn} style={btnStyle}>
        <ZoomIn size={16} />
      </button>
      <button onClick={onZoomOut} style={btnStyle}>
        <ZoomOut size={16} />
      </button>
    </div>

    {/* View toggles */}
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <ToggleButton label="Edge Labels" active={showEdgeLabels} onToggle={onToggleEdgeLabels} />
      <ToggleButton label="Node Labels" active={showNodeLabels} onToggle={onToggleNodeLabels} />
      <ToggleButton label="Bubbles" active={showNodeBubbles} onToggle={onToggleNodeBubbles} />
    </div>
  </>
);

const btnStyle: React.CSSProperties = {
  padding: "4px 10px",
  background: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4
};

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: "4px 10px",
  background: active ? "#10b981" : "#9ca3af",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 4,
});

export default LayoutControls;
