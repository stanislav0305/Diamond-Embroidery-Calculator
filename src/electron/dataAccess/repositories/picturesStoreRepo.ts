import Store, { Schema } from 'electron-store';
import { BaseStoreRepo } from '@dataAccess/repositories/baseStoreRepoI'
import { PictureEntityI, PictureDetileEntityI } from '@dataAccess/entities/pictureEntityI';


interface StoreShemaI {
    pictures: PictureEntityI[]
}

class PicturesStoreRepo extends BaseStoreRepo<StoreShemaI, PictureEntityI> {
    constructor() {
        super('picturesStore', 'pictures')
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
                    store.set('pictures', [] as PictureEntityI[]);
                },
            },
        }
    }

    protected override getSchema(): Schema<StoreShemaI> {
        return {
            pictures: {
                type: 'array',
                properties: {
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                            },
                            height: {
                                type: 'number',
                            },
                            width: {
                                type: 'number',
                            },
                            diamondForm: {
                                type: 'string',
                                enum: ['circle', 'square'],
                                default: 'circle'
                            },
                            coverageArea: { //площадь покрытия
                                type: 'string',
                                enum: ['total', 'partial'],
                                default: 'total'
                            },
                            detiles: {
                                type: 'array',
                                properties: {
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string'
                                            },
                                            price:
                                            {
                                                type: 'number'
                                            }
                                        }
                                    }
                                },
                                default: [] as PictureDetileEntityI[]
                            },
                            detilesSumTotal: {
                                type: 'number',
                                default: 0
                            },
                            pricePerHour: {
                                type: 'number',
                                default: 0
                            },
                            hoursSpent: {
                                type: 'number',
                                default: 0
                            },
                            bayFullPrice: {
                                type: 'number',
                                default: 0
                            },
                            comment: {
                                type: 'string'
                            }
                        },
                        default: {},
                        required: ['id', 'name'],
                    }
                },
                default: [] as PictureEntityI[]
            }
        } as Schema<StoreShemaI>
    }

}

export const picturesRepo = new PicturesStoreRepo()