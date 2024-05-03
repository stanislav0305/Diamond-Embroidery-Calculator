import { BaseI } from '@shared/interfaces/baseI'
import DiamondFormType from '@shared/types/diamondFormType'
import CoverageAreaType from '@shared/types/coverageAreaType'


export default interface PictureI extends BaseI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType //площадь покрытия

    detiles: PictureDetileI[]
    detilesSumTotal: number

    pricePerHour: number
    hoursSpent: number

    bayFullPrice: number

    comment: string
}

export interface PictureDetileI {
    name: string
    price:number
}