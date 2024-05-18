import BasetEntityI from '@dataAccess/entities/baseEntityI'


export default interface HistoryEntityI extends BasetEntityI {
    created: string
    updated?: string
}