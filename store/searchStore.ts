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
  searchTrips: () => void;
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
      
      searchTrips: () => {
        const { from, to } = get().searchParams;
        if (!from || !to) return;
        
        // In a real app, this would be an API call
        // For now, we'll filter the mock data
        const results = mockTrips.filter(
          (trip) => 
            trip.from.city === from.city && 
            trip.to.city === to.city
        );
        
        set({ searchResults: results });
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