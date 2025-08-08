import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, PaymentMethod, Trip, User } from "@/types";
import { mockPaymentMethods, mockUser } from "@/mocks/user";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  trips: Trip[];
  paymentMethods: PaymentMethod[];
  settings: AppSettings;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, status: Trip["status"]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const initialSettings: AppSettings = {
  pushNotifications: true,
  emailNotifications: true,
  priceAlerts: false,
  travelTips: true,
  marketingCommunications: false,
  darkMode: false,
  fontSize: "medium",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      trips: [],
      paymentMethods: [],
      settings: initialSettings,
      
      login: (userData) => {
        set({ 
          user: userData, 
          isLoggedIn: true,
          // For demo purposes, we'll load mock data
          paymentMethods: mockPaymentMethods,
        });
      },
      
      logout: () => {
        set({ 
          user: null, 
          isLoggedIn: false,
          trips: [],
          paymentMethods: [],
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      addTrip: (trip) => {
        set((state) => ({
          trips: [trip, ...state.trips],
        }));
      },
      
      updateTrip: (tripId, status) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, status } : trip
          ),
        }));
      },
      
      addPaymentMethod: (method) => {
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method],
        }));
      },
      
      removePaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(
            (method) => method.id !== methodId
          ),
        }));
      },
      
      setDefaultPaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === methodId,
          })),
        }));
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: "travel-ease-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// For demo purposes, auto-login with mock user
export const initializeUser = () => {
  const { isLoggedIn, login } = useUserStore.getState();
  if (!isLoggedIn) {
    login(mockUser);
  }
};