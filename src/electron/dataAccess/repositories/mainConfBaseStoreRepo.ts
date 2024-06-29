import Store, { Schema } from 'electron-store'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import ThemeEntityI, { ColumnSortEntityI, CurrencyEntityI, MainConfStoreShemaI, TableOptionsEntityI, TablesOptionsEntityI, mainConfStoreShema } from '@dataAccess/entities/mainConfigEntityI'


export class MainConfBaseStoreRepo extends BaseStoreRepo<MainConfStoreShemaI> {
    constructor() {
        super('mainConfig')
    }

    protected override getStoreOptions(): Store.Options<MainConfStoreShemaI> {
        console.log('MainConfBaseStoreRepo.getStoreOptions...')
        
        return {
            schema: this.getSchema(),
            name: this.storeName,
            beforeEachMigration: (store, context) => {
                console.log(`[${this.storeName}] migrate from ${context.fromVersion} → ${context.toVersion}`)
            },
            migrations: {
                '0.0.1': conf => {
                    conf.set(
                        {
                            theme: {
                                mode: 'auto',
                                name: 'cerulean'
                            } as ThemeEntityI,
                            tablesOptions: {
                                pictureTable: {
                                    columnOrder: ['mrt-row-actions', 'photo', 'id', 'created', 'updated', 'height', 'width',
                                        'diamondForm', 'coverageArea', 'pricePerHour', 'hoursSpent', 'bayFullPrice', 'isSold', 'comment'
                                    ],
                                    columnVisibility: {},
                                    columnSort: [] as ColumnSortEntityI[]
                                } as TableOptionsEntityI,
                                pictureDetailTable: {
                                    columnOrder: ['mrt-row-actions', 'id', 'name', 'price'],
                                    columnVisibility: {},
                                    columnSort: [] as ColumnSortEntityI[]
                                } as TableOptionsEntityI,
                                pictureDefaultSetTable: {
                                    columnOrder: ['mrt-row-actions', 'id', 'name', 'price'],
                                    columnVisibility: {},
                                    columnSort: [] as ColumnSortEntityI[]
                                } as TableOptionsEntityI,
                                similarPictureTable: {
                                    columnOrder: ['mrt-row-actions', 'photo', 'id', 'created', 'updated', 'height', 'width',
                                        'diamondForm', 'coverageArea', 'pricePerHour', 'hoursSpent', 'bayFullPrice', 'isSold', 'comment'
                                    ],
                                    columnVisibility: {},
                                    columnSort: [] as ColumnSortEntityI[]
                                }
                            } as TablesOptionsEntityI,
                            currency: {
                                name: 'ruble'
                            } as CurrencyEntityI,
                        } as MainConfStoreShemaI
                    )
                },
                '2.0.0': conf => {
                    const store = conf.store
                    conf.set(
                        {
                            ...store,
                            tablesOptions: {
                                ...store.tablesOptions,
                                pictureTable: {
                                    ...store.tablesOptions.pictureTable,
                                    columnOrder: ['mrt-row-actions', 'photo', 'id', 'created', 'updated', 'height', 'width',
                                        'diamondForm', 'coverageArea', 'pricePerHour', 'hoursSpent', 'profit', 'bayFullPrice', 'isSold', 'comment'
                                    ],
                                },
                                similarPictureTable: {
                                    ...store.tablesOptions.similarPictureTable,
                                    columnOrder: ['mrt-row-actions', 'photo', 'id', 'created', 'updated', 'height', 'width',
                                        'diamondForm', 'coverageArea', 'pricePerHour', 'hoursSpent', 'profit', 'bayFullPrice', 'isSold', 'comment'
                                    ],
                                }
                            },
                        } as MainConfStoreShemaI
                    )
                }
            },
        }
    }

    protected override getSchema(): Schema<MainConfStoreShemaI> {
        return mainConfStoreShema
    }
}