import ThemeModeType from '@shared/types/themeModeType'
import { NativeThemeNameType } from '@general/types/nativeThemeNameType'


export default class ThemeConverter {
    private constructor() { }

    static toThemeMode(nativeTheme: NativeThemeNameType) {
        return (nativeTheme === 'system' ? 'auto' : nativeTheme) as ThemeModeType
    }

    static toNativeThemeName(mode: ThemeModeType) {
        return (mode === 'auto' ? 'system' : mode) as NativeThemeNameType
    }
}