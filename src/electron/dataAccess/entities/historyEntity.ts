import { BasetEntityI } from "./baseEntityI";

export interface HistoryEntityI extends BasetEntityI {
    created: string,
    updated?: string,
}