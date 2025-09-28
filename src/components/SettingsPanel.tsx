
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Palette, 
  Globe, 
  Bell, 
  Lock, 
  Database,
  Cpu,
  Monitor,
  Save,
  RotateCcw
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface SettingsState {
  appearance: {
    theme: 'dark' | 'light' | 'auto'
    accentColor: string
    fontSize: 'small' | 'medium' | 'large'
  }
  ai: {
    defaultModel: string
    temperature: number
    maxTokens: number
    streamingEnabled: boolean
  }
  interface: {
    sidebarPosition: 'left' | 'right'
    showNotifications: boolean
    autoSave: boolean
    confirmActions: boolean
  }
  privacy: {
    telemetryEnabled: boolean
    crashReports: boolean
    analytics: boolean
  }
}

export const SettingsPanel: React.FC = () => {
  const { systemInfo } = useAppStore()
  
  const [settings, setSettings] = useState<SettingsState>({
    appearance: {
      theme: 'dark',
      accentColor: '#667eea',
      fontSize: 'medium'
    },
    ai: {
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      streamingEnabled: true
    },
    interface: {
      sidebarPosition: 'left',
      showNotifications: true,
      autoSave: true,
      confirmActions: true
    },
    privacy: {
      telemetryEnabled: false,
      crashReports: true,
      analytics: false
    }
  })

  const [activeSection, setActiveSection] = useState('appearance')

  const sections = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'ai', name: 'AI Models', icon: Cpu },
    { id: 'interface', name: 'Interface', icon: Monitor },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'system', name: 'System', icon: Database }
  ]

  const handleSave = () => {
    // Save settings to electron store
    console.log('Saving settings:', settings)
  }

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      appearance: {
        theme: 'dark',
        accentColor: '#667eea',
        fontSize: 'medium'
      },
      ai: {
        defaultModel: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        streamingEnabled: true
      },
      interface: {
        sidebarPosition: 'left',
        showNotifications: true,
        autoSave: true,
        confirmActions: true
      },
      privacy: {
        telemetryEnabled: false,
        crashReports: true,
        analytics: false
      }
    })
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="setting-group">
              <label>Theme</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, theme: e.target.value as any }
                })}
                className="input"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={settings.appearance.accentColor}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, accentColor: e.target.value }
                })}
                className="color-input"
              />
            </div>
            
            <div className="setting-group">
              <label>Font Size</label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, fontSize: e.target.value as any }
                })}
                className="input"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )

      case 'ai':
        return (
          <div className="settings-section">
            <h3>AI Models & Behavior</h3>
            
            <div className="setting-group">
              <label>Default Model</label>
              <select
                value={settings.ai.defaultModel}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, defaultModel: e.target.value }
                })}
                className="input"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Temperature: {settings.ai.temperature}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.ai.temperature}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, temperature: parseFloat(e.target.value) }
                })}
                className="slider"
              />
              <div className="slider-labels">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div className="setting-group">
              <label>Max Tokens</label>
              <input
                type="number"
                min="256"
                max="8192"
                value={settings.ai.maxTokens}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, maxTokens: parseInt(e.target.value) }
                })}
                className="input"
              />
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.ai.streamingEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, streamingEnabled: e.target.checked }
                  })}
                />
                Enable Streaming Responses
              </label>
            </div>
          </div>
        )

      case 'interface':
        return (
          <div className="settings-section">
            <h3>Interface</h3>
            
            <div className="setting-group">
              <label>Sidebar Position</label>
              <select
                value={settings.interface.sidebarPosition}
                onChange={(e) => setSettings({
                  ...settings,
                  interface: { ...settings.interface, sidebarPosition: e.target.value as any }
                })}
                className="input"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.interface.showNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    interface: { ...settings.interface, showNotifications: e.target.checked }
                  })}
                />
                Show Notifications
              </label>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.interface.autoSave}
                  onChange={(e) => setSettings({
                    ...settings,
                    interface: { ...settings.interface, autoSave: e.target.checked }
                  })}
                />
                Auto-save Documents
              </label>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.interface.confirmActions}
                  onChange={(e) => setSettings({
                    ...settings,
                    interface: { ...settings.interface, confirmActions: e.target.checked }
                  })}
                />
                Confirm Destructive Actions
              </label>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="settings-section">
            <h3>Privacy & Data</h3>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.privacy.telemetryEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, telemetryEnabled: e.target.checked }
                  })}
                />
                Enable Telemetry
              </label>
              <p className="setting-description">
                Help improve ARC by sending anonymous usage data
              </p>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.privacy.crashReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, crashReports: e.target.checked }
                  })}
                />
                Send Crash Reports
              </label>
              <p className="setting-description">
                Automatically send crash reports to help fix bugs
              </p>
            </div>
            
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, analytics: e.target.checked }
                  })}
                />
                Analytics
              </label>
              <p className="setting-description">
                Track feature usage to improve the user experience
              </p>
            </div>
          </div>
        )

      case 'system':
        return (
          <div className="settings-section">
            <h3>System Information</h3>
            
            {systemInfo && (
              <div className="system-info">
                <div className="info-item">
                  <label>Platform</label>
                  <span>{systemInfo.platform}</span>
                </div>
                <div className="info-item">
                  <label>ARC Version</label>
                  <span>{systemInfo.version}</span>
                </div>
                <div className="info-item">
                  <label>Electron Version</label>
                  <span>{systemInfo.electronVersion}</span>
                </div>
              </div>
            )}

            <div className="system-actions">
              <button className="btn btn-secondary">
                <Database size={16} />
                Clear Cache
              </button>
              <button className="btn btn-secondary">
                <RotateCcw size={16} />
                Reset All Data
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="header-title">
          <Settings className="title-icon" />
          <h2>Settings</h2>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>

          <div className="settings-actions">
            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Reset to Defaults
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
