const { app, BrowserWindow } = require('electron')
const path = require('path')

import log from 'electron-log/main'
/*
Логи будет сохранятся:
on Linux: ~/.config/{app name}/logs/main.log
on macOS: ~/Library/Logs/{app name}/main.log
on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log
C:\Users\User\AppData\Roaming\diamond-embroidery-calculator\logs\main.log
*/

console.log = log.log;
Object.assign(console, log.functions)

const isDev = process.env.NODE_ENV === 'development'

log.initialize({ preload: true })
console.info('-------------------------------------------------------')
console.info('Log from the main process')
console.info(`process.env.NODE_ENV = '${process.env.NODE_ENV}'`)


// Данные о главном окне приложения.
let mainWindow: ReturnType<typeof BrowserWindow> | null

function createWindow() {
  // Создаем окно
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(__dirname, 'assets', 'diamond.ico'),
    //autoHideMenuBar: true //скрыть меню окна
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Загружаем React приложение.
  console.info('React app loading...');
  let htmlUrl = path.resolve(__dirname, 'index.html')
  console.log(`htmlUrl='${htmlUrl}'`)

  mainWindow.loadFile(htmlUrl)

  // Открываем DevTools только во время разработки.
  if (isDev) {
    //process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; //скрыть предупреждения в консоле
    mainWindow.webContents.openDevTools()
  }

  // Закрытие главного окна приводит к выходу из приложения.
  mainWindow.on('closed', () => {
    console.log('mainWindow closed...')
    mainWindow = null
  })
}

// Создаем главное окно приложения после того, как Electron запустится.
app.on('ready', () => {
  console.log('app ready...')
  createWindow()
})

// Возвращаем приложение в фокус, если пользователь его открыл через иконку в Dock.
// В OS X обычно заново создают окно приложения, когда значок закрепления нажат, 
// и другие окна приложения не открыты - когда окно приложения сново активно.
app.on('activate', () => {
  console.log('app activate...')
  if (mainWindow === null) {
    createWindow()
  }
})

// Закрываем приложение, когда все окна закрыты.
app.on('window-all-closed', () => {
  console.log('app window-all-closed...')
  //В OS X это обычное дело для приложений оставаться активным до тех пор, 
  //пока пользователь не выйдет явно с помощью Cmd + Q
  //Потому если это не виндовс и все окна закрыты, то закрываем приложение
  if (process.platform !== 'darwin') {
    app.quit()
  }
})