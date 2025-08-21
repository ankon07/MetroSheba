import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { MetroStation } from '@/types';
import { CacheManager } from '@/utils/cacheManager';

export async function getStations(): Promise<MetroStation[]> {
  const cacheKey = 'metro_stations';
  
  // Try cache first
  const cached = await CacheManager.get<MetroStation[]>(cacheKey);
  if (cached) return cached;

  try {
    const snap = await get(ref(db, 'stations'));
    if (!snap.exists()) return [];
    
    const val = snap.val() || {};
    const stations = Object.values(val) as MetroStation[];
    
    // Cache for 30 minutes (stations rarely change)
    await CacheManager.set(cacheKey, stations, 30 * 60 * 1000);
    return stations;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw new Error('Failed to load stations. Please check your connection.');
  }
}
