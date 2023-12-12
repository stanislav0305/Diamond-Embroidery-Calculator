import ThemeSettingsI from '@shared/interfaces/themeSettingsI';
import Store, { Schema } from 'electron-store';

type themeModesType = 'light' | 'dark' | 'auto'

interface ThemeSettingsStoreI {
    themeMode: themeModesType
    themeName: string
}

interface StoreShemaI {
    themeSettings: ThemeSettingsStoreI
}


class MainConfigStoreManager {
    name: string = 'mainConfigStore'
    store: Store<StoreShemaI>

    constructor() {
        this.store = new Store<StoreShemaI>(this.getStoreOptions())
    }

    public get path() {
        return this.store.path;
    }

    public getThemeSettings() {
        return this.store.get('themeSettings') as ThemeSettingsStoreI | null
    }

    public setThemeSettings(settings: ThemeSettingsI) {
        const s = settings as ThemeSettingsStoreI
        this.store.set('themeSettings', s)
    }


    private getSchema() {
        return {
            themeSettings: {
                type: 'object',
                properties: {
                    themeMode: {
                        type: 'string',
                        enum: ['light', 'dark', 'auto'],
                        default: 'auto'
                    },
                    themeName: {
                        type: 'string',
                        default: 'cerulean'
                    },
                },
                default: {},
                required: ['themeMode', 'themeName'],
            }
        } as Schema<StoreShemaI>
    }

    private getStoreOptions() {
        return {
            schema: this.getSchema(),
            name: this.name,
            beforeEachMigration: (store, context) => {
                console.log(`[mainConfigStore] migrate from ${context.fromVersion} → ${context.toVersion}`);
            },
            migrations: {
                '0.0.1': store => {
                    store.set('themeSettings', {
                        themeMode: 'auto',
                        themeName: 'cerulean'
                    } as ThemeSettingsStoreI);
                },
            },
        } as Store.Options<StoreShemaI>
    }
}

export const mainConfig = new MainConfigStoreManager()