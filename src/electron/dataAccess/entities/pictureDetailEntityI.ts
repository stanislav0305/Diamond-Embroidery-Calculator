import { Schema } from 'electron-store';
import { BasetEntityI } from '@dataAccess/entities/baseEntityI'


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

export const pictureDefaultSetShema = {
    details: pictureDetailsShema,
}