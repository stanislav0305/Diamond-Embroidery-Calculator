export const themeNames = ['cerulean', 'darkly', 'litera', 'materia', 'pulse', 'simplex',
    'solar', 'united', 'zephyr', 'cosmo', 'flatly', 'lumen', 'minty', 'quartz', 'sketchy',
    'spacelab', 'vapor', 'cyborg', 'journal', 'lux', 'morph', 'sandstone', 'slate', 'superhero',
    'yeti'] as const;

type ThemeNameType = typeof themeNames[number];
export default ThemeNameType