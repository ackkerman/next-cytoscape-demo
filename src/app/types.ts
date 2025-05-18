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
  label?: string;
};

export type NodeLinkGraph = {
  nodes: Node[];
  links: Link[];
  bubbles?: BubbleDef[]; 
};

export type BubbleDef = {
  id: string;
  nodes: string[];
  edges?: string[];
  label?: string;
  style?: { color?: string; opacity?: number; padding?: number };
};

