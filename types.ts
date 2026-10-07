
export interface Node {
  id: string;
  label: string;
  type: 'goal' | 'task' | 'milestone' | 'input' | 'output';
  fx?: number | null;
  fy?: number | null;
}

export interface Edge {
  source: string | Node;
  target: string | Node;
  label?: string;
}

export interface Artifact {
  id: string;
  nodeId: string;
  content: string;
  type: string;
}

export interface Action {
  id: string;
  nodeId: string;
  tool: string;
  params: Record<string, any>;
}

export interface AgentOutput {
  nodes: Node[];
  edges: Edge[];
  artifacts: Artifact[];
  actions: Action[];
  summary: string;
  criticalPath: string[];
  riskAssessment: string;
  learningUpdates: string;
}

export type ApprovalLevel = 'low' | 'medium' | 'high' | 'critical';
