import Store, { Schema } from 'electron-store';
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PictureDetailEntityI, pictureDetailsDefaultSetShema } from '@dataAccess/entities/pictureDetailEntityI';


interface StoreShemaI {
    pictureDetailsDefaultSet: PictureDetailEntityI[]
}

class PictureDetailsDefaultSetStoreRepo extends BaseStoreRepo<StoreShemaI> {
    constructor() {
        super('pictureDetailsDefaultSetStore')
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
                    store.set('pictureDetailsDefaultSet', [] as PictureDetailEntityI[]);
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            pictureDetailsDefaultSet: pictureDetailsDefaultSetShema
        } as Schema<StoreShemaI>
    }

    //'pictureDetailsDefaultSet'
}

export const pictureDetailsDefaultSetStoreRepo = new PictureDetailsDefaultSetStoreRepo()