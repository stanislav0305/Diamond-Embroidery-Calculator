import Store from 'electron-store';

export interface BaseStoreRepoI<S extends Record<string, any>, T> {
    name: string
    store: Store<S>

    get path(): string
    get(): T | null
    set(settings: T): void
}