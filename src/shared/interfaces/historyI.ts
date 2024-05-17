import { BaseI } from '@shared/interfaces/baseI'


export interface HistoryI extends BaseI {
    created: string,
    updated?: string
}