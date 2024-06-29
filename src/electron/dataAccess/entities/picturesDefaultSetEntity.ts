import { Schema } from 'electron-store'
import BasetEntityI from '@dataAccess/entities/baseEntityI'
import { PictureDetailEntityI, pictureDetailsShema } from '@dataAccess/entities/pictureDetailEntityI'


export default interface PicturesDefaultSetEntityI extends BasetEntityI{
    details: PictureDetailEntityI[]
    detailsSumTotal: number
    pricePerHour: number
    pricePerHourAutoCorrect: boolean
}

export const picturesDefaultSetShema = {
    type: 'object',
    properties: {
        details: pictureDetailsShema,
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