/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type { BubbleDef } from "./types";

let BubbleSets: any;
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const mod = require("cytoscape-bubblesets");
  BubbleSets = mod.default ?? mod;  
}
import COSEBilkent from "cytoscape-cose-bilkent";
import cola from "cytoscape-cola";
import dagre from "cytoscape-dagre";
import elk from "cytoscape-elk";
import klay from "cytoscape-klay";
import cytoscape from "cytoscape";


if (!(globalThis as any)[Symbol.for("cytoscapeExts")]) {
  (globalThis as any)[Symbol.for("cytoscapeExts")] = true;

  if (BubbleSets) cytoscape.use(BubbleSets);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(COSEBilkent);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(cola);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(dagre);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(elk);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(klay);
}


type Props = {
  elements: cytoscape.ElementDefinition[];
  layout: keyof typeof layouts;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-ignore
  stylesheet: cytoscape.Stylesheet[];
  onCyInit: (cy: cytoscape.Core) => void;
  onNodeSelect: (n: { id: string; label: string; content: string[] } | null) => void;
  bubbles?: BubbleDef[];
};
function drawBubbles(cy: cytoscape.Core, defs: BubbleDef[] | undefined) {
  if (!defs?.length) return;

  // @ts-ignore
  const bb = cy.bubbleSets();

  defs.forEach(def => {
    const nodeSet = cy.collection(def.nodes.map(id => cy.$id(id)));
    const edgeSet = def.edges
      ? cy.collection(def.edges.map(eid => cy.$id(eid)))
      : cy.collection();
    const path = bb.addPath(nodeSet, edgeSet, null, def.style);
    console.log(path);
  });
}

export const layouts = {
  'cose': { name: 'cose', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'breadthfirst': { name: 'breadthfirst', directed: true, animate: true, spacingFactor: 1.5 },
  'concentric': { name: 'concentric', animate: true, minNodeSpacing: 50 },
  'grid': { name: 'grid', animate: true, condense: true },
  'circle': { name: 'circle', animate: true },
  'random': { name: 'random', animate: true },
  'preset': { name: 'preset', animate: true },
  'null': { name: 'null', animate: false },
  'cose-bilkent': { name: 'cose-bilkent', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'cola': { name: 'cola', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'dagre': { name: 'dagre', directed: true, animate: true, spacingFactor: 1.5 },
  'elk': { name: 'elk', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'klay': { name: 'klay', animate: true, randomize: false, nodeDimensionsIncludeLabels: true }
} as const;

const GraphViewer: React.FC<Props> = ({ elements, layout, stylesheet, onCyInit, onNodeSelect, bubbles }) => {

  const handleCyInit = (cy: cytoscape.Core) => {
    if (!cy.scratch("_eventsBound")) {
      cy.on("tap", "node", (evt) => {
        const n = evt.target;
        onNodeSelect({
          id: n.id(),
          label: n.data("label"),
          content: n.data("content") ?? []
        });
      });
      cy.on("tap", (evt) => {
        if (evt.target === cy) onNodeSelect(null);
      });
      cy.scratch("_eventsBound", true);
    }

    drawBubbles(cy, bubbles);

    onCyInit(cy);
  };
  
  useEffect(() => {
    // no-op: this is just to ensure styles reloaded when hot-reloading

  }, [stylesheet]);

  return (
    <CytoscapeComponent
      // @ts-ignore
      elements={elements}
      stylesheet={stylesheet}
      style={{ width: "100%", height: "100%" }}
      layout={layouts[layout]}
      cy={(cy) => handleCyInit(cy as unknown as cytoscape.Core)}
      boxSelectionEnabled={true}
      wheelSensitivity={0.3}
    />
  );
};

export default GraphViewer;
