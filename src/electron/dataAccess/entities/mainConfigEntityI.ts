import { Schema } from 'electron-store'
import BaseEntityI from '@dataAccess/entities/baseEntityI'


export type ThemeModesType = 'light' | 'dark' | 'auto'

export default interface ThemeEntityI extends BaseEntityI {
    mode: ThemeModesType
    name: string
}

const themeSchema = {
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

export interface CurrencyEntityI extends BaseEntityI {
    name: CurrencyNamesType
}

const currencySchema = {
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

const tableOptionsSchema = {
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

const tablesOptionsSchema = {
    type: 'object',
    properties: {
        pictureTable: tableOptionsSchema,
        pictureDetailTable: tableOptionsSchema,
        pictureDefaultSetTable: tableOptionsSchema,
        similarPictureTable: tableOptionsSchema,
    } as Schema<TablesOptionsEntityI>
}

export interface MainConfStoreSchemaI {
    theme: ThemeEntityI,
    tablesOptions: TablesOptionsEntityI,
    currency: CurrencyEntityI,
}

export const mainConfStoreSchema = {
    theme: themeSchema,
    tablesOptions: tablesOptionsSchema,
    currency: currencySchema,
} as Schema<MainConfStoreSchemaI>