import { IpcRendererEvent } from 'electron'
import ThemeSettingsI from '@shared/interfaces/themeSettingsI'
import AppSettingsI from '@shared/interfaces/appSettingsI'


export default interface ContextBridgeApiI {
  theme: {
    getCurrent: () => Promise<ThemeSettingsI>
    set: (settings: ThemeSettingsI) => Promise<ThemeSettingsI>
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