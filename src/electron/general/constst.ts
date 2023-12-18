import path from 'path'


export const iconPath = path.resolve(__dirname, 'assets', 'diamond.ico')
export const preloadJsPath = path.join(__dirname, 'preload.js')
export const indexHtmlPath = path.resolve(__dirname, 'index.html')

export const isDev = process.env.NODE_ENV === 'development'