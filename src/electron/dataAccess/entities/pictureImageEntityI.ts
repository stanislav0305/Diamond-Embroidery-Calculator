import { Schema } from 'electron-store'
import BaseEntityI from '@dataAccess/entities/baseEntityI'


export default interface PictureImageEntityI extends BaseEntityI {
    name: string
    type: string
    ext: string
    size: number
    isMain: boolean
    isLoaded: boolean
}

export const pictureImagesSchema = {
    type: 'array',
    default: [] as PictureImageEntityI[],
    items: {
        type: 'object',
        required: ['id', 'size', 'isMain', 'isLoaded'],
        properties: {
            id: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            type: {
                type: 'string'
            },
            ext: {
                type: 'string',
            },
            size:
            {
                type: 'number',
                default: 0,
            },
            isMain: {
                type: 'boolean',
                default: false
            },
            isLoaded: {
                type: 'boolean',
                default: false
            }
        } as Schema<PictureImageEntityI>
    }
}