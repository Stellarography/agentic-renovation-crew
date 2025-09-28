import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { AIService } from '../core/ai/aiservice';
import z from 'zod';

const StreamChunkSchema = z.object({
  model: z.string(),
  created_at: z.string(),
  response: z.string(),
  done: z.boolean(),
});

class MainProcess {
  private mainWindow: BrowserWindow | null = null;
  private isDev = process.env.NODE_ENV === 'development';
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
    this.setupApp();
    this.setupIpcHandlers();
  }

  private setupApp(): void {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore();
          this.mainWindow.focus();
        }
      });

      app.whenReady().then(() => {
        this.createWindow();
      });

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
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
        webSecurity: false,
      },
      titleBarStyle: 'default',
      show: false,
    });

    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });
  }

  private setupIpcHandlers(): void {
    ipcMain.handle('ai:generate-stream', async (event, prompt: string, model: string) => {
      const stream = await this.aiService.generateStream(prompt, model);

      let lastSent = Date.now();
      const throttleMs = 50;

      for await (const chunk of stream) {
        try {
          const jsonString = new TextDecoder().decode(chunk);
          const parsed = JSON.parse(jsonString);
          const validation = StreamChunkSchema.safeParse(parsed);

          if (validation.success) {
            const now = Date.now();
            if (now - lastSent > throttleMs) {
              this.mainWindow?.webContents.send('ai:stream-chunk', { content: validation.data.response });
              lastSent = now;
            }
          }
        } catch (error) {
          // Ignore JSON parsing errors for incomplete chunks
        }
      }
    });

    // File operations
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
    });

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
    });

    ipcMain.handle('file:read', async (event, filePath: string) => {
        try {
            const content = readFileSync(filePath, 'utf-8')
            return { success: true, content }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        }
    });

    ipcMain.handle('file:write', async (event, filePath: string, content: string) => {
        try {
            writeFileSync(filePath, content, 'utf-8')
            return { success: true }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        }
    });

    // System info
    ipcMain.handle('system:get-info', async () => {
        return {
            platform: process.platform,
            version: app.getVersion(),
            electronVersion: process.versions.electron
        }
    });
  }
}

new MainProcess();