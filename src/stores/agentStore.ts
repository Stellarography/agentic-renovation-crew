
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface AgentType {
  id: string
  name: string
  category: 'code-generation' | 'documentation' | 'discovery' | 'utility' | 'learning' | 'reactive' | 'multi-agent' | 'hierarchical' | 'goal-based' | 'model-based-reflex' | 'simple-reflex'
  description: string
  capabilities: string[]
}

export interface AgentConfig {
  id: string
  name: string
  type: string
  description: string
  enabled: boolean
  config: Record<string, any>
  lastUsed?: number
  usage: {
    totalMessages: number
    successRate: number
    averageResponseTime: number
  }
}

export interface AgentMessage {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: number
  agentId?: string
  metadata?: {
    tokens?: number
    model?: string
    processingTime?: number
  }
}

export interface Conversation {
  id: string
  title: string
  agentId: string
  messages: AgentMessage[]
  createdAt: number
  updatedAt: number
  status: 'active' | 'archived' | 'completed'
}

interface AgentState {
  availableTypes: AgentType[]
  agentConfigs: AgentConfig[]
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  streamingMessageId: string | null
  
  // Actions
  loadAgentConfigs: () => Promise<void>
  updateAgentConfig: (config: AgentConfig) => Promise<void>
  createConversation: (agentId: string, title?: string) => string
  setActiveConversation: (id: string | null) => void
  sendMessage: (content: string, agentId?: string) => Promise<void>
  deleteConversation: (id: string) => void
  archiveConversation: (id: string) => void
  getActiveConversation: () => Conversation | null
  simulateStreamingResponse: (messageId: string, userMessage: AgentMessage) => Promise<void>
}

const defaultAgentTypes: AgentType[] = [
  {
    id: 'code-generation',
    name: 'Code Generation Agent',
    category: 'code-generation',
    description: 'Generates, reviews, and optimizes code across multiple languages and frameworks',
    capabilities: ['Code generation', 'Code review', 'Refactoring', 'Testing', 'Documentation']
  },
  {
    id: 'documentation',
    name: 'Documentation Agent',
    category: 'documentation',
    description: 'Creates and maintains technical documentation, API docs, and user guides',
    capabilities: ['Technical writing', 'API documentation', 'User guides', 'README generation']
  },
  {
    id: 'discovery',
    name: 'Discovery Agent',
    category: 'discovery',
    description: 'Analyzes codebases, discovers patterns, and identifies optimization opportunities',
    capabilities: ['Code analysis', 'Pattern recognition', 'Dependency mapping', 'Security scanning']
  },
  {
    id: 'utility',
    name: 'Utility Agent',
    category: 'utility',
    description: 'Performs utility functions like file operations, data processing, and automation',
    capabilities: ['File operations', 'Data processing', 'Task automation', 'System integration']
  },
  {
    id: 'learning',
    name: 'Learning Agent',
    category: 'learning',
    description: 'Adapts and learns from interactions to improve performance over time',
    capabilities: ['Adaptive learning', 'Performance optimization', 'Personalization', 'Feedback processing']
  }
]

