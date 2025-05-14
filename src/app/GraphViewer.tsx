"use client";
import React, { useEffect } from "react";
import Cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";

// @ts-ignore
import COSEBilkent from "cytoscape-cose-bilkent";
// @ts-ignore
import cola from "cytoscape-cola";
// @ts-ignore
import dagre from "cytoscape-dagre";
// @ts-ignore
import elk from "cytoscape-elk";
// @ts-ignore
import klay from "cytoscape-klay";

Cytoscape.use(COSEBilkent);
Cytoscape.use(cola);
// @ts-ignore
Cytoscape.use(dagre);
Cytoscape.use(elk);
Cytoscape.use(klay);

type Props = {
  elements: cytoscape.ElementDefinition[];
  layout: keyof typeof layouts;
  // @ts-ignore
  stylesheet: cytoscape.Stylesheet[];
  onCyInit: (cy: cytoscape.Core) => void;
  onNodeSelect: (n: { id: string; label: string; content: string[] } | null) => void;
};

export const layouts: Record<string, any> = {
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
};

const GraphViewer: React.FC<Props> = ({ elements, layout, stylesheet, onCyInit, onNodeSelect }) => {
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
      cy={(cy) => {
        // 初回のみイベント登録
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
        onCyInit(cy);
      }}
      boxSelectionEnabled={true}
      wheelSensitivity={0.3}
    />
  );
};

export default GraphViewer;
