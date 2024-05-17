import { Schema } from 'electron-store'
import { HistoryEntityI } from '@dataAccess/entities/historyEntity'
import { PictureDetailEntityI, pictureDetailsShema } from '@dataAccess/entities/pictureDetailEntityI'
import { PictureImageEntityI, pictureImagesShema } from '@dataAccess/entities/pictureImageEntityI'
import { PicturesDefaultSetEntityI, picturesDefaultSetShema } from '@dataAccess/entities/picturesDefaultSetEntity'


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

    images: PictureImageEntityI[]

    pricePerHour: number
    hoursSpent: number
    forHoursSpentTotal: number

    bayFullPrice: number

    comment: string
}

export const picturesShema = {
    type: 'object',
    default: {},
    propertyNames: {
        pattern: "^[A-Za-z0-9_]*$"
    },
    additionalProperties: {
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
            images: pictureImagesShema,
            pricePerHour: {
                type: 'number',
                default: 0
            },
            hoursSpent: {
                type: 'number',
                default: 0
            },
            forHoursSpentTotal: {
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

export interface PicturesStoreShemaI {
    picturesDefaultSet: PicturesDefaultSetEntityI,
    pictures: {}
}

export const picturesStoreShema = {
    picturesDefaultSet: picturesDefaultSetShema,
    pictures: picturesShema
} as Schema<PicturesStoreShemaI>