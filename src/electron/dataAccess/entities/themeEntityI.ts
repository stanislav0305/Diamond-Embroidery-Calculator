import { Schema } from 'electron-store';
import { BasetEntityI } from '@dataAccess/entities/baseEntityI'


export type ThemeModesType = 'light' | 'dark' | 'auto'

export interface ThemeEntityI extends BasetEntityI {
    mode: ThemeModesType
    name: string
}

export const themeShema = {
    type: 'object',
    properties: {
        mode: {
            type: 'string',
            enum: ['light', 'dark', 'auto'],
            default: 'auto'
        },
        name: {
            type: 'string',
            default: 'cerulean'
        },
    } as Schema<ThemeEntityI>,
    default: {},
    required: ['mode', 'name']
}