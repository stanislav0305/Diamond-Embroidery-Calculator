import { PicturesBaseStoreRepo } from '@dataAccess/repositories/picturesBaseStoreRepo'
import PicturesDefaultSetI from '@shared/interfaces/picturesDefaultSetI'
import { PicturesDefaultSetEntityI } from '../entities/picturesDefaultSetEntity'


class PicturesDefaultSetStoreRepo extends PicturesBaseStoreRepo {
    public get(): PicturesDefaultSetI {
        const entity = this.store.get('picturesDefaultSet') as PicturesDefaultSetEntityI

        return {
            ...JSON.parse(JSON.stringify(entity))
        } as PicturesDefaultSetI
    }

    public set(model: PicturesDefaultSetEntityI) {
        const entity = { ...JSON.parse(JSON.stringify(model)) } as PicturesDefaultSetEntityI
        this.store.set('picturesDefaultSet', entity)
    }
}

export const picturesDefaultSetStoreRepo = new PicturesDefaultSetStoreRepo()