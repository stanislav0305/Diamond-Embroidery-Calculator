import Store, { Schema } from 'electron-store'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import ThemeEntityI, { ColumnSortEntityI, CurrencyEntityI, MainConfStoreSchemaI, TableOptionsEntityI, TablesOptionsEntityI, mainConfStoreSchema } from '@dataAccess/entities/mainConfigEntityI'


export class MainConfBaseStoreRepo extends BaseStoreRepo<MainConfStoreSchemaI> {
    constructor() {
        super('mainConfig')
    }

    protected override getStoreOptions(): Store.Options<MainConfStoreSchemaI> {
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
                        } as MainConfStoreSchemaI
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
                        } as MainConfStoreSchemaI
                    )
                }
            },
        }
    }

    protected override getSchema(): Schema<MainConfStoreSchemaI> {
        return mainConfStoreSchema
    }
}