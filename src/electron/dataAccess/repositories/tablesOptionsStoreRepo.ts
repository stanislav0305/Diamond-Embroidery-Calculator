import { ColumnSortEntityI, TableOptionsEntityI } from '@dataAccess/entities/mainConfigEntityI'
import { MainConfBaseStoreRepo } from '@dataAccess/repositories/mainConfBaseStoreRepo'
import { ColumnSortI } from '@shared/interfaces/columnSortI'
import TableOptionsI from '@shared/interfaces/tableOptionsI'


class TablesOptionsStoreRepo extends MainConfBaseStoreRepo {
    getTableOptions(table: TablesWithOptions): TableOptionsI {
        const entity = this.store.get(`tablesOptions.${table}`) as TableOptionsEntityI
        const model = { ...entity } as TableOptionsI

        return model
    }

    setColumnVisibility(table: TablesWithOptions, model: object) {
        const entity = { ...model } as object
        this.store.set(`tablesOptions.${table}.columnVisibility`, entity)
    }

    getColumnVisibility(table: TablesWithOptions) {
        return this.store.get(`tablesOptions.${table}.columnVisibility`) as object
    }

    setColumnOrder(table: TablesWithOptions, model: string[]) {
        const entity = [...model] as string[]
        this.store.set(`tablesOptions.${table}.columnOrder`, entity)
    }

    getColumnOrder(table: TablesWithOptions) {
        return this.store.get(`tablesOptions.${table}.columnOrder`) as string[]
    }

    setColumnSort(table: TablesWithOptions, model: ColumnSortI[]) {
        const entity = [...model] as ColumnSortEntityI[]
        this.store.set(`tablesOptions.${table}.columnSort`, entity)
    }

    getColumnSort(table: TablesWithOptions) {
        return this.store.get(`tablesOptions.${table}.columnSort`) as ColumnSortEntityI[]
    }
}

export type TablesWithOptions = 'pictureTable' | 'pictureDetailTable' | 'pictureDefaultSetTable' | 'similarPictureTable'
export const tablesOptionsRepo = new TablesOptionsStoreRepo()