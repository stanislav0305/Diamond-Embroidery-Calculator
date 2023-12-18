import { IpcRendererEvent } from 'electron'
import ThemeI from '@shared/interfaces/themeI'
import AppSettingsI from '@shared/interfaces/appSettingsI'


export default interface ContextBridgeApiI {
  theme: {
    getCurrent: () => Promise<ThemeI>
    set: (settings: ThemeI) => Promise<ThemeI>
  },
  app: {
    getSettings: () => Promise<AppSettingsI>
    close: () => Promise<void>
  },
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    unmaximize: () => Promise<void>
    on: {
      unmaximized: (listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    },
    off: {
      unmaximized: () => void
    }
  }
}