// core/ai/rag.ts
import { promises as fs } from "fs";
import path from "path";

const basePath = path.join(process.cwd(), "projectsData");

export async function saveVectorStore(projectId: string, vectors: any) {
  const fp = path.join(basePath, projectId, "vectorStore.json");
  await fs.mkdir(path.dirname(fp), { recursive: true });
  await fs.writeFile(fp, JSON.stringify(vectors, null, 2));
}

export async function loadVectorStore(projectId: string) {
  const fp = path.join(basePath, projectId, "vectorStore.json");
  try {
    const data = await fs.readFile(fp, "utf-8");
    return JSON.parse(data);
  } catch {
    return []; // no store yet
  }
}