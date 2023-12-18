import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import ContextBridgeApiI from '@shared/interfaces/contextBridgeApiI'


const API: ContextBridgeApiI = {
  theme: {
    getCurrent: ()  => ipcRenderer.invoke('theme:getCurrent').catch(e => console.error(e)),
    set: (settings: ThemeI) => ipcRenderer.invoke('theme:set', settings).catch(e => console.error(e))
  },
  app: {
    getSettings: () => ipcRenderer.invoke('app:getSettings').catch(e => console.error(e)),
    close: () => ipcRenderer.invoke('app:close').catch(e => console.error(e))
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize').catch(e => console.error(e)),
    maximize: () => ipcRenderer.invoke('window:maximize').catch(e => console.error(e)),
    unmaximize: () => ipcRenderer.invoke('window:unmaximize').catch(e => console.error(e)),
    on: {
      unmaximized: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('unmaximized', listener)
      }
    },
    off: {
      unmaximized: () => {
        ipcRenderer.removeAllListeners('unmaximized')
      }
    }
  }
}


contextBridge.exposeInMainWorld('api', API)