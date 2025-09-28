import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { StatusBar } from './components/StatusBar'
import { useAppStore } from './stores/appStore'
import { useAgentStore } from './stores/agentStore'

// Define a simple ErrorFallback component
const ErrorFallback: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="error-fallback"
  >
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>Reload</button>
  </motion.div>
)

const App: React.FC = () => {
  const { initializeApp, currentView } = useAppStore()
  const { loadAgentConfigs } = useAgentStore()

  useEffect(() => {
    initializeApp()
    loadAgentConfigs()
  }, [initializeApp, loadAgentConfigs])

  return (
    <div className="app">
      <div className="app-container">
        <Sidebar />
        <MainContent activeView={currentView} />
      </div>
      <StatusBar />
    </div>
  )
}

export default App