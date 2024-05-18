import BaseI from '@shared/interfaces/baseI'


export default interface HistoryI extends BaseI {
    created: string
    updated?: string
}