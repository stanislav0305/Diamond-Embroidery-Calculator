import Store, { Schema } from 'electron-store';
import { ThemeEntityI } from '@dataAccess/entities/themeEntityI'
import { BaseStoreRepoI } from '@dataAccess/repositories/baseStoreRepoI'


interface StoreShemaI {
    theme: ThemeEntityI
}

class ThemeStoreRepo implements BaseStoreRepoI<StoreShemaI, ThemeEntityI> {
    name: string = 'mainConfig'
    store: Store<StoreShemaI>

    constructor() {
        this.store = new Store<StoreShemaI>(this.getStoreOptions())
    }

    public get path() {
        return this.store.path;
    }

    public get() {
        return this.store.get('theme') as ThemeEntityI | null
    }

    public set(theme: ThemeEntityI) {
        const t = theme as ThemeEntityI
        this.store.set('theme', t)
    }


    private getSchema() {
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
                },
                default: {},
                required: ['mode', 'name'],
            }
        } as Schema<StoreShemaI>
    }

    private getStoreOptions() {
        const x: ThemeEntityI = {
            mode: 'auto',
            name: 'cerulean'
        }

        return {
            schema: this.getSchema(),
            name: this.name,
            beforeEachMigration: (store, context) => {
                console.log(`[mainConfigStore] migrate from ${context.fromVersion} → ${context.toVersion}`);
            },
            migrations: {
                '0.0.1': store => {
                    store.set('theme', {
                        mode: 'auto',
                        name: 'cerulean'
                    } as ThemeEntityI);
                },
            },
        } as Store.Options<StoreShemaI>
    }
}

export const themeRepo = new ThemeStoreRepo()