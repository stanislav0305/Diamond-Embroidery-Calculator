import IContextBridgeApi from '@shared/interfaces/ipc/contextBridgeApiI'
export { }


declare global {
  interface Window {
    'api': IContextBridgeApi
  }
}