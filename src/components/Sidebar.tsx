
import React from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Archive
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { useAgentStore } from '../stores/agentStore'

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, sidebarCollapsed, toggleSidebar } = useAppStore()
  const { conversations, activeConversationId, setActiveConversation, createConversation, agentConfigs } = useAgentStore()
  
  const activeConversations = conversations.filter(c => c.status === 'active')
  const archivedConversations = conversations.filter(c => c.status === 'archived')
  
  const menuItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat', count: activeConversations.length },
    { id: 'agents', icon: Users, label: 'Agents', count: agentConfigs.filter(a => a.enabled).length },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  const handleNewConversation = () => {
    if (agentConfigs.length > 0) {
      createConversation(agentConfigs[0].id)
    }
  }

  return (
    <motion.div 
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
      animate={{ width: sidebarCollapsed ? 60 : 280 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <motion.h1 
          className="sidebar-title"
          animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!sidebarCollapsed && 'ARC IDE'}
        </motion.h1>
        
        <button 
          className="btn btn-ghost sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id as any)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!sidebarCollapsed && (
              <span className="nav-label">
                {item.label}
                {item.count !== undefined && (
                  <span className="nav-count">{item.count}</span>
                )}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {currentView === 'chat' && !sidebarCollapsed && (
        <div className="sidebar-section">
          <div className="section-header">
            <h3>Conversations</h3>
            <button 
              className="btn btn-ghost"
              onClick={handleNewConversation}
              title="New Conversation"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="conversation-list">
            {activeConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
                onClick={() => setActiveConversation(conversation.id)}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="conversation-info">
                  <div className="conversation-title">{conversation.title}</div>
                  <div className="conversation-meta">
                    {conversation.messages.length} messages
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {archivedConversations.length > 0 && (
            <div className="archived-section">
              <h4><Archive size={16} /> Archived</h4>
              <div className="conversation-list">
                {archivedConversations.slice(0, 5).map((conversation) => (
                  <button
                    key={conversation.id}
                    className="conversation-item archived"
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="conversation-info">
                      <div className="conversation-title">{conversation.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
