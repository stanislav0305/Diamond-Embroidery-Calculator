import IPicture from '@shared/interfaces/pictureI'
import { coverageAreasDataMap } from '@shared/types/coverageAreaType'
import { diamondFormDataMap } from '@shared/types/diamondFormType'
import { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table'


export default class SimilarPicturesFilter {
    excludeId: string
    columnFiltersInit: ColumnFiltersState

    constructor(p: IPicture) {
        this.excludeId = p.id

        this.columnFiltersInit = [] as ColumnFilter[]
        this.columnFiltersInit.push({ id: 'height', value: [p.height, p.height] })
        this.columnFiltersInit.push({ id: 'width', value: [p.width, p.width] })
        this.columnFiltersInit.push({ id: 'diamondForm', value: diamondFormDataMap.get(p.diamondForm) })
        this.columnFiltersInit.push({ id: 'coverageArea', value: coverageAreasDataMap.get(p.coverageArea) })
    }
}