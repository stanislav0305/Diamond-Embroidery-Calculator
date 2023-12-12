export const themeModes = ['light', 'dark', 'auto'] as const;

export interface ThemeModeDataI {
    css: string,
    ruName: string
}

export const themeModesDataMap: Map<ThemeModeType, ThemeModeDataI> = new Map<ThemeModeType, ThemeModeDataI>([
    ['light', { css: 'bi bi-sun-fill', ruName: ' Светлая' }],
    ['dark', { css: 'bi bi-moon-stars-fill', ruName: ' Тёмная' }],
    ['auto', { css: 'bi bi-circle-half', ruName: ' Авто' }]
])

const t = themeModesDataMap.get ('light')

type ThemeModeType = typeof themeModes[number];
export default ThemeModeType