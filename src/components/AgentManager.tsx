
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Settings, 
  Power, 
  PowerOff, 
  Activity,
  Clock,
  MessageSquare,
  TrendingUp,
  Edit3,
  Plus
} from 'lucide-react'
import { useAgentStore, AgentConfig } from '../stores/agentStore'

export const AgentManager: React.FC = () => {
  const { agentConfigs, availableTypes, updateAgentConfig } = useAgentStore()
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleToggleAgent = async (agent: AgentConfig) => {
    await updateAgentConfig({
      ...agent,
      enabled: !agent.enabled,
      lastUsed: agent.enabled ? Date.now() : agent.lastUsed
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="agent-manager">
      <div className="manager-header">
        <div className="header-title">
          <Bot className="title-icon" />
          <h2>Agent Management</h2>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} />
            Create Agent
          </button>
        </div>
      </div>

      <div className="agent-grid">
        {agentConfigs.map((agent) => (
          <motion.div
            key={agent.id}
            className={`agent-card ${agent.enabled ? 'enabled' : 'disabled'}`}
            whileHover={{ y: -4, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="agent-header">
              <div className="agent-info">
                <div className="agent-name">
                  <Bot size={20} className={`agent-icon ${agent.enabled ? 'active' : ''}`} />
                  <h3>{agent.name}</h3>
                </div>
                <p className="agent-description">{agent.description}</p>
                <span className="agent-type">{agent.type}</span>
              </div>
              
              <div className="agent-controls">
                <button
                  className={`toggle-button ${agent.enabled ? 'enabled' : 'disabled'}`}
                  onClick={() => handleToggleAgent(agent)}
                  title={agent.enabled ? 'Disable Agent' : 'Enable Agent'}
                >
                  {agent.enabled ? <Power size={16} /> : <PowerOff size={16} />}
                </button>
                
                <button
                  className="btn btn-ghost"
                  onClick={() => setSelectedAgent(agent)}
                  title="Configure Agent"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>

            <div className="agent-stats">
              <div className="stat-item">
                <Activity size={14} />
                <span className="stat-label">Status</span>
                <span className={`stat-value ${agent.enabled ? 'active' : 'inactive'}`}>
                  {agent.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="stat-item">
                <MessageSquare size={14} />
                <span className="stat-label">Messages</span>
                <span className="stat-value">{formatNumber(agent.usage?.totalMessages ?? 0)}</span>
              </div>
              
              <div className="stat-item">
                <TrendingUp size={14} />
                <span className="stat-label">Success Rate</span>
                <span className="stat-value">{((agent.usage?.successRate ?? 0) * 100).toFixed(1)}%</span>
              </div>
              
              <div className="stat-item">
                <Clock size={14} />
                <span className="stat-label">Avg Response</span>
                <span className="stat-value">{formatTime(agent.usage?.averageResponseTime ?? 0)}</span>
              </div>
            </div>

            {agent.lastUsed && (
              <div className="agent-footer">
                <span className="last-used">
                  Last used: {new Date(agent.lastUsed ?? 0).toLocaleString()}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {agentConfigs.length === 0 && (
        <div className="empty-state">
          <Bot size={64} className="empty-icon" />
          <h3>No Agents Configured</h3>
          <p>Create your first AI agent to get started with ARC.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} />
            Create First Agent
          </button>
        </div>
      )}

      {/* Agent Configuration Modal */}
      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <motion.div
            className="agent-config-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-header">
              <h3>
                <Settings size={20} />
                Configure {selectedAgent.name}
              </h3>
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedAgent(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="config-section">
                <h4>Basic Settings</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={selectedAgent.name}
                    onChange={(e) => setSelectedAgent({
                      ...selectedAgent,
                      name: e.target.value
                    })}
                    className="input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={selectedAgent.description}
                    onChange={(e) => setSelectedAgent({
                      ...selectedAgent,
                      description: e.target.value
                    })}
                    className="input"
                    rows={3}
                  />
                </div>
              </div>

              <div className="config-section">
                <h4>Agent Configuration</h4>
                <div className="config-grid">
                  {Object.entries(selectedAgent.config).map(([key, value]) => (
                    <div key={key} className="form-group">
                      <label>{key}</label>
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => setSelectedAgent({
                          ...selectedAgent,
                          config: {
                            ...selectedAgent.config,
                            [key]: e.target.value
                          }
                        })}
                        className="input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedAgent(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await updateAgentConfig(selectedAgent)
                  setSelectedAgent(null)
                }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
