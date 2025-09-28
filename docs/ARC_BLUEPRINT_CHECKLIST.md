# ARC Crew Roster & Blueprint Checklist

This document is derived from the `arc_crew_roster_blueprint.html` and serves as a checklist for implementing the full capabilities of the ARC AI crew.

## Core Agent Roster

| Role      | Recommended Model          | Purpose                                                 |
|-----------|----------------------------|---------------------------------------------------------|
| Foreman   | `llama3.1:8b-instruct`     | Coordinator/orchestrator for agent handoffs and final QA. |
| Coder     | `deepseek-coder:6.7b`      | Code generation, refactoring, tests, and bug triage.    |
| Planner   | `mistral:instruct`         | Decomposes tasks, proposes options, and drafts steps.   |
| RAG       | `llama3.1:8b-instruct`     | Retrieval, embeddings, and grounded answering.          |
| Vision    | `llava-llama3`             | Image understanding, OCR-lite, and UI parsing.          |
| Speech    | `dimavz/whisper-tiny`      | Speech-to-text (ASR) for commands and notes.            |

---

## UI Frameworks

- [ ] **Integrate Radix UI & Shadcn UI:** Implement these component libraries to ensure WCAG 2.1, ADA, and A11y compliance, along with personal security and cybersecurity best practices. Refer to `UI_Blueprint.md` for detailed setup steps.

---

## Implementation Checklist

Here are the actionable tasks required to fully implement the blueprint. Please let me know which of these you'd like to prioritize.

### 1. Environment Setup

- [ ] **Pull Ollama Models:** Ensure all recommended models are available locally.
  ```bash
  ollama pull llama3.1:8b-instruct
  ollama pull deepseek-coder:6.7b
  ollama pull mistral:instruct
  ollama pull mxbai-embed-large # For RAG embeddings
  ollama pull llava-llama3
  ollama pull dimavz/whisper-tiny
  ```

### 2. RAG (Retrieval Augmented Generation)

- [ ] **Implement Full RAG Pipeline:** The foundation is there, but the full flow needs to be built.
  - [ ] **Document Chunking:** Implement logic to split documents into smaller, manageable chunks for embedding.
  - [ ] **Vector Store Management:** Use the `saveVectorStore` and `loadVectorStore` functions to manage project-specific knowledge.
  - [ ] **Retrieval Function:** Create a function that takes a user query, generates an embedding, finds the most relevant document chunks from the vector store, and adds them to the context for the generation model.

### 3. New Agent Capabilities

- [ ] **Implement Vision Agent UI & Logic:**
  - [ ] Add a UI element (e.g., a paperclip button) to the chat input to allow image uploads.
  - [ ] Update the IPC channel to handle sending image data (e.g., as a base64 string) to the main process.
  - [ ] Modify the `AIService` to correctly format the request for a multimodal model like LLaVA.

- [ ] **Implement Speech-to-Text (ASR):**
  - [ ] Add a microphone button to the chat interface.
  - [ ] Integrate with an ASR model (like the community Whisper model in Ollama) to transcribe user audio into text.
  - [ ] Pipe the transcribed text into the chat input.
