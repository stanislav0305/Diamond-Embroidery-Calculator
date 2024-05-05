import { Schema } from 'electron-store';
import { BasetEntityI } from '@dataAccess/entities/baseEntityI'
import { HistoryEntityI } from './historyEntity';


export interface PictureDetailEntityI extends BasetEntityI {
    name: string
    price: number
}

export const pictureDetailsShema = {
    type: 'array',
    default: [] as PictureDetailEntityI[],
    items: {
        type: 'object',
        required: ['id', 'name', 'price'],
        properties: {
            id: {
                type: 'string'
            },
            name: {
                type: 'string',
            },
            price:
            {
                type: 'number',
                default: 0,
            }
        } as Schema<PictureDetailEntityI>
    }
}


const diamondFormDefault = 'circle'
const diamondForms = ['circle', 'square']
export type DiamondFormType = typeof diamondForms[number];

const coverageAreaDefault = 'total'
const coverageAreas = ['total', 'partial']
export type CoverageAreaType = typeof coverageAreas[number];

export interface PictureEntityI extends HistoryEntityI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType //площадь покрытия

    details: PictureDetailEntityI[]
    detailsSumTotal: number

    pricePerHour: number
    hoursSpent: number
    forHoursSpentTotal: number

    bayFullPrice: number

    comment: string
}

export const pictureDetailsDefaultSetShema = {
    type: 'array',
    default: [] as PictureDetailEntityI[],
    items: pictureDetailsShema,
}

export const picturesShema = {
    type: 'array',
    default: [] as PictureEntityI[],
    items: {
        type: 'object',
        required: ['id', 'height', 'width', 'diamondForm', 'coverageArea', 'detailsSumTotal', 'forHoursSpentTotal', 'bayFullPrice', 'created'],
        properties: {
            id: {
                type: 'string'
            },
            height: {
                type: 'number',
            },
            width: {
                type: 'number',
            },
            diamondForm: {
                type: 'string',
                enum: diamondForms,
                default: diamondFormDefault,
            },
            coverageArea: { //площадь покрытия
                type: 'string',
                enum: coverageAreas,
                default: coverageAreaDefault,
            },
            details: pictureDetailsShema,
            detailsSumTotal: {
                type: 'number',
                default: 0,
            },
            pricePerHour: {
                type: 'number',
                default: 0
            },
            hoursSpent: {
                type: 'number',
                default: 0
            },
            forHoursSpentTotal:{
                type: 'number',
                default: 0
            },
            bayFullPrice: {
                type: 'number',
                default: 0,
            },
            comment: {
                type: 'string'
            },
            created: {
                type: 'string'
            },
            updated: {
                type: 'string'
            }
        } as Schema<PictureEntityI>
    }
}