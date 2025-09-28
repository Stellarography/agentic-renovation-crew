// core/ai/ollama.ts
export async function ollamaChat(model: string, messages: any[]) {
  const res = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true })
  });
  return res.body; // Node ReadableStream
}