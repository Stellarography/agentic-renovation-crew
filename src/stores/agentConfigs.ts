import { AgentConfig } from './agentStore';

// Based on the ARC Crew Roster Blueprint
export const defaultAgents: Omit<AgentConfig, 'usage' | 'lastUsed'>[] = [
  {
    id: "foreman",
    name: "Foreman",
    model: "llama3.1:8b-instruct",
    description: "Coordinator/orchestrator for agent handoffs and final QA.",
    enabled: true,
    config: {},
  },
  {
    id: "coder",
    name: "Coder",
    model: "deepseek-coder:6.7b",
    description: "Code generation, refactoring, tests, and bug triage.",
    enabled: true,
    config: {},
  },
  {
    id: "planner",
    name: "Planner",
    model: "mistral:instruct",
    description: "Decomposes tasks, proposes options, and drafts execution steps.",
    enabled: true,
    config: {},
  },
  {
    id: "rag",
    name: "RAG",
    model: "llama3.1:8b-instruct", // Gen model
    description: "Retrieval, embeddings, and grounded answering.",
    enabled: false, // Disabled by default
    config: { embeddingModel: "mxbai-embed-large" },
  },
  {
    id: "vision",
    name: "Vision",
    model: "llava-llama3",
    description: "Image understanding, OCR-lite, charts, and UI parsing.",
    enabled: false, // Disabled by default
    config: {},
  },
];