/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/electron/electron.ts":
/*!**********************************!*\
  !*** ./src/electron/electron.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst { app, BrowserWindow } = __webpack_require__(/*! electron */ \"electron\");\n// Данные о главном окне приложения.\nlet mainWindow;\nfunction createWindow() {\n    // Создаем окно\n    let mainWindow = new BrowserWindow({\n        width: 800,\n        height: 600,\n        autoHideMenuBar: true //скрыть меню окна\n        // webPreferences: {\n        //  nodeIntegration: true\n        // }\n    });\n    // Загружаем React приложение.\n    mainWindow.loadFile('index.html');\n    // Открываем DevTools только во время разработки.\n    if (true) {\n        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';\n        mainWindow.webContents.openDevTools();\n    }\n    // Закрытие главного окна приводит к выходу из приложения.\n    mainWindow.on('closed', () => {\n        mainWindow = null;\n    });\n}\n// Создаем главное окно приложения после того, как Electron запустится.\napp.on('ready', createWindow);\n// Закрываем приложение, когда все окна закрыты.\napp.on('window-all-closed', () => {\n    //В OS X это обычное дело для приложений оставаться активным до тех пор, \n    //пока пользователь не выйдет явно с помощью Cmd + Q\n    //Потому если это не виндовс и все окна закрыты, то закрываем приложение\n    if (process.platform !== 'darwin') {\n        app.quit();\n    }\n});\n// Возвращаем приложение в фокус, если пользователь его открыл через иконку в Dock.\n// В OS X обычно заново создают окно приложения, когда значок закрепления нажат, \n// и другие окна приложения не открыты - когда окно приложения сново активно.\napp.on('activate', () => {\n    if (mainWindow === null) {\n        createWindow();\n    }\n});\n\n\n//# sourceURL=webpack://diamond-embroider-calculator/./src/electron/electron.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/electron/electron.ts");
/******/ 	
/******/ })()
;