import { nativeTheme } from 'electron'
import ThemeConverter from '@mainUtils/converters/themeConverter'
import ThemeModeType from '@shared/types/themeModeType'
import { themeRepo } from '@dataAccess/repositories/themeStoreRepo'


export default class NativeTheme {
    constructor() {
        const theme = themeRepo.get()
        this.set(theme.mode)
    }

    set(mode: ThemeModeType) {
        console.log(`nativeTheme set from ${nativeTheme.themeSource} to ${mode}`)
        nativeTheme.themeSource = ThemeConverter.toNativeThemeName(mode)
    }

    get(): ThemeModeType {
        return ThemeConverter.toThemeMode(nativeTheme.themeSource) as ThemeModeType
    }
}