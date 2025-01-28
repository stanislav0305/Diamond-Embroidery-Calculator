import { Schema } from 'electron-store'
import BaseEntityI from '@dataAccess/entities/baseEntityI'


export interface PictureDetailEntityI extends BaseEntityI {
    name: string
    price: number
}

export const pictureDetailsSchema = {
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

export const pictureDefaultSetSchema = {
    details: pictureDetailsSchema,
}