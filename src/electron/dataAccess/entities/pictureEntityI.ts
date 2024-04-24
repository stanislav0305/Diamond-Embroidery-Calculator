import { BasetEntityI } from '@dataAccess/entities/baseEntityI'


export interface PictureEntityI extends BasetEntityI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType //площадь покрытия

    detiles: PictureDetileEntityI[]
    detilesSumTotal: number

    pricePerHour: number
    hoursSpent: number

    bayFullPrice: number

    comment: string
}

export interface PictureDetileEntityI {
    name: string
    price:number
}

export type DiamondFormType = 'circle' | 'square'
export type CoverageAreaType = 'total' | 'partial'