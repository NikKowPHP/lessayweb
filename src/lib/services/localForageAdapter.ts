import localforage from 'localforage'
import { IStorageAdapter } from './abstractStorage'

export class LocalForageAdapter implements IStorageAdapter {
  private storage: LocalForage

  constructor(name: string, storeName: string) {
    this.storage = localforage.createInstance({
      name,
      storeName
    })
  }

  async getItem<T>(key: string): Promise<T | null> {
    return this.storage.getItem<T>(key)
  }

  async setItem<T>(key: string, value: T): Promise<T> {
    return this.storage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key)
  }

  async clear(): Promise<void> {
    return this.storage.clear()
  }
}