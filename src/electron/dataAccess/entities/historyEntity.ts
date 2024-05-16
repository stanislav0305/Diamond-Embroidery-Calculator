import { BasetEntityI } from '@dataAccess/entities/baseEntityI'


export interface HistoryEntityI extends BasetEntityI {
    created: string,
    updated?: string,
}