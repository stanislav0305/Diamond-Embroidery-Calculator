import { Schema } from 'electron-store';
import { BasetEntityI } from "./baseEntityI";


export interface PictureImageEntityI extends BasetEntityI {
    ext: string,
    size: number,
    isMain: boolean
}

export const pictureImagesShema = {
    type: 'array',
    default: [] as PictureImageEntityI[],
    items: {
        type: 'object',
        required: ['id', 'size', 'isMain'],
        properties: {
            id: {
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
            isMain:{
                type:'boolean',
                default:false
            }
        } as Schema<PictureImageEntityI>
    }
}