export const useAgentStore = create<AgentState>()(
  subscribeWithSelector((set, get) => ({
    availableTypes: defaultAgentTypes,
    agentConfigs: [],
    conversations: [],
    activeConversationId: null,
    isStreaming: false,
    streamingMessageId: null,
    
    loadAgentConfigs: async () => {
      try {
        if (window.electronAPI) {
          const configs = await window.electronAPI.agent.getConfigs()
          set({ agentConfigs: configs })
        }
      } catch (error) {
        console.error('Failed to load agent configs:', error)
      }
    },
    
    updateAgentConfig: async (config: AgentConfig) => {
      try {
        if (window.electronAPI) {
          await window.electronAPI.agent.updateConfig(config)
          set((state) => ({
            agentConfigs: state.agentConfigs.map(c => 
              c.id === config.id ? config : c
            )
          }))
        }
      } catch (error) {
        console.error('Failed to update agent config:', error)
      }
    },
    
    createConversation: (agentId: string, title?: string) => {
      const id = crypto.randomUUID()
      const agent = get().agentConfigs.find(a => a.id === agentId)
      const conversation: Conversation = {
        id,
        title: title || `Chat with ${agent?.name || 'Agent'}`,
        agentId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active'
      }
      
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: id
      }))
      
      return id
    },
    
    setActiveConversation: (id: string | null) => {
      set({ activeConversationId: id })
    },
    
    sendMessage: async (content: string, agentId?: string) => {
      const conversation = get().getActiveConversation()
      if (!conversation) return
      
      const userMessageId = crypto.randomUUID()
      const agentMessageId = crypto.randomUUID()
      const timestamp = Date.now()
      
      // Add user message
      const userMessage: AgentMessage = {
        id: userMessageId,
        role: 'user',
        content,
        timestamp,
        agentId: agentId || conversation.agentId
      }
      
      set((state) => ({
        conversations: state.conversations.map(c =>
          c.id === conversation.id
            ? {
                ...c,
                messages: [...c.messages, userMessage],
                updatedAt: timestamp
              }
            : c
        ),
        isStreaming: true,
        streamingMessageId: agentMessageId
      }))
      
      try {
        // Create initial agent message for streaming
        const agentMessage: AgentMessage = {
          id: agentMessageId,
          role: 'agent',
          content: '',
          timestamp,
          agentId: agentId || conversation.agentId
        }
        
        set((state) => ({
          conversations: state.conversations.map(c =>
            c.id === conversation.id
              ? {
                  ...c,
                  messages: [...c.messages, agentMessage],
                  updatedAt: timestamp
                }
              : c
          )
        }))
        
        // Mock streaming response
        await get().simulateStreamingResponse(agentMessageId, userMessage)
        
      } catch (error) {
        console.error('Failed to send message:', error)
        
        // Add error message
        const errorMessage: AgentMessage = {
          id: crypto.randomUUID(),
          role: 'system',
          content: 'Error: Failed to get response from agent',
          timestamp: Date.now()
        }
        
        set((state) => ({
          conversations: state.conversations.map(c =>
            c.id === conversation.id
              ? {
                  ...c,
                  messages: [...c.messages, errorMessage],
                  updatedAt: Date.now()
                }
              : c
          )
        }))
      } finally {
        set({ isStreaming: false, streamingMessageId: null })
      }
    },
    
    // Mock streaming response - replace with actual API integration
    simulateStreamingResponse: async (messageId: string, userMessage: AgentMessage) => {
      const responses = [
        "I understand your request. Let me analyze this step by step...",
        "\n\nBased on my analysis, here are my recommendations:",
        "\n\n1. First, let's consider the architectural patterns that would work best for your use case.",
        "\n2. We should implement proper error handling and validation throughout the system.",
        "\n3. Documentation and comprehensive testing will be crucial for long-term maintainability.",
        "\n\nI'm ready to assist you with the implementation. What would you like to focus on first?"
      ]
      
      let accumulatedContent = ''
      
      for (const chunk of responses) {
        accumulatedContent += chunk
        
        set((state) => ({
          conversations: state.conversations.map(c => ({
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId
                ? { ...m, content: accumulatedContent }
                : m
            )
          }))
        }))
        
        // Simulate streaming delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
      }
    },
    
    deleteConversation: (id: string) => {
      set((state) => ({
        conversations: state.conversations.filter(c => c.id !== id),
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
      }))
    },
    
    archiveConversation: (id: string) => {
      set((state) => ({
        conversations: state.conversations.map(c =>
          c.id === id ? { ...c, status: 'archived' as const } : c
        )
      }))
    },
    
    getActiveConversation: () => {
      const state = get()
      return state.conversations.find(c => c.id === state.activeConversationId) || null
    }
  }))
)
