
import { GoogleGenAI, Type } from "@google/genai";
import { AgentOutput, ApprovalLevel } from "../types";

const SYSTEM_PROMPT = `
SYSTEM: You are an autonomous project co-pilot agent. Your mission: convert high-level goals into concrete, executable work, carry out allowed tool actions, create artifacts, and attach them to project nodes while continuously optimizing across projects using reflective meta-heuristics.

PRINCIPLES:
- Cross-Domain Lattice: reason across physics, biology, CS, social systems and formal math to produce robust, generalizable plans.
- Recursive Law Formation: model micro-dynamics → derive macro-attractors → revise micro-laws under observed outcomes.
- Reflective Hyper-Loops: perform compression → expansion → recompression cycles and use Solomon off–Bayesian style meta-updates.
- Value-Topology Ethics: prefer solutions that preserve predictive and moral invariants; treat incompleteness as a learning signal.

BEHAVIORS:
1. Decompose goals into node graph (tasks, inputs, outputs, dependencies). Nodes must have a type from: 'goal', 'task', 'milestone', 'input', 'output'.
2. Execute permitted tool calls (APIs listed at runtime), commit artifacts, and link them to nodes.
3. Auto-infer dependencies and highlight critical path + parallelization opportunities.
4. When encountering novelty, form hypotheses, attempt safe probes, and escalate when required by approval thresholds.
5. Log decisions, rationales, and uncertainty; emit compact human-readable summaries.

SAFETY & PERMISSIONS:
- Only use tools/credentials explicitly provided in runtime. If a requested action exceeds permissions or risk thresholds, pause and escalate.
- Never attempt actions that violate laws, privacy, or policy constraints.

Begin by producing an initial node graph, dependencies, and a 1-paragraph plan. Then begin authorized execution.
The output MUST be a single JSON object matching the provided schema.
`;

const agentOutputSchema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      description: "List of all nodes in the project graph.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique identifier for the node." },
          label: { type: Type.STRING, description: "A short, descriptive label for the node." },
          type: { type: Type.STRING, enum: ['goal', 'task', 'milestone', 'input', 'output'] },
        },
        required: ['id', 'label', 'type'],
      },
    },
    edges: {
      type: Type.ARRAY,
      description: "List of edges representing dependencies between nodes.",
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "The ID of the source node." },
          target: { type: Type.STRING, description: "The ID of the target node." },
          label: { type: Type.STRING, description: "Optional label for the edge." },
        },
        required: ['source', 'target'],
      },
    },
    artifacts: {
      type: Type.ARRAY,
      description: "List of artifacts created by the agent.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          nodeId: { type: Type.STRING, description: "Node this artifact is attached to." },
          content: { type: Type.STRING, description: "Content of the artifact." },
          type: { type: Type.STRING, description: "Type of artifact, e.g., 'code_snippet', 'documentation'." },
        },
        required: ['id', 'nodeId', 'content', 'type'],
      },
    },
    actions: {
      type: Type.ARRAY,
      description: "List of proposed tool actions.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          nodeId: { type: Type.STRING, description: "Node this action relates to." },
          tool: { type: Type.STRING, description: "Name of the tool to use." },
          params: { type: Type.OBJECT, description: "Parameters for the tool call." },
        },
        required: ['id', 'nodeId', 'tool', 'params'],
      },
    },
    summary: { type: Type.STRING, description: "A concise summary of the plan and current status." },
    criticalPath: {
      type: Type.ARRAY,
      description: "An array of node IDs representing the critical path.",
      items: { type: Type.STRING },
    },
    riskAssessment: { type: Type.STRING, description: "A summary of potential risks and mitigation strategies." },
    learningUpdates: { type: Type.STRING, description: "Meta-level updates or learning from the planning process." },
  },
  required: ['nodes', 'edges', 'artifacts', 'actions', 'summary', 'criticalPath', 'riskAssessment', 'learningUpdates'],
};

interface GeneratePlanParams {
  goal: string;
  context: string;
  tools: string;
  approvalLevel: ApprovalLevel;
}

export const generateProjectPlan = async (params: GeneratePlanParams): Promise<AgentOutput> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userPrompt = `
    INPUT:
    - GOAL: "${params.goal}"
    - PROJECT_CONTEXT: "${params.context}"
    - AVAILABLE_TOOLS: "${params.tools}"
    - HUMAN_APPROVAL_LEVEL: "${params.approvalLevel}"

    OUTPUT: JSON object with fields {nodes:[], edges:[], artifacts:[], actions:[], summary:, criticalPath:, riskAssessment:, learningUpdates:[]}.
    `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: userPrompt,
    config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: agentOutputSchema,
        temperature: 0.2,
    }
  });

  try {
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AgentOutput;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error("The model did not return a valid JSON response. Please try again.");
  }
};
