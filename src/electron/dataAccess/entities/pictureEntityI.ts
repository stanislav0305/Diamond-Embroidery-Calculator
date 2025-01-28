import { Schema } from 'electron-store'
import HistoryEntityI from '@dataAccess/entities/historyEntity'
import { PictureDetailEntityI, pictureDetailsSchema } from '@dataAccess/entities/pictureDetailEntityI'
import PictureImageEntityI, { pictureImagesSchema } from '@dataAccess/entities/pictureImageEntityI'
import PicturesDefaultSetEntityI, { picturesDefaultSetSchema } from '@dataAccess/entities/picturesDefaultSetEntity'


const diamondFormDefault = 'circle'
const diamondForms = ['circle', 'square']
type DiamondFormType = typeof diamondForms[number]

const coverageAreaDefault = 'total'
const coverageAreas = ['total', 'partial']
type CoverageAreaType = typeof coverageAreas[number]

const isSoldDefault = false
const isSoldValues = [true, false] as const
type IsSoldType = typeof isSoldValues[number]

export interface PictureEntityI extends HistoryEntityI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType

    details: PictureDetailEntityI[]
    detailsSumTotal: number

    images: PictureImageEntityI[]

    pricePerHour: number
    hoursSpent: number
    forHoursSpentTotal: number

    bayFullPrice: number
    isSold: IsSoldType

    comment: string
}

export const picturesSchema = {
    type: 'object',
    default: {},
    propertyNames: {
        pattern: "^[A-Za-z0-9_]*$"
    },
    additionalProperties: {
        type: 'object',
        required: ['id', 'height', 'width', 'diamondForm', 'coverageArea', 'detailsSumTotal', 'forHoursSpentTotal', 'bayFullPrice', 'isSold', 'created'],
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
            coverageArea: {
                type: 'string',
                enum: coverageAreas,
                default: coverageAreaDefault,
            },
            details: pictureDetailsSchema,
            detailsSumTotal: {
                type: 'number',
                default: 0,
            },
            images: pictureImagesSchema,
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
            isSold:{
                type: 'boolean',
                default: isSoldDefault
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

export interface PicturesStoreSchemaI {
    picturesDefaultSet: PicturesDefaultSetEntityI
    pictures: {}
}

export const picturesStoreSchema = {
    picturesDefaultSet: picturesDefaultSetSchema,
    pictures: picturesSchema
} as Schema<PicturesStoreSchemaI>