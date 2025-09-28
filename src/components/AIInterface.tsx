
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles
} from 'lucide-react'
import { useAgentStore } from '../stores/agentStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const AIInterface: React.FC = () => {
  const { 
    getActiveConversation, 
    sendMessage, 
    isStreaming, 
    streamingMessageId,
    agentConfigs,
    createConversation
  } = useAgentStore()
  
  const [inputValue, setInputValue] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const activeConversation = getActiveConversation()
  const enabledAgents = agentConfigs.filter(agent => agent.enabled)

  useEffect(() => {
    if (enabledAgents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(enabledAgents[0].id)
    }
  }, [enabledAgents, selectedAgentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isStreaming) return

    if (!activeConversation) {
      createConversation(selectedAgentId || enabledAgents[0]?.id)
    }

    setInputValue('')
    await sendMessage(inputValue.trim(), selectedAgentId)
    
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (enabledAgents.length === 0) {
    return (
      <div className="ai-interface-empty">
        <div className="empty-state">
          <Bot size={64} className="empty-icon" />
          <h2>No Agents Available</h2>
          <p>Configure and enable agents in the Agents panel to start chatting.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-interface">
      <div className="chat-header">
        <div className="chat-title">
          <Sparkles className="title-icon" />
          <h2>
            {activeConversation?.title || 'New Conversation'}
          </h2>
        </div>
        
        <div className="agent-selector">
          <label htmlFor="agent-select">Agent:</label>
          <select
            id="agent-select"
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="agent-select"
          >
            {enabledAgents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="messages-container">
        <AnimatePresence>
          {activeConversation?.messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.role}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {message.role === 'user' ? (
                  <User size={20} />
                ) : message.role === 'agent' ? (
                  <Bot size={20} />
                ) : (
                  <Sparkles size={16} />
                )}
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.role === 'user' 
                      ? 'You' 
                      : message.role === 'agent'
                      ? agentConfigs.find(a => a.id === message.agentId)?.name || 'Agent'
                      : 'System'
                    }
                  </span>
                  <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="message-body">
                  {message.role === 'agent' || message.role === 'system' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ className, children, ...props }) => {
                          // Check if it's inline code by checking if it contains newlines
                          const isInline = typeof children === 'string' && !children.includes('\n')
                          
                          if (isInline) {
                            return <code className="inline-code" {...props}>{children}</code>
                          }
                          return (
                            <div className="code-block">
                              <pre>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          )
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  
                  {isStreaming && message.id === streamingMessageId && (
                    <motion.div 
                      className="streaming-indicator"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Loader2 size={16} className="spinning" />
                      <span>Thinking...</span>
                    </motion.div>
                  )}
                </div>
                
                {message.role === 'agent' && message.content && !isStreaming && (
                  <div className="message-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => copyToClipboard(message.content)}
                      title="Copy message"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      title="Good response"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      title="Poor response"
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeConversation?.messages.length === 0 && (
          <div className="welcome-message">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="welcome-content"
            >
              <Bot size={48} className="welcome-icon" />
              <h3>Welcome to ARC</h3>
              <p>Start a conversation with your AI agent. I'm here to help with code generation, documentation, analysis, and more!</p>
              
              <div className="suggested-prompts">
                <h4>Try asking:</h4>
                <div className="prompt-suggestions">
                  <button 
                    className="suggestion-btn"
                    onClick={() => setInputValue("Help me design a React component architecture")}
                  >
                    "Help me design a React component architecture"
                  </button>
                  <button 
                    className="suggestion-btn"
                    onClick={() => setInputValue("Review my code for potential improvements")}
                  >
                    "Review my code for potential improvements"
                  </button>
                  <button 
                    className="suggestion-btn"
                    onClick={() => setInputValue("Generate documentation for my API")}
                  >
                    "Generate documentation for my API"
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agentConfigs.find(a => a.id === selectedAgentId)?.name || 'Agent'}...`}
            className="message-input"
            rows={1}
            disabled={isStreaming}
          />
          
          <button
            type="submit"
            className={`send-button ${!inputValue.trim() || isStreaming ? 'disabled' : ''}`}
            disabled={!inputValue.trim() || isStreaming}
          >
            {isStreaming ? (
              <Loader2 size={20} className="spinning" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        <div className="input-footer">
          <span className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  )
}
