import Store, { Schema } from 'electron-store'
import ThemeEntityI, { themeShema } from '@dataAccess/entities/themeEntityI'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import ThemeI from '@shared/interfaces/themeI'


interface StoreShemaI {
    theme: ThemeEntityI
}

class ThemeStoreRepo extends BaseStoreRepo<StoreShemaI>{
    constructor() {
        super('mainConfig')
    }

    protected override getStoreOptions(): Store.Options<StoreShemaI> {
        return {
            schema: this.getSchema(),
            name: this.storeName,
            beforeEachMigration: (store, context) => {
                console.log(`[${this.storeName}] migrate from ${context.fromVersion} → ${context.toVersion}`)
            },
            migrations: {
                '0.0.1': store => {
                    store.set('theme', {
                        mode: 'auto',
                        name: 'cerulean'
                    } as ThemeEntityI)
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            theme: themeShema
        } as Schema<StoreShemaI>
    }

    public get(): ThemeI {
        const entity = this.store.get('theme') as ThemeEntityI
        const model = { ...entity } as ThemeI

        return model
    }

    public set(model: ThemeI) {
        const entity = { ...model } as ThemeEntityI
        this.store.set('theme', entity)
    }
}

export const themeRepo = new ThemeStoreRepo()