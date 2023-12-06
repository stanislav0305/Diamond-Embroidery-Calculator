import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import ThemeSettingsI from '@shared/theme/themeSettingsI'
import ContextBridgeApiI from '@shared/interfaces/contextBridgeApiI'


const API: ContextBridgeApiI = {
  theme: {
    getCurrent: ()  => ipcRenderer.invoke('theme:getCurrent').catch(e => console.log(e)),
    set: (settings: ThemeSettingsI) => ipcRenderer.invoke('theme:set', settings).catch(e => console.log(e))
  },
  app: {
    getSettings: () => ipcRenderer.invoke('app:getSettings').catch(e => console.log(e)),
    close: () => ipcRenderer.invoke('app:close').catch(e => console.log(e))
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize').catch(e => console.log(e)),
    maximize: () => ipcRenderer.invoke('window:maximize').catch(e => console.log(e)),
    unmaximize: () => ipcRenderer.invoke('window:unmaximize').catch(e => console.log(e)),
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