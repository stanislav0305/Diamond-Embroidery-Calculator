export const coverageAreaDefault = 'total'
export const coverageAreas = ['total', 'partial'] as const
type CoverageAreaType = typeof coverageAreas[number]
export default CoverageAreaType

export const coverageAreasDataMap: Map<CoverageAreaType, string> = new Map<CoverageAreaType, string>([
    ['total', 'полная'],
    ['partial', 'частичная'],
])