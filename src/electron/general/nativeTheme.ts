import { nativeTheme } from 'electron'
import ThemeConverter from '@mainUtils/converters/themeConverter'
import ThemeModeType from '@shared/types/themeModeType'


export class NativeTheme {
    constructor(mode: ThemeModeType) {
        this.set(mode)
    }

    set(mode: ThemeModeType) {
        console.log(`nativeTheme set from ${nativeTheme.themeSource} to ${mode}`)
        nativeTheme.themeSource = ThemeConverter.toNativeThemeName(mode)
    }
}