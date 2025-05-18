// convertToCytoscape.ts
import type { NodeLinkGraph } from "./types";

export function convertToCytoscapeElements(
  graph: NodeLinkGraph
): cytoscape.ElementDefinition[] {
  /* ---------- Nodes ---------- */
  const nodeElements: cytoscape.ElementDefinition[] = graph.nodes.map((n) => ({
    data: {
      id: n.id,
      label: n.label ?? n.id,
      primary: n.primary ?? false,
      content: n.content ?? []
    }
  }));

  /* ---------- Edges ---------- */
  const edgeElements: cytoscape.ElementDefinition[] = graph.links.map((l) => ({
    data: {
      id: `e-${l.source}-${l.target}`, // ← e-A-B 形式
      source: l.source,
      target: l.target,
      label: l.label ?? ""
    }
  }));

  return [...nodeElements, ...edgeElements];
}
