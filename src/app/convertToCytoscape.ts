// convertToCytoscape.ts
export type Node = {
  /** ユニーク ID (必須) */
  id: string;
  label?: string;
  /** トップレベル章見出しなど ― true なら太字枠線用 */
  primary?: boolean;
  /** 箇条書き本文 */
  content?: string[];
};

export type Link = {
  source: string;
  target: string;
};

export type NodeLinkGraph = {
  nodes: Node[];
  links: Link[];
};

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
      target: l.target
    }
  }));

  return [...nodeElements, ...edgeElements];
}
