export const nativeThemeNames = ['light' , 'dark' , 'system'] as const
export type NativeThemeNameType = typeof nativeThemeNames[number]