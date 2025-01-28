import { Schema } from 'electron-store'
import BaseEntityI from '@dataAccess/entities/baseEntityI'
import { PictureDetailEntityI, pictureDetailsSchema } from '@dataAccess/entities/pictureDetailEntityI'


export default interface PicturesDefaultSetEntityI extends BaseEntityI{
    details: PictureDetailEntityI[]
    detailsSumTotal: number
    pricePerHour: number
    pricePerHourAutoCorrect: boolean
}

export const picturesDefaultSetSchema = {
    type: 'object',
    properties: {
        details: pictureDetailsSchema,
        detailsSumTotal: { 
            type: 'number', 
            default: 0 
        },
        pricePerHour: {
            type: 'number',
            default: 0
        },
        pricePerHourAutoCorrect: {
            type: 'boolean',
            default: true
        }
    } as Schema<PicturesDefaultSetEntityI>
}