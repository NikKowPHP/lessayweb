import localforage from 'localforage'
import { IStorageAdapter } from './abstractStorage'
import { cloneDeep } from 'lodash'
// import { logger } from '../utils/logger'

export class LocalForageAdapter implements IStorageAdapter {
  private storage: LocalForage

  constructor(name: string, storeName: string) {
    this.storage = localforage.createInstance({
      name,
      storeName
    })
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await this.storage.getItem<T>(key)
      return value
    } catch (error) {
      console.error('LocalForage getItem error:', error as Error)
      return null
    }
  }

  async setItem<T>(key: string, value: T): Promise<T> {
    try {
      // Create a deep clone of the value to remove any proxies
      const clonedValue = cloneDeep(value)
      
      // Additional safety check to ensure the value can be serialized
      const serializedValue = JSON.parse(JSON.stringify(clonedValue))
      
      await this.storage.setItem(key, serializedValue)
      return value
    } catch (error) {
      console.error('LocalForage setItem error:', error as Error, {
        key,
        valueType: typeof value
      })
      throw error
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      return await this.storage.removeItem(key)
    } catch (error) {
      console.error('LocalForage removeItem error:', error as Error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      return await this.storage.clear()
    } catch (error) {
      console.error('LocalForage clear error:', error as Error)
      throw error
    }
  }
}