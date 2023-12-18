import LogMainHelper from '@mainUtils/helpers/logMainHelper'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'
import { AppSettingsEntityI } from '@dataAccess/entities/appSettingsEntityI'


class AppSettingsRepo {
    get() {
        return {
            versions: {
                node: process.versions.node,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            },
            paths: {
                logPath: LogMainHelper.path,
                mainConfigPath: themeRepo.path
            }
        } as AppSettingsEntityI
    }
}

export const appSettingsRepo = new AppSettingsRepo()