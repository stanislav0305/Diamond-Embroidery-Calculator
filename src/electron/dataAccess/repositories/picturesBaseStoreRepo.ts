import Store, { Schema } from 'electron-store'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PicturesStoreShemaI, picturesStoreShema } from '@dataAccess/entities/pictureEntityI'
import { PictureDetailEntityI } from '../entities/pictureDetailEntityI'


export class PicturesBaseStoreRepo extends BaseStoreRepo<PicturesStoreShemaI> {
    constructor() {
        super('picturesStore')
    }

    protected override getStoreOptions(): Store.Options<PicturesStoreShemaI> {
        return {
            schema: this.getSchema(),
            name: this.storeName,
            beforeEachMigration: (store, context) => {
                console.log(`[${this.storeName}] migrate from ${context.fromVersion} → ${context.toVersion}`)
            },
            migrations: {
                '0.0.1': store => {
                    store.set({
                        picturesDefaultSet: {
                            details: [] as PictureDetailEntityI[],
                            detailsSumTotal: 0,
                            pricePerHour: 2.00,
                        },
                        pictures: {}
                    } as PicturesStoreShemaI)
                },
            },
        }
    }

    protected override getSchema(): Schema<PicturesStoreShemaI> {
        return picturesStoreShema
    }
}