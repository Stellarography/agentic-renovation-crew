
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Clock, 
  X,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { useAgentStore } from '../stores/agentStore'

export const StatusBar: React.FC = () => {
  const { notifications, removeNotification, systemInfo } = useAppStore()
  const { isStreaming, agentConfigs } = useAgentStore()
  
  const activeAgents = agentConfigs.filter(agent => agent.enabled).length
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return XCircle
      case 'warning': return AlertCircle
      case 'info': return Info
      default: return Info
    }
  }

  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <Activity size={14} className={isStreaming ? 'pulsing' : ''} />
          <span>{isStreaming ? 'Processing...' : 'Ready'}</span>
        </div>
        
        <div className="status-item">
          <Wifi size={14} />
          <span>{activeAgents} Active Agents</span>
        </div>
        
        {systemInfo && (
          <div className="status-item">
            <span className="platform-badge">
              {systemInfo.platform.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="status-center">
        <AnimatePresence mode="wait">
          {notifications.slice(0, 1).map((notification) => {
            const IconComponent = getNotificationIcon(notification.type)
            return (
              <motion.div
                key={notification.id}
                className={`notification ${notification.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent size={14} className="notification-icon" />
                <div className="notification-content">
                  <span className="notification-title">{notification.title}</span>
                  <span className="notification-message">{notification.message}</span>
                </div>
                <button
                  className="notification-close"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="status-right">
        <div className="status-item">
          <Clock size={14} />
          <span>{currentTime}</span>
        </div>
        
        <div className="status-item">
          <span className="version">v{systemInfo?.version || '1.0.0'}</span>
        </div>
      </div>
    </div>
  )
}
