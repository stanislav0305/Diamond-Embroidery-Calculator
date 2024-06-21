import { app } from 'electron'
import LogMainHelper from '@mainUtils/helpers/logMainHelper'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'
import AppSettingsEntityI from '@dataAccess/entities/appSettingsEntityI'
import { IMAGES_PATH, PROJECT_PATH } from '@general/consts'
import AppSettingsI from '@shared/interfaces/appSettingsI'



class AppSettingsRepo {
    get() {
        const entity = {
            appName: app.getName(),
            versions: {
                app: app.getVersion(),
                node: process.versions.node,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            },
            paths: {
                logPath: LogMainHelper.path,
                mainConfigPath: themeRepo.path,
                projectPath: PROJECT_PATH,
                pictureImagesPath: IMAGES_PATH
            }
        } as AppSettingsEntityI

        return { ...entity } as AppSettingsI
    }
}

export const appSettingsRepo = new AppSettingsRepo()