
import Store, { Schema } from 'electron-store'


export abstract class BaseStoreRepo<S extends Record<string, any>>{
    protected store: Store<S> = new Store<S>

    constructor(
        protected storeName: string
    ) {
        this.store = new Store<S>(this.getStoreOptions())
    }

    public get path() { return this.store.path }

    protected abstract getSchema(): Schema<S>
    protected abstract getStoreOptions(): Store.Options<S>
}