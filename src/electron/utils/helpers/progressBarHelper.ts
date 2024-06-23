import ProgressBar from 'electron-progressbar'


export class ProgressBarHelper {
    static appUpdateDownloadProgressBar: ProgressBar

    private constructor() { }
    
    static createAppUpdateDownloadProgressBar() {
        ProgressBarHelper.appUpdateDownloadProgressBar = new ProgressBar({
            indeterminate: false,
            closeOnComplete: true,
            abortOnError: true,
            title: 'Обновление приложения',
            text: 'Загрузка обновления...',
            detail: 'Ждите...',
            initialValue: 0,
            maxValue: 100
        })
            .on('completed', () => {
                console.info('application update downloaded...');
                ProgressBarHelper.appUpdateDownloadProgressBar.detail = 'Загрузка обновления завершено. Выход...'
            })
            .on('aborted', () => {
                console.info('application update downloaded aborted...')
                ProgressBarHelper.appUpdateDownloadProgressBar.detail = 'Загрузка обновления прервано. Выход...'
            })

        return ProgressBarHelper.appUpdateDownloadProgressBar
    }
}