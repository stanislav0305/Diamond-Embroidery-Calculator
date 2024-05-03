
import Store, { Schema } from 'electron-store';
import { BasetEntityI } from '@dataAccess/entities/baseEntityI';


export abstract class BaseStoreRepo<S extends Record<string, any>, T> {
    protected store: Store<S> = new Store<S>

    constructor(
        protected storeName: string,
        protected fieldName: string
    ) {
        this.store = new Store<S>(this.getStoreOptions())
    }

    public get path() { return this.store.path }

    protected abstract getSchema(): Schema<S>
    protected abstract getStoreOptions(): Store.Options<S>


    public has(key?: string): boolean { return this.store.has(key ? key : this.fieldName) }

    //Получите элемент или значение по умолчанию, если элемент не существует.
    public get(key?: string): T | T[] | null { return this.store.get(key ? key : this.fieldName) }

    public getArrayRow<T extends BasetEntityI>(key: string, id: number): T | undefined {
        const values = this.get(key ? key : this.fieldName) as T[]
        return values.find(v => v.id === id)
    }

    public set(value: T | T[], key?: string): void {
        const k = key ? key : this.fieldName
        this.store.set(k, value)
    }

    public setArrayRow(value: T, key?: string) {
        
        //!!!!!!!!!!!!
        //использование генератор уникальных идентификаторов
        //https://stackforgeeks.com/blog/missing-key-prop-for-element-reactjs-and-typescript
        //!!!!!!!!!!!!

        //https://githubissues.com/sindresorhus/electron-store/240
        //чтобы обновить
        /*
        const items: [
            {'data1':true},
            {'data2':false}
          ]
        config.set('items.0.data1', false)
        */
        //что бы добавить 
        const values = this.get(key) as T[]
        const newValues = [...(values || []), value];
        this.set(newValues, key);
    }

    //Сбросьте значения элементов к их значениям по умолчанию, как определено в параметрах defaults или schema.
    public reset<Key extends keyof S>(keys: Key[]): void { this.store.reset(...keys) }

    //Удалите элемент.
    public delete(key: string): void { this.store.delete(key) }

    //Удалите все элементы.
    //При этом известные элементы сбрасываются до значений по умолчанию, 
    //если они определены параметром «По умолчанию» или «Схема».
    public clear() { this.store.clear() }



    /*
    public getAll(): T[] | null { return null }
    public setAll(entities: T[]): void { }

    public create(entity: T): T | null { return null }
    public read(id: number): T | null { return null }
    public update(entity: T) : T | null { return null }
    public delete(id: number): boolean { return false }
    */
}