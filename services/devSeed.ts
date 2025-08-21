import { ref, get, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { devSeed } from './tripsService';
import { metroTrips, upcomingTrains as mockUpcoming, popularDestinations as mockPopular } from '@/mocks/trips';
import { mrtLine6Stations } from '@/mocks/locations';
import { Trip } from '@/types';

function metroToLegacyTrip(m: any): Trip {
  return {
    id: m.id,
    from: { city: m.from.name, station: `${m.from.name} Metro Station`, code: m.from.code },
    to: { city: m.to.name, station: `${m.to.name} Metro Station`, code: m.to.code },
    departureDate: m.departureDate,
    departureTime: m.departureTime,
    arrivalDate: m.arrivalDate,
    arrivalTime: m.arrivalTime,
    duration: m.duration,
    price: m.price,
    transportationType: 'train',
    company: 'Dhaka Mass Transit Company Limited',
    class: 'Standard',
    status: m.status,
    bookingRef: m.trainNumber,
  };
}

export async function seedIfEmpty() {
  try {
    // If trips already seeded, skip
    const tripsSnap = await get(ref(db, 'trips'));
    if (tripsSnap.exists()) return;

    const trips: Trip[] = metroTrips.slice(0, 500).map(metroToLegacyTrip); // limit to keep write size reasonable

    await devSeed({
      trips,
      upcomingTrains: mockUpcoming,
      popularDestinations: mockPopular,
    });

    // seed stations for location-select
    const stationUpdates: Record<string, any> = {};
    for (const st of mrtLine6Stations) {
      stationUpdates[`/stations/${st.id}`] = st;
    }
    await update(ref(db), stationUpdates);
  } catch (e) {
    console.warn('Seed failed or skipped', e);
  }
}
