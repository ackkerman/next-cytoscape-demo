"use client";
import React, { useState, ChangeEvent } from "react";
import { convertToCytoscapeElements } from "./convertToCytoscape";
import type { NodeLinkGraph } from "./convertToCytoscape";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";

type Props = {
  /** 変換後 elements を親へ渡す */
  onLoad: (els: cytoscape.ElementDefinition[]) => void;
};

const defaultJson = `{
  "nodes": [
    { "id": "A", "label": "Root", "primary": true },
    { "id": "B", "label": "Child 1" },
    { "id": "C", "label": "Child 2", "content": ["bullet 1", "bullet 2"] }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" }
  ]
}`

/**
 * node-link 形式(JSON) → Cytoscape elements へ変換し
 * 親から受け取った onLoad() に渡す UI
 */
const NodeLinkImporter: React.FC<Props> = ({ onLoad }) => {
  const [raw, setRaw] = useState<string>(defaultJson);

  /** JSON → elements 変換 → 親へ通知 */  
  const handleImport = () => {
    try {
      const graph: NodeLinkGraph = JSON.parse(raw);
      const elements = convertToCytoscapeElements(graph);
      onLoad(elements);
    } catch (err) {
      alert("⚠️ JSON の構文が正しくありません");
    }
  };

  /** JSON ファイルを選択して読み込む場合 */
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRaw(text);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "12px",
        borderRadius: 4,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: 360,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>Graph JSON Import</h3>

      <Editor
        value={raw}
        onValueChange={setRaw}
        highlight={(code) => highlight(code, languages.json, "json")}
        padding={10}
        textareaId="json-editor"
        style={{
          fontFamily: "monospace",
          fontSize: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 4,
          minHeight: 150,
          overflowY: "auto",
        }}
      />

      <input
        type="file"
        accept="application/json"
        onChange={handleFile}
        style={{ marginTop: 8 }}
      />

      <button
        onClick={handleImport}
        style={{
          marginTop: 8,
          width: "100%",
          padding: "6px 0",
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Import &amp; Draw
      </button>
    </div>
  );
};

export default NodeLinkImporter;