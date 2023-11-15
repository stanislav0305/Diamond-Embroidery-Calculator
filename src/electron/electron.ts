const { app, BrowserWindow } = require('electron');

// Данные о главном окне приложения.
let mainWindow: ReturnType<typeof BrowserWindow> | null;

function createWindow() {
  // Создаем окно
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600
    //autoHideMenuBar: true //скрыть меню окна
    // webPreferences: {
    //  nodeIntegration: true
    // }
  });

  // Загружаем React приложение.
  mainWindow.loadFile('index.html');

  // Открываем DevTools только во время разработки.
  if (process.env.NODE_ENV === 'development') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; //скрыть предупреждения в консоле
    mainWindow.webContents.openDevTools();
  }

  // Закрытие главного окна приводит к выходу из приложения.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Создаем главное окно приложения после того, как Electron запустится.
app.on('ready', createWindow);

// Закрываем приложение, когда все окна закрыты.
app.on('window-all-closed', () => {
  //В OS X это обычное дело для приложений оставаться активным до тех пор, 
  //пока пользователь не выйдет явно с помощью Cmd + Q
  //Потому если это не виндовс и все окна закрыты, то закрываем приложение
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Возвращаем приложение в фокус, если пользователь его открыл через иконку в Dock.
// В OS X обычно заново создают окно приложения, когда значок закрепления нажат, 
// и другие окна приложения не открыты - когда окно приложения сново активно.
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});