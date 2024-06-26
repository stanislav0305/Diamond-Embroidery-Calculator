import { Schema } from 'electron-store'
import BasetEntityI from '@dataAccess/entities/baseEntityI'


export type ThemeModesType = 'light' | 'dark' | 'auto'

export default interface ThemeEntityI extends BasetEntityI {
    mode: ThemeModesType
    name: string
}

const themeShema = {
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

export type CurrencyNamesType = 'ruble' | 'euro' | 'dollar'

export interface CurrencyEntityI extends BasetEntityI {
    name: CurrencyNamesType
}

const currencyShema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            enum: ['ruble', 'euro', 'dollar'],
            default: 'ruble'
        }
    } as Schema<CurrencyEntityI>,
    default: {},
    required: ['name']
}

export type ColumnSortEntityI = {
    id: string
    desc: boolean
}

export interface TableOptionsEntityI {
    columnVisibility: {}
    columnOrder: string[]
    columnSort: ColumnSortEntityI[]
}

export interface TablesOptionsEntityI {
    pictureTable: TableOptionsEntityI
    pictureDetailTable: TableOptionsEntityI
    pictureDefaultSetTable: TableOptionsEntityI
    similarPictureTable: TableOptionsEntityI
}

const tableOptionsShema = {
    type: 'object',
    properties: {
        columnVisibility: {},
        columnOrder: {
            type: 'array',
            default: [],
            uniqueItems: true,
            items: {
                type: 'string'
            }
        },
        columnSort: {
            type: 'array',
            default: [],
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    desc: {
                        type: 'boolean'
                    }
                }
            }
        }
    } as Schema<TableOptionsEntityI>
}

const tablesOptionsShema = {
    type: 'object',
    properties: {
        pictureTable: tableOptionsShema,
        pictureDetailTable: tableOptionsShema,
        pictureDefaultSetTable: tableOptionsShema,
        similarPictureTable: tableOptionsShema,
    } as Schema<TablesOptionsEntityI>
}

export interface MainConfStoreShemaI {
    theme: ThemeEntityI,
    tablesOptions: TablesOptionsEntityI,
    currency: CurrencyEntityI,
}

export const mainConfStoreShema = {
    theme: themeShema,
    tablesOptions: tablesOptionsShema,
    currency: currencyShema,
} as Schema<MainConfStoreShemaI>