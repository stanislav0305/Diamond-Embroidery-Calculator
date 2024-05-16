import { app } from 'electron';
import path from 'path'


export const ICON_PATH = path.resolve(__dirname, 'assets', 'diamond.ico')
export const PRELOAD_JS_PATH = path.join(__dirname, 'preload.js')
export const INDEX_HTML_PATH = path.resolve(__dirname, 'index.html')

export const PROJECT_PATH = app.getPath('userData')
export const IMAGES_DIR = 'loaded-images'
export const IMAGES_PATH = path.join(PROJECT_PATH, IMAGES_DIR)

export const IS_DEV = process.env.NODE_ENV === 'development'