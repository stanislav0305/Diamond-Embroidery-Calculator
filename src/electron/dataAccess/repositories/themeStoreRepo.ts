import Store, { Schema } from 'electron-store';
import { ThemeEntityI } from '@dataAccess/entities/themeEntityI'
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'


interface StoreShemaI { 
    theme: ThemeEntityI
}

class ThemeStoreRepo extends BaseStoreRepo<StoreShemaI, ThemeEntityI> {
    constructor() {
        super('mainConfig', 'theme')
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
                    store.set('theme', {
                        mode: 'auto',
                        name: 'cerulean'
                    } as ThemeEntityI);
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            theme: {
                type: 'object',
                properties: {
                    mode: {
                        type: 'string',
                        enum: ['light', 'dark', 'auto'],
                        default: 'auto'
                    },
                    name: {
                        type: 'string',
                        default: 'cerulean'
                    },
                } as Schema<ThemeEntityI>,
                default: {},
                required: ['mode', 'name'],
            } 
        } as Schema<StoreShemaI>
    }
}

export const themeRepo = new ThemeStoreRepo()