import BaseEntityI from '@dataAccess/entities/baseEntityI'


export default interface HistoryEntityI extends BaseEntityI {
    created: string
    updated?: string
}