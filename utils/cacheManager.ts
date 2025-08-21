import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'metro_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class CacheManager {
  static async set<T>(key: string, data: T, customExpiry?: number): Promise<void> {
    const expiry = customExpiry || CACHE_EXPIRY;
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry,
    };
    
    try {
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() > cacheItem.expiry) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  static async isValid(key: string): Promise<boolean> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!cached) return false;

      const cacheItem: CacheItem<any> = JSON.parse(cached);
      return Date.now() <= cacheItem.expiry;
    } catch (error) {
      return false;
    }
  }
}