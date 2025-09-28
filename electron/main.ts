
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'

// Types for IPC communication
interface AgentMessage {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: number
  agentId?: string
}

interface StreamChunk {
  id: string
  content: string
  done: boolean
}

interface AgentConfig {
  id: string
  name: string
  type: string
  description: string
  enabled: boolean
  config: Record<string, any>
}

class MainProcess {
  private mainWindow: BrowserWindow | null = null
  private isDev = process.env.NODE_ENV === 'development'

  constructor() {
    this.setupApp()
    this.setupIpcHandlers()
  }

  private setupApp(): void {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore()
          this.mainWindow.focus()
        }
      })

      app.whenReady().then(() => {
        this.createWindow()
      })

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    }
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: false
      },
      titleBarStyle: 'default',
      show: false
    })

    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:5173')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })
  }

  private setupIpcHandlers(): void {
    // Agent conversation streaming
    ipcMain.handle('agent:send-message', async (event, message: AgentMessage) => {
      return this.handleAgentMessage(message)
    })

    // Agent management
    ipcMain.handle('agent:get-configs', async () => {
      return this.getAgentConfigs()
    })

    ipcMain.handle('agent:update-config', async (event, config: AgentConfig) => {
      return this.updateAgentConfig(config)
    })

    // File operations for document management
    ipcMain.handle('file:open-dialog', async () => {
      if (!this.mainWindow) return null
      
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Documents', extensions: ['md', 'txt', 'json', 'pdf'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      return result.canceled ? null : result.filePaths
    })

    ipcMain.handle('file:save-dialog', async () => {
      if (!this.mainWindow) return null

      const result = await dialog.showSaveDialog(this.mainWindow, {
        filters: [
          { name: 'Markdown', extensions: ['md'] },
          { name: 'JSON', extensions: ['json'] },
          { name: 'Text', extensions: ['txt'] }
        ]
      })

      return result.canceled ? null : result.filePath
    })

    ipcMain.handle('file:read', async (event, filePath: string) => {
      try {
        const content = readFileSync(filePath, 'utf-8')
        return { success: true, content }
      } catch (error) {
        return { success: false, error: (error as Error).message }
      }
    })

    ipcMain.handle('file:write', async (event, filePath: string, content: string) => {
      try {
        writeFileSync(filePath, content, 'utf-8')
        return { success: true }
      } catch (error) {
        return { success: false, error: (error as Error).message }
      }
    })

    // System info
    ipcMain.handle('system:get-info', async () => {
      return {
        platform: process.platform,
        version: app.getVersion(),
        electronVersion: process.versions.electron
      }
    })
  }

  private async handleAgentMessage(message: AgentMessage): Promise<AsyncIterable<StreamChunk>> {
    // Mock streaming response - replace with actual AI integration
    const responses = [
      "I understand your request. Let me analyze this step by step...",
      "Based on my analysis, here are my recommendations:",
      "1. First, let's consider the architectural patterns",
      "2. We should implement proper error handling",
      "3. Documentation and testing will be crucial",
      "I'm ready to assist you with the implementation. What would you like to focus on first?"
    ]

    return this.createMockStream(message.id, responses.join('\n\n'))
  }

  private async* createMockStream(messageId: string, content: string): AsyncIterable<StreamChunk> {
    const words = content.split(' ')
    let currentContent = ''

    for (let i = 0; i < words.length; i++) {
      currentContent += (i > 0 ? ' ' : '') + words[i]
      
      yield {
        id: messageId,
        content: currentContent,
        done: false
      }

      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
    }

    yield {
      id: messageId,
      content: currentContent,
      done: true
    }
  }

  private getAgentConfigs(): AgentConfig[] {
    // Mock agent configurations - replace with actual storage
    return [
      {
        id: 'code-gen',
        name: 'Code Generation Agent',
        type: 'code-generation',
        description: 'Specialized in generating, reviewing, and optimizing code',
        enabled: true,
        config: {
          language: 'typescript',
          framework: 'react',
          testingFramework: 'jest'
        }
      },
      {
        id: 'doc-agent',
        name: 'Documentation Agent',
        type: 'documentation',
        description: 'Creates and maintains technical documentation',
        enabled: true,
        config: {
          format: 'markdown',
          includeExamples: true,
          apiDocs: true
        }
      },
      {
        id: 'discovery',
        name: 'Discovery Agent',
        type: 'discovery',
        description: 'Analyzes codebases and discovers patterns and issues',
        enabled: false,
        config: {
          scanDepth: 'full',
          includeTests: true,
          reportFormat: 'json'
        }
      }
    ]
  }

  private updateAgentConfig(config: AgentConfig): boolean {
    // Mock update - replace with actual persistence
    console.log('Updating agent config:', config)
    return true
  }
}

// Initialize main process
new MainProcess()
