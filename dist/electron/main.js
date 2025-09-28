"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
class MainProcess {
  mainWindow = null;
  isDev = process.env.NODE_ENV === "development";
  constructor() {
    this.setupApp();
    this.setupIpcHandlers();
  }
  setupApp() {
    const gotTheLock = electron.app.requestSingleInstanceLock();
    if (!gotTheLock) {
      electron.app.quit();
    } else {
      electron.app.on("second-instance", (event, commandLine, workingDirectory) => {
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore();
          this.mainWindow.focus();
        }
      });
      electron.app.whenReady().then(() => {
        this.createWindow();
      });
      electron.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
          electron.app.quit();
        }
      });
      electron.app.on("activate", () => {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    }
  }
  createWindow() {
    this.mainWindow = new electron.BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
        webSecurity: false
      },
      titleBarStyle: "default",
      show: false
    });
    if (this.isDev) {
      this.mainWindow.loadURL("http://localhost:5173");
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
    this.mainWindow.once("ready-to-show", () => {
      this.mainWindow?.show();
    });
  }
  setupIpcHandlers() {
    electron.ipcMain.handle("agent:send-message", async (event, message) => {
      return this.handleAgentMessage(message);
    });
    electron.ipcMain.handle("agent:get-configs", async () => {
      return this.getAgentConfigs();
    });
    electron.ipcMain.handle("agent:update-config", async (event, config) => {
      return this.updateAgentConfig(config);
    });
    electron.ipcMain.handle("file:open-dialog", async () => {
      if (!this.mainWindow) return null;
      const result = await electron.dialog.showOpenDialog(this.mainWindow, {
        properties: ["openFile", "multiSelections"],
        filters: [
          { name: "Documents", extensions: ["md", "txt", "json", "pdf"] },
          { name: "All Files", extensions: ["*"] }
        ]
      });
      return result.canceled ? null : result.filePaths;
    });
    electron.ipcMain.handle("file:save-dialog", async () => {
      if (!this.mainWindow) return null;
      const result = await electron.dialog.showSaveDialog(this.mainWindow, {
        filters: [
          { name: "Markdown", extensions: ["md"] },
          { name: "JSON", extensions: ["json"] },
          { name: "Text", extensions: ["txt"] }
        ]
      });
      return result.canceled ? null : result.filePath;
    });
    electron.ipcMain.handle("file:read", async (event, filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        return { success: true, content };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    electron.ipcMain.handle("file:write", async (event, filePath, content) => {
      try {
        fs.writeFileSync(filePath, content, "utf-8");
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    electron.ipcMain.handle("system:get-info", async () => {
      return {
        platform: process.platform,
        version: electron.app.getVersion(),
        electronVersion: process.versions.electron
      };
    });
  }
  async handleAgentMessage(message) {
    const responses = [
      "I understand your request. Let me analyze this step by step...",
      "Based on my analysis, here are my recommendations:",
      "1. First, let's consider the architectural patterns",
      "2. We should implement proper error handling",
      "3. Documentation and testing will be crucial",
      "I'm ready to assist you with the implementation. What would you like to focus on first?"
    ];
    return this.createMockStream(message.id, responses.join("\n\n"));
  }
  async *createMockStream(messageId, content) {
    const words = content.split(" ");
    let currentContent = "";
    for (let i = 0; i < words.length; i++) {
      currentContent += (i > 0 ? " " : "") + words[i];
      yield {
        id: messageId,
        content: currentContent,
        done: false
      };
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));
    }
    yield {
      id: messageId,
      content: currentContent,
      done: true
    };
  }
  getAgentConfigs() {
    return [
      {
        id: "code-gen",
        name: "Code Generation Agent",
        type: "code-generation",
        description: "Specialized in generating, reviewing, and optimizing code",
        enabled: true,
        config: {
          language: "typescript",
          framework: "react",
          testingFramework: "jest"
        }
      },
      {
        id: "doc-agent",
        name: "Documentation Agent",
        type: "documentation",
        description: "Creates and maintains technical documentation",
        enabled: true,
        config: {
          format: "markdown",
          includeExamples: true,
          apiDocs: true
        }
      },
      {
        id: "discovery",
        name: "Discovery Agent",
        type: "discovery",
        description: "Analyzes codebases and discovers patterns and issues",
        enabled: false,
        config: {
          scanDepth: "full",
          includeTests: true,
          reportFormat: "json"
        }
      }
    ];
  }
  updateAgentConfig(config) {
    console.log("Updating agent config:", config);
    return true;
  }
}
new MainProcess();
//# sourceMappingURL=main.js.map
