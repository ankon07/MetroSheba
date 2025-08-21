Firebase integration notes

1) Install Firebase in your project:
   npm i firebase

2) Add your Firebase config and flags in app.json (optional):
   {
     "expo": {
       "extra": {
         "firebase": { ... },
         "useFirebase": true
       }
     }
   }
   By default, lib/firebase.ts falls back to the provided config.

3) How data is seeded
   - On first app start (after fonts load), app/_layout.tsx calls seedIfEmpty() when USE_FIREBASE is true.
   - It writes trips under /trips and denormalized under /routes/{from}_{to}
   - It writes upcomingTrains and popularDestinations, and stations.

4) Toggle Firebase vs mocks
   - config/featureFlags.ts controls data source. Set USE_FIREBASE=true to use backend.

5) Security rules suggestion (Realtime DB):
   Read-only public for routes/trips/popular/upcoming; user-scoped for /users/{uid}.

6) Services
   - services/tripsService.ts: searchTrips(), getUpcomingTrains(), getPopularDestinations(), devSeed()
   - services/usersService.ts: user profile and payment methods helpers
   - services/stationsService.ts: read stations

7) Screens updated
   - store/searchStore.ts now calls TripsService when USE_FIREBASE is true
   - app/(tabs)/index.tsx now loads upcoming and popular from backend
