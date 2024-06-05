import { CurrencyEntityI } from '@dataAccess/entities/mainConfigEntityI'
import { MainConfBaseStoreRepo } from './mainConfBaseStoreRepo'
import { CurrencyI } from '@shared/interfaces/currencyI'


class CurrencyStoreRepo extends MainConfBaseStoreRepo{
    public get(): CurrencyI {
        const entity = this.store.get('currency') as CurrencyEntityI
        const model = { ...entity } as CurrencyI

        return model
    }

    public set(model: CurrencyI) {
        const entity = { ...model } as CurrencyEntityI
        this.store.set('currency', entity)
    }
}

export const currencyRepo = new CurrencyStoreRepo()