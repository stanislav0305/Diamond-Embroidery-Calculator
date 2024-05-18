export const diamondFormDefault = 'circle'
export const diamondForms = ['circle', 'square'] as const
type DiamondFormType = typeof diamondForms[number]
export default DiamondFormType

export const diamondFormDataMap: Map<DiamondFormType, string> = new Map<DiamondFormType, string>([
    ['circle', 'круг'],
    ['square', 'квадрат'],
])