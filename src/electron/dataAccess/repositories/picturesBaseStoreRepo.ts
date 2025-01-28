import Store, { Schema } from 'electron-store'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PicturesStoreSchemaI, picturesStoreSchema } from '@dataAccess/entities/pictureEntityI'
import { PictureDetailEntityI } from '../entities/pictureDetailEntityI'


export class PicturesBaseStoreRepo extends BaseStoreRepo<PicturesStoreSchemaI> {
    constructor() {
        super('picturesStore')
    }

    protected override getStoreOptions(): Store.Options<PicturesStoreSchemaI> {
        console.log('PicturesBaseStoreRepo.getStoreOptions...')
        return {
            schema: this.getSchema(),
            name: this.storeName,
            beforeEachMigration: (store, context) => {
                console.log(`[${this.storeName}] migrate from ${context.fromVersion} → ${context.toVersion}`)
            },
            migrations: {
                '0.0.1': conf => {
                    conf.set({
                        picturesDefaultSet: {
                            details: [] as PictureDetailEntityI[],
                            detailsSumTotal: 0,
                            pricePerHour: 200.00,
                        },
                        pictures: {}
                    } as PicturesStoreSchemaI)
                },
                '1.2.8': conf => {
                    const store = conf.store
                    conf.set(
                        {
                            ...store,
                            picturesDefaultSet: {
                                ...store.picturesDefaultSet,
                                pricePerHourAutoCorrect: true
                            }
                        } as PicturesStoreSchemaI
                    )
                }
            },
        }
    }

    protected override getSchema(): Schema<PicturesStoreSchemaI> {
        return picturesStoreSchema
    }
}