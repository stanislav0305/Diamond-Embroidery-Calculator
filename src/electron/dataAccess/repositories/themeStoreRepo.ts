import ThemeEntityI from '@dataAccess/entities/mainConfigEntityI'
import ThemeI from '@shared/interfaces/themeI'
import { MainConfBaseStoreRepo } from './mainConfBaseStoreRepo'


class ThemeStoreRepo extends MainConfBaseStoreRepo{
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