export interface IStorageAdapter {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<T>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

export interface StorageOptions {
  name: string
  storeName: string
  adapter?: IStorageAdapter
}

export abstract class AbstractStorage {
  protected adapter: IStorageAdapter
  protected options: StorageOptions

  constructor(options: StorageOptions) {
    this.options = options
    this.adapter = options.adapter || this.getDefaultAdapter()
  }

  protected abstract getDefaultAdapter(): IStorageAdapter
  
  async get<T>(key: string): Promise<T | null> {
    return this.adapter.getItem<T>(key)
  }

  async set<T>(key: string, value: T): Promise<T> {
    return this.adapter.setItem(key, value)
  }

  async remove(key: string): Promise<void> {
    return this.adapter.removeItem(key)
  }

  async clear(): Promise<void> {
    return this.adapter.clear()
  }
}