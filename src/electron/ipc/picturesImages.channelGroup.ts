import path from 'path'
import { IpcMainInvokeEvent, ipcMain } from 'electron'
import Channels from '@shared/interfaces/ipc/channels'
import MainWindow from '@electron/general/window'
import { IMAGES_PATH } from '@electron/general/consts'
import FileHelper from '@electron/utils/helpers/fileHelper'


export default class PicturesImagesChannelGroup {
  private static mainWindow: MainWindow

  public static registry(mainWindow: MainWindow) {
    PicturesImagesChannelGroup.mainWindow = mainWindow

    ipcMain.handle(Channels.pictures_images_download, (event: IpcMainInvokeEvent, id: string) => PicturesImagesChannelGroup.download(event, id))
  }

  private static download(event: IpcMainInvokeEvent, fileName: string): void {
    console.info(Channels.pictures_images_download)

    PicturesImagesChannelGroup.mainWindow
      .showOpenDialog(['openDirectory', 'createDirectory'])
      .then(result => {
        if (!result.canceled) {
          const src = path.join(IMAGES_PATH, fileName)
          const dest = path.join(result.filePaths[0], fileName)
          const copyResult = FileHelper.copy(src, dest)

          event.sender.send(Channels.pictures_images_downloaded, copyResult)

          copyResult ? console.log(`File ${fileName} downloaded successfully. `)
            : console.error(`File ${fileName} not downloaded. `)
        }
      }).catch(err => {
        console.error('File download error. ', err)
      })
  }

}