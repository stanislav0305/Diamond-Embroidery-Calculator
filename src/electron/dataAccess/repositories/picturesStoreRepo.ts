import Store, { Schema } from 'electron-store';
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PictureEntityI, picturesShema } from '@dataAccess/entities/pictureEntityI';


interface StoreShemaI {
    pictures: PictureEntityI[]
}

class PicturesStoreRepo extends BaseStoreRepo<StoreShemaI, PictureEntityI> {
    constructor() {
        super('picturesStore', 'pictures')
    }

    protected override getStoreOptions(): Store.Options<StoreShemaI> {
        return {
            schema: this.getSchema(),
            name: this.storeName,
            beforeEachMigration: (store, context) => {
                console.log(`[${this.storeName}] migrate from ${context.fromVersion} → ${context.toVersion}`);
            },
            migrations: {
                '0.0.1': store => {
                    store.set('pictures', [] as PictureEntityI[]);
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            pictures: picturesShema
        } as Schema<StoreShemaI>
    }
}

export const picturesRepo = new PicturesStoreRepo()