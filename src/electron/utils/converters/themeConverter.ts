import ThemeModeType from "@shared/types/themeModeType";
import NativeThemeNameType from "electron/types/nativeThemeNameType";


export default class ThemeConverter {
    private constructor() { }

    static toThemeMode(nativeTheme: NativeThemeNameType) {
        return (nativeTheme === 'system' ? 'auto' : nativeTheme) as ThemeModeType
    }

    static toNativeThemeName(themeMode: ThemeModeType) {
        return (themeMode === 'auto' ? 'system' : themeMode) as NativeThemeNameType
    }
}