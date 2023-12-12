export const nativeThemeNames = ['light' , 'dark' , 'system'] as const;

type NativeThemeNameType = typeof nativeThemeNames[number];
export default NativeThemeNameType