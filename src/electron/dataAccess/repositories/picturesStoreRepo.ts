import Store, { Schema } from 'electron-store';
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PictureEntityI, picturesShema } from '@dataAccess/entities/pictureEntityI';
import PictureI from '@shared/interfaces/pictureI';


interface StoreShemaI {
    pictures: {}
}

class PicturesStoreRepo extends BaseStoreRepo<StoreShemaI> {
    constructor() {
        super('picturesStore')
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
                    store.set('pictures', {});
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            pictures: picturesShema
        } as Schema<StoreShemaI>
    }

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
        const entity = { ...model } as PictureEntityI
        this.store.set(`pictures.${model.id}`, entity)
    }

    public delete(id: string) {
        //this.store.delete(`pictures.${model.id}`) //not working
        const entities = this.store.get('pictures')
        const newEntitiesPropArr = Object.entries(entities).filter(([key,]) => key !== id)

        const newEntities: any = {}
        newEntitiesPropArr.forEach(obj => {
            const s = obj[0] as string
            newEntities[s] = obj[1];
        })

        this.store.set('pictures', newEntities)
    }

    public has(id: string) {
        return this.store.has(`pictures.${id}`)
    }
}

export const picturesRepo = new PicturesStoreRepo()