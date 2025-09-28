// core/ai/aiservice.ts
import { Ollama } from "@langchain/community/llms/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ollamaChat } from "./ollama";

export class AIService {
  private ollama: Ollama;
  private embeddings: OllamaEmbeddings;

  constructor() {
    this.ollama = new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama3.1:8b-instruct-q4_K_M", // Default model
    });
    
    this.embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large",
      baseUrl: "http://localhost:11434",
    });
  }

  async generateStream(prompt: string, model: string) {
    return ollamaChat(model, [{ role: 'user', content: prompt}]);
  }
  
  async createEmbeddings(text: string) {
    return this.embeddings.embedQuery(text);
  }
  
  // Add RAG methods here (e.g., manageVectorStore, rerank)
}