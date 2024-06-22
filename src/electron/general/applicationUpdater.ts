import { autoUpdater } from 'electron-updater'
import MainWindow from '@general/window'
import { Application } from '@general/application'
import { DialogHelper } from '@mainUtils/helpers/dialogHelper'
import { ProgressBarHelper } from '@mainUtils/helpers/progressBarHelper'
import { ONE_MB_IN_BYTES, ONE_MB_IN_KB } from '@shared/consts'


autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

export default class ApplicationUpdater {
    private constructor() { }

    static checkForUpdates(application: Application, mainWindow: MainWindow) {
        autoUpdater
            .on('checking-for-update', () => {
                console.log(`ApplicationUpdater: checking-for-update.`)
            })
            .on('login', (info: Electron.AuthInfo) => {
                console.log(`ApplicationUpdater login: ${JSON.stringify(info)}`)
            })
            .on('update-not-available', (info) => {
                console.log(`ApplicationUpdater: update-not-available.`)
            })
            .on('update-available', (info) => {
                console.log(`Application update: update-available.`)

                mainWindow.getBrowserWindow().hide()

                DialogHelper.applicationUpdateConfirm(mainWindow)
                    .then((resp: Electron.MessageBoxReturnValue) => {
                        if (resp.response === 0) {
                            autoUpdater.downloadUpdate()
                            ProgressBarHelper.createAppUpdateDownloadProgressBar()
                        } else {
                            mainWindow.getBrowserWindow().show()
                        }
                    })
            })
            .on('download-progress', (progressObj) => {
                const procent = progressObj.percent.toFixed(1)
                console.log(`ApplicationUpdater: download-progress, downloaded: ${procent}%`)

                progressObj.transferred

                const pBar = ProgressBarHelper.appUpdateDownloadProgressBar
                const perSecondInMb = (progressObj.bytesPerSecond / ONE_MB_IN_BYTES).toFixed(2)
                const transferredInMb = (progressObj.transferred/ ONE_MB_IN_KB).toFixed(2)
                const totalInMb = (progressObj.total/ ONE_MB_IN_KB).toFixed(2)

                pBar.detail = `Скорость загрузки: ${perSecondInMb} Mb/сек. 
                - Загружено ${procent}% (${transferredInMb} Mb / ${totalInMb} Mb)`

                pBar.value = progressObj.percent
            })
            .on('update-downloaded', (info) => {
                console.log(`ApplicationUpdater: update-downloaded.`)

                const pBar = ProgressBarHelper.appUpdateDownloadProgressBar
                pBar.isCompleted()

                console.log(`ApplicationUpdater: quitAndInstall...`)
                autoUpdater.quitAndInstall(false, true)
            })
            .on('update-cancelled', (info) => {
                console.log(`ApplicationUpdater: update-cancelled, ${JSON.stringify(info)}`)
            })
            .on('error', (error: Error, message?: string | undefined) => {
                const msg = `Error: ${JSON.stringify(error)} Message: ${message}`
                console.error(`ApplicationUpdater error: ${msg}`)
                DialogHelper.applicationUpdateErrorMessage(msg)
                    .then(() => {
                        mainWindow.getBrowserWindow().show()
                    })
            })


        autoUpdater.checkForUpdates()
            .then(() => {
                console.log(`ApplicationUpdater: checkForUpdates ended`)
            })
            .catch((error: Error) => {
                console.error(`ApplicationUpdater: checkForUpdates error, Error:${JSON.stringify(error)}`)
            })
    }
}