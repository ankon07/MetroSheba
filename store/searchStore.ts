import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchParams, Trip } from "@/types";
import { mockTrips } from "@/mocks/trips";

interface SearchState {
  searchParams: SearchParams;
  searchResults: Trip[];
  recentSearches: {
    id: string;
    from: string;
    to: string;
    date: string;
    passengers: number;
    transportationType: string;
  }[];
  setSearchParams: (params: Partial<SearchParams>) => void;
  resetSearchParams: () => void;
  searchTrips: () => Promise<void>;
  addRecentSearch: () => void;
  clearRecentSearches: () => void;
}

const initialSearchParams: SearchParams = {
  from: null,
  to: null,
  date: new Date().toISOString().split("T")[0],
  isRoundTrip: false,
  passengers: 1,
  transportationType: "train",
  class: "Economy",
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchParams: initialSearchParams,
      searchResults: [],
      recentSearches: [],
      
      setSearchParams: (params) => {
        set((state) => ({
          searchParams: { ...state.searchParams, ...params },
        }));
      },
      
      resetSearchParams: () => {
        set({ searchParams: initialSearchParams });
      },
      
      searchTrips: async () => {
        const { from, to } = get().searchParams;
        if (!from || !to) return;
        
        // Fetch from Firebase Realtime Database
        try {
          const { USE_FIREBASE } = await import('@/config/featureFlags');
          if (USE_FIREBASE) {
            const TripsService = await import('@/services/tripsService');
            const results = await TripsService.searchTrips(get().searchParams);
            set({ searchResults: results });
          } else {
            // Fallback to mock data
            const results = mockTrips.filter(
              (trip) => 
                trip.from.city === from.city && 
                trip.to.city === to.city
            );
            set({ searchResults: results });
          }
        } catch (e) {
          console.error('searchTrips failed', e);
          // Fallback to mock data on error
          try {
            const results = mockTrips.filter(
              (trip) => 
                trip.from.city === from.city && 
                trip.to.city === to.city
            );
            set({ searchResults: results });
          } catch (fallbackError) {
            console.error('Fallback search failed', fallbackError);
            throw new Error('Search failed. Please try again.');
          }
        }
      },
      
      addRecentSearch: () => {
        const { searchParams, recentSearches } = get();
        if (!searchParams.from || !searchParams.to) return;
        
        const newSearch = {
          id: Date.now().toString(),
          from: searchParams.from.city,
          to: searchParams.to.city,
          date: searchParams.date,
          passengers: searchParams.passengers,
          transportationType: searchParams.transportationType,
        };
        
        // Remove duplicates and keep only the last 5 searches
        const updatedSearches = [
          newSearch,
          ...recentSearches.filter(
            (s) => !(s.from === newSearch.from && s.to === newSearch.to)
          ),
        ].slice(0, 5);
        
        set({ recentSearches: updatedSearches });
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: "travel-ease-search-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);