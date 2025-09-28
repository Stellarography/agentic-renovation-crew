
import { contextBridge, ipcRenderer } from 'electron'

// Define API types
interface ElectronAPI {
  // Agent operations
  agent: {
    sendMessage: (message: any) => Promise<AsyncIterable<any>>
    getConfigs: () => Promise<any[]>
    updateConfig: (config: any) => Promise<boolean>
  }
  
  // File operations
  file: {
    openDialog: () => Promise<string[] | null>
    saveDialog: () => Promise<string | null>
    read: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>
    write: (path: string, content: string) => Promise<{ success: boolean; error?: string }>
  }
  
  // System info
  system: {
    getInfo: () => Promise<{ platform: string; version: string; electronVersion: string }>
  }
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  agent: {
    sendMessage: (message: any) => ipcRenderer.invoke('agent:send-message', message),
    getConfigs: () => ipcRenderer.invoke('agent:get-configs'),
    updateConfig: (config: any) => ipcRenderer.invoke('agent:update-config', config)
  },
  file: {
    openDialog: () => ipcRenderer.invoke('file:open-dialog'),
    saveDialog: () => ipcRenderer.invoke('file:save-dialog'),
    read: (path: string) => ipcRenderer.invoke('file:read', path),
    write: (path: string, content: string) => ipcRenderer.invoke('file:write', path, content)
  },
  system: {
    getInfo: () => ipcRenderer.invoke('system:get-info')
  }
} as ElectronAPI)

// Type definitions for the renderer
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
