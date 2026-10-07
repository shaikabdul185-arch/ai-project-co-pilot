# AI Project Co-Pilot

An AI planning agent that turns a high-level goal into an **executable project plan**. The plan is drawn as a dependency graph, with the critical path highlighted, a risk assessment, proposed tool actions and starter artifacts.

## What you get from one goal

- **Node graph:** goals, tasks, milestones, inputs and outputs, connected by dependency edges
- **Critical path:** the chain of tasks that sets the project's length, highlighted on the graph
- **Proposed actions:** tool calls the agent would make for each node, using only the tools you list
- **Artifacts:** draft content (code snippets, docs) attached to specific nodes
- **Risk assessment:** likely problems and how to reduce them
- **Learning updates:** what the agent would adjust in its own planning next time
- **Summary:** a short plain-language description of the plan

## Controls

- **Goal:** what you want to achieve
- **Project context:** constraints, team, timeline
- **Available tools:** the APIs or tools the agent may plan around
- **Human approval level:** how much the agent may do before asking you

## How it works

The planner uses `gemini-2.5-pro` with a detailed system prompt (cross-domain reasoning, recursive refinement, safety escalation) and a strict **JSON response schema**, so the output always parses into nodes, edges, artifacts and actions. The graph is rendered as SVG.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · Google Gen AI SDK

## Run locally

Requires Node.js 18+ and a Gemini API key (free at https://aistudio.google.com/apikey).

```bash
git clone https://github.com/shaikabdul185-arch/ai-project-co-pilot.git
cd ai-project-co-pilot
npm install
cp .env.example .env.local   # then add your key
npm run dev
```

Open http://localhost:3000. Production build: `npm run build`.

## Project structure

```
App.tsx                         State and layout
components/ProjectInputForm.tsx Goal, context, tools, approval level
components/GraphDisplay.tsx     SVG dependency graph with critical path
components/OutputDisplay.tsx    Summary, risks, actions, artifacts
services/geminiService.ts       System prompt, schema, API call
types.ts                        Node, edge, artifact and output types
```

## A note on API keys

The key is bundled into the browser code at build time. That's fine for local use, but don't deploy a public build with your personal key in it.
