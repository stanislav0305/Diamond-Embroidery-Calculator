import { Schema } from 'electron-store'
import { BasetEntityI } from '@dataAccess/entities/baseEntityI'
import { PictureDetailEntityI, pictureDetailsShema } from '@dataAccess/entities/pictureDetailEntityI'


export interface PicturesDefaultSetEntityI extends BasetEntityI{
    details: PictureDetailEntityI[],
    detailsSumTotal: number,
    pricePerHour: number
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
    } as Schema<PicturesDefaultSetEntityI>
}