import { db } from '@/lib/firebase';
import { ref, get, child, set, update, onValue, off } from 'firebase/database';
import { SearchParams, Trip, UpcomingTrain } from '@/types';
import { toTrip, toUpcomingTrain } from './mappers';
import { CacheManager } from '@/utils/cacheManager';

function routeKey(from?: { code?: string, city?: string } | null, to?: { code?: string, city?: string } | null) {
  const fromKey = from?.code || from?.city?.toLowerCase() || '';
  const toKey = to?.code || to?.city?.toLowerCase() || '';
  return `${fromKey}_${toKey}`;
}

export async function searchTrips(params: SearchParams): Promise<Trip[]> {
  const cacheKey = `search_${JSON.stringify(params)}`;
  
  // Try cache first
  const cached = await CacheManager.get<Trip[]>(cacheKey);
  if (cached) return cached;

  const tryKeys: string[] = [];
  const rkCodeFirst = routeKey(params.from, params.to);
  if (rkCodeFirst && rkCodeFirst !== '_') tryKeys.push(rkCodeFirst);
  // Also try city-based key to support callers that don't pass codes
  const rkCity = routeKey(
    params.from ? { city: params.from.city } : null,
    params.to ? { city: params.to.city } : null
  );
  if (rkCity && rkCity !== '_' && !tryKeys.includes(rkCity)) tryKeys.push(rkCity);

  for (const rk of tryKeys) {
    try {
      const snap = await get(ref(db, `routes/${rk}`));
      if (!snap.exists()) continue;

      const val = snap.val();
      let results: Trip[] = [];
      
      // If routes hold denormalized trip objects
      if (val && typeof val === 'object') {
        const tripsArray = Object.values(val) as any[];
        results = tripsArray.map(toTrip);
      } else {
        // If routes hold ids only
        const tripIds = Object.keys(val || {});
        const trips: Trip[] = [];
        for (const id of tripIds) {
          const tSnap = await get(ref(db, `trips/${id}`));
          if (tSnap.exists()) trips.push(toTrip({ id, ...tSnap.val() }));
        }
        results = trips;
      }
      
      // Cache results
      await CacheManager.set(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error searching trips:', error);
      throw new Error('Failed to search trips. Please check your connection.');
    }
  }
  return [];
}

export async function getUpcomingTrains(limit = 5): Promise<UpcomingTrain[]> {
  const cacheKey = `upcoming_trains_${limit}`;
  
  // Try cache first
  const cached = await CacheManager.get<UpcomingTrain[]>(cacheKey);
  if (cached) return cached;

  try {
    const snap = await get(ref(db, 'upcomingTrains'));
    if (!snap.exists()) return [];
    
    const val = snap.val() || {};
    const items = Object.values(val) as any[];
    const trains = items.map(toUpcomingTrain).slice(0, limit);
    
    // Cache for 1 minute (trains update frequently)
    await CacheManager.set(cacheKey, trains, 60 * 1000);
    return trains;
  } catch (error) {
    console.error('Error fetching upcoming trains:', error);
    throw new Error('Failed to load upcoming trains. Please check your connection.');
  }
}

export async function getPopularDestinations(): Promise<Array<{ id: string; from: string; to: string; price: number; image: string }>> {
  const cacheKey = 'popular_destinations';
  
  // Try cache first
  const cached = await CacheManager.get<Array<{ id: string; from: string; to: string; price: number; image: string }>>(cacheKey);
  if (cached) return cached;

  try {
    const snap = await get(ref(db, 'popularDestinations'));
    if (!snap.exists()) return [];
    
    const val = snap.val() || {};
    const destinations = Object.values(val) as any[];
    
    // Cache for 10 minutes (destinations don't change often)
    await CacheManager.set(cacheKey, destinations, 10 * 60 * 1000);
    return destinations;
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    throw new Error('Failed to load popular destinations. Please check your connection.');
  }
}

// Dev-only seed: populate database with mocks
export async function devSeed(data: {
  trips: Trip[];
  upcomingTrains: any[];
  popularDestinations: any[];
}) {
  // Trips canonical list
  const updates: Record<string, any> = {};
  for (const trip of data.trips) {
    updates[`/trips/${trip.id}`] = trip;
    const rk = routeKey(trip.from, trip.to);
    updates[`/routes/${rk}/${trip.id}`] = trip; // denormalized for simple querying
    const rkCity = routeKey({ city: trip.from.city } as any, { city: trip.to.city } as any);
    updates[`/routes/${rkCity}/${trip.id}`] = trip;
  }
  // Upcoming trains
  for (const item of data.upcomingTrains) {
    updates[`/upcomingTrains/${item.id}`] = item;
  }
  // Popular destinations
  for (const dest of data.popularDestinations) {
    updates[`/popularDestinations/${dest.id}`] = dest;
  }

  await update(ref(db), updates);
}
