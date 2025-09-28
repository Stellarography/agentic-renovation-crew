
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { defaultAgents } from './agentConfigs';

// ... (interfaces for AgentType, AgentMessage, Conversation remain the same)

export interface AgentConfig {
  id: string;
  name: string;
  model: string; // Added model property
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  lastUsed?: number;
  usage: {
    totalMessages: number;
    successRate: number;
    averageResponseTime: number;
  };
}

interface AgentState {
  agentConfigs: AgentConfig[];
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  streamingMessageId: string | null;

  // Actions
  createConversation: (agentId: string, title?: string) => string;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  getActiveConversation: () => Conversation | null;
}

const initialAgentConfigs: AgentConfig[] = defaultAgents.map(agent => ({
  ...agent,
  usage: { totalMessages: 0, successRate: 1, averageResponseTime: 0 },
}));

export const useAgentStore = create<AgentState>()(
  subscribeWithSelector((set, get) => ({
    agentConfigs: initialAgentConfigs,
    conversations: [],
    activeConversationId: null,
    isStreaming: false,
    streamingMessageId: null,

    createConversation: (agentId: string, title?: string) => {
      const id = crypto.randomUUID();
      const agent = get().agentConfigs.find(a => a.id === agentId);
      const conversation: Conversation = {
        id,
        title: title || `Chat with ${agent?.name || 'Agent'}`,
        agentId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
      };

      set(state => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: id,
      }));

      return id;
    },

    setActiveConversation: (id: string | null) => {
      set({ activeConversationId: id });
    },

    sendMessage: async (content: string) => {
      const conversation = get().getActiveConversation();
      const agent = get().agentConfigs.find(a => a.id === conversation?.agentId);
      if (!conversation || !agent) return;

      const userMessageId = crypto.randomUUID();
      const agentMessageId = crypto.randomUUID();
      const timestamp = Date.now();

      const userMessage: AgentMessage = {
        id: userMessageId,
        role: 'user',
        content,
        timestamp,
        agentId: agent.id,
      };
      
      const agentMessage: AgentMessage = {
        id: agentMessageId,
        role: 'agent',
        content: '',
        timestamp,
        agentId: agent.id,
      };

      set(state => ({
        conversations: state.conversations.map(c =>
          c.id === conversation.id
            ? { ...c, messages: [...c.messages, userMessage, agentMessage], updatedAt: timestamp }
            : c
        ),
        isStreaming: true,
        streamingMessageId: agentMessageId,
      }));

      // Listen for chunks from the main process
      window.electronAPI.ai.onStreamChunk((chunk) => {
        set(state => ({
          conversations: state.conversations.map(c => ({
            ...c,
            messages: c.messages.map(m =>
              m.id === agentMessageId
                ? { ...m, content: m.content + chunk.content }
                : m
            ),
          })),
        }));
      });

      try {
        await window.electronAPI.ai.generateStream(content, agent.model);
      } catch (error) {
        console.error('Failed to get response from agent:', error);
        // Handle error state in UI
      } finally {
        set({ isStreaming: false, streamingMessageId: null });
      }
    },

    deleteConversation: (id: string) => {
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== id),
        activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
      }));
    },

    archiveConversation: (id: string) => {
      set(state => ({
        conversations: state.conversations.map(c =>
          c.id === id ? { ...c, status: 'archived' as const } : c
        ),
      }));
    },

    getActiveConversation: () => {
      const state = get();
      return state.conversations.find(c => c.id === state.activeConversationId) || null;
    },
  }))
);
