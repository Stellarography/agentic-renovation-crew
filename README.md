
# ARC - Agentic Renovation Crew

*An Electron desktop IDE for orchestrating AI agents*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## 🤖 Vision

ARC (Agentic Renovation Crew) is a revolutionary desktop IDE designed to orchestrate multiple specialized AI agents that work together to think, plan, design, read, write, create, discover, store documents in organized automated formats, and implement code and tasks. Think of it as your personal AI-powered development team in a single application.

## ✨ Features

### Agent Orchestration
- **Multiple Agent Types**: Support for code generation, documentation, discovery, utility, learning, reactive, multi-agent systems, hierarchical, goal-based, model-based reflex, and simple reflex agents
- **Real-time Communication**: Stream responses from AI agents with live conversation management
- **Agent Management**: Enable/disable agents, configure parameters, monitor performance metrics

### AI Integration Ready
- **Local AI Support**: Built-in integration support for Ollama, LM Studio, node-llama-cpp, and smolagents
- **API Abstraction**: Clean abstraction layer for connecting to various AI providers
- **Streaming Architecture**: Real-time streaming responses with connection keep-alive
- **Offline Capability**: Mock agents for development and offline use

### Document Organization
- **Hierarchical Structure**: Organized storage for web development notes, prompts, PDFs, books, and scripts
- **Multiple Formats**: Support for Markdown, JSON schemas, and various document types
- **Obsidian Integration**: Compatible with Obsidian vault organization
- **Content Processing**: Planned TTS, STT, image-to-text, and video-to-text capabilities

### Modern UI/UX
- **Electron Native**: Cross-platform desktop application
- **React 18**: Modern component-based architecture
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Full type safety throughout the codebase
- **Responsive Design**: Optimized for various screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/agentic-renovation-crew.git
cd agentic-renovation-crew

# Install dependencies
npm install

# Start development server
npm run electron:dev
```

### Building for Production

```bash
# Build the application
npm run build:app

# Or build without installer
npm run build:dir
```

## 🏗️ Architecture

### Core Components

#### Agent System
```typescript
interface AgentConfig {
  id: string
  name: string
  type: AgentType
  description: string
  enabled: boolean
  config: Record<string, any>
}
```

#### State Management (Zustand)
- **AppStore**: Global application state, notifications, system info
- **AgentStore**: Agent configurations, conversations, streaming state

#### API Bridge
Abstract layer supporting multiple AI providers:
- Ollama (local LLM server)
- LM Studio (local API)
- node-llama-cpp (direct integration)
- Custom agent logic

#### Electron Architecture
- **Main Process**: IPC handlers, file operations, system integration
- **Renderer Process**: React UI, Zustand stores, agent communication
- **Type-safe IPC**: Fully typed communication between processes

## 🤖 Agent Types

### Specialized Agents
- **Code Generation Agent**: Generates, reviews, and optimizes code
- **Documentation Agent**: Creates technical documentation and API docs
- **Discovery Agent**: Analyzes codebases and discovers patterns

### Advanced Agents
- **Utility Agents**: File operations, data processing, automation
- **Learning Agents**: Adaptive learning and personalization
- **Reactive Agents**: Event-driven responses to system changes

### Multi-Agent Systems
- **Hierarchical Agents**: Structured command chains
- **Goal-based Agents**: Autonomous goal achievement
- **Model-based Reflex Agents**: Environment modeling and response

## 📁 Document Management

### Hierarchical Organization
```
Documents/
├── web-development/
│   ├── react-patterns/
│   ├── node-backends/
│   └── deployment-guides/
├── prompts/
│   ├── code-generation/
│   └── documentation/
├── books/
│   ├── technical/
│   └── reference/
└── scripts/
    ├── automation/
    └── utilities/
```

### Supported Formats
- **Markdown**: Documentation, notes, guides
- **JSON**: Configuration files, schemas, data
- **PDF**: Books, papers, reference materials
- **Text**: Scripts, logs, raw content

## 🔧 Configuration

### Agent Configuration
```typescript
{
  "id": "code-gen-agent",
  "name": "Code Generation Agent",
  "type": "code-generation",
  "enabled": true,
  "config": {
    "language": "typescript",
    "framework": "react",
    "testingFramework": "jest"
  }
}
```

### AI Provider Setup
```typescript
// Future: Ollama Integration
const ollamaConfig = {
  provider: 'ollama',
  apiUrl: 'http://localhost:11434',
  model: 'codellama:7b',
  parameters: {
    temperature: 0.3,
    maxTokens: 2048
  }
}
```

## 🛠️ Development

### Project Structure
```
agentic_renovation_crew/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.ts     # IPC bridge
├── src/               # React renderer
│   ├── components/    # UI components
│   ├── stores/        # Zustand stores
│   ├── lib/          # Utilities & API bridge
│   └── styles/       # CSS stylesheets
├── docs/             # Documentation
└── dist/             # Built application
```

### Key Files
- `electron/main.ts`: Electron main process with type-safe IPC
- `src/stores/agentStore.ts`: Agent management and conversations
- `src/lib/apiBridge.ts`: AI integration abstraction layer
- `src/components/AIInterface.tsx`: Main chat interface

### Development Commands
```bash
npm run dev          # Start Vite dev server
npm run electron     # Run Electron in development
npm run electron:dev # Concurrent dev server + Electron
npm run build        # Build for production
```

## 🔮 Roadmap

### Phase 1: Foundation (Current)
- ✅ Electron + React application shell
- ✅ Agent management system
- ✅ Mock streaming conversations
- ✅ Document management UI

### Phase 2: AI Integration
- 🔄 Ollama local LLM integration
- 🔄 LM Studio API connection
- 🔄 node-llama-cpp integration
- 🔄 Custom agent logic framework

### Phase 3: Advanced Features
- 📋 Multi-agent collaboration
- 📋 Document processing (TTS, STT, OCR)
- 📋 Obsidian vault integration
- 📋 Advanced agent learning

### Phase 4: Tauri Migration
- 📋 Tauri-based version for performance
- 📋 Cross-platform optimization
- 📋 Plugin system architecture

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Electron for the robust desktop framework
- React and Zustand for excellent state management
- Framer Motion for beautiful animations
- The open-source AI community for inspiration

---

**ARC - Where AI Agents Work Together** 🤖✨

*Built with ❤️ for developers who believe in the power of AI orchestration*
