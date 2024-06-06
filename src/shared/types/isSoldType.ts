export const isSoldDefault = false
export const isSoldValues = [true, false] as const
type IsSoldType = typeof isSoldValues[number]
export default IsSoldType

export const isSoldMap: Map<IsSoldType, string> = new Map<IsSoldType, string>([
    [true, 'Продана'],
    [false, 'Не продана'],
])