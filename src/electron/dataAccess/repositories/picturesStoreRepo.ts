
import { PictureEntityI } from '@dataAccess/entities/pictureEntityI'
import PictureI from '@shared/interfaces/pictureI'
import { PicturesBaseStoreRepo } from '@dataAccess/repositories/picturesBaseStoreRepo'


class PicturesStoreRepo extends PicturesBaseStoreRepo {
    public getAll(): PictureI[] {
        const entities = this.store.get('pictures')
        const models = Object.entries(entities).map(([key, entity]) => {
            return {
                id: key,
                ...JSON.parse(JSON.stringify(entity))
            } as PictureI
        }) as PictureI[]

        return models
    }

    public getOne(id: string): PictureI {
        const entity = this.store.get(`pictures.${id}`) as PictureEntityI

        return {
            id,
            ...JSON.parse(JSON.stringify(entity))
        } as PictureI
    }

    public createOrUpdate(model: PictureI) {
        const entity = { ...JSON.parse(JSON.stringify(model)) } as PictureEntityI
        this.store.set(`pictures.${model.id}`, entity)
    }

    public delete(id: string) {
        //this.store.delete(`pictures.${model.id}`) //not working
        const entities = this.store.get('pictures')
        const newEntitiesPropArr = Object.entries(entities).filter(([key,]) => key !== id)

        const newEntities: any = {}
        newEntitiesPropArr.forEach(obj => {
            const s = obj[0] as string
            newEntities[s] = obj[1]
        })

        this.store.set('pictures', newEntities)
    }

    public has(id: string) {
        return this.store.has(`pictures.${id}`)
    }
}

export const picturesRepo = new PicturesStoreRepo()