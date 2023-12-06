import IContextBridgeApi from '@shared/interfaces/contextBridgeApiI'
export { }


declare global {
  interface Window {
    'api': IContextBridgeApi
  }
}