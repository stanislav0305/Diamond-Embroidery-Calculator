import { dialog } from 'electron'
import MainWindow from "@general/window"

export type ShowOpenDialogPropertiesType = ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory'
    | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent')[]

export class DialogHelper {
    private constructor() { }

    static applicationUpdateConfirm(mainWindow: MainWindow): Promise<Electron.MessageBoxReturnValue> {
        const options: Electron.MessageBoxOptions = {
            type: 'question',
            buttons: ['Обновить', 'Нет, обновить позже'],
            defaultId: 1,
            title: 'Обновление приложения',
            message: 'Доступна новая версия приложения. Желаете обновить приложение сейчас?',
        }

        return dialog.showMessageBox(mainWindow.getBrowserWindow(), options)
    }

    static applicationUpdatedMessage(): Promise<Electron.MessageBoxReturnValue> {
        const options: Electron.MessageBoxOptions = {
            type: 'info',
            buttons: ['Ок'],
            defaultId: 1,
            title: 'Обновление приложения',
            message: 'Приложение обновлено успешно и будет закрыто. Запустите приложение снова.',
        }

        return dialog.showMessageBox(options)
    }

    static applicationUpdateErrorMessage(error: string): Promise<Electron.MessageBoxReturnValue> {
        const options: Electron.MessageBoxOptions = {
            type: 'error',
            buttons: ['Ок'],
            defaultId: 1,
            title: 'Обновление приложения',
            message: `Произошла ошибка при обновлении приложения. Ошибка: ${error}`,
        }

        return dialog.showMessageBox(options)
    }

    static showOpenDialog(browserWindow: Electron.BrowserWindow,
        properties?: ShowOpenDialogPropertiesType)
        : Promise<Electron.OpenDialogReturnValue> {

        const options: Electron.OpenDialogOptions = {
            properties: properties
        }

        return dialog.showOpenDialog(browserWindow, options)
    }
}