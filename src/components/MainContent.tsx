
import React from 'react'
import { motion } from 'framer-motion'
import { AIInterface } from './AIInterface'
import { AgentManager } from './AgentManager'
import { DocumentManager } from './DocumentManager'
import { SettingsPanel } from './SettingsPanel'

interface MainContentProps {
  activeView: 'chat' | 'agents' | 'documents' | 'settings';
}

export const MainContent: React.FC<MainContentProps> = ({ activeView }) => {
  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <AIInterface />
      case 'agents':
        return <AgentManager />
      case 'documents':
        return <DocumentManager />
      case 'settings':
        return <SettingsPanel />
      default:
        return <AIInterface />
    }
  }

  return (
    <motion.div 
      className="main-content"
      key={activeView}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {renderContent()}
    </motion.div>
  )
}
