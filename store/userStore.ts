import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, PaymentMethod, Trip, User } from "@/types";
import { mockPaymentMethods, mockUser } from "@/mocks/user";
import { USE_FIREBASE } from "@/config/featureFlags";
import * as UsersService from "@/services/usersService";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  trips: Trip[];
  paymentMethods: PaymentMethod[];
  settings: AppSettings;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, status: Trip["status"]) => void;
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
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
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      trips: [],
      paymentMethods: [],
      settings: initialSettings,
      
      login: async (userData) => {
        if (USE_FIREBASE) {
          await UsersService.loginOrBootstrap(userData);
          const methods = await UsersService.getUserPaymentMethods(userData.id);
          set({ user: userData, isLoggedIn: true, paymentMethods: methods });
        } else {
          set({ 
            user: userData, 
            isLoggedIn: true,
            // For demo purposes, we'll load mock data
            paymentMethods: mockPaymentMethods,
          });
        }
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
      
      addPaymentMethod: async (method) => {
        if (USE_FIREBASE && get().user) {
          await UsersService.addPaymentMethod(get().user!.id, method);
        }
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method],
        }));
      },
      
      removePaymentMethod: async (methodId) => {
        if (USE_FIREBASE && get().user) {
          await UsersService.removePaymentMethod(get().user!.id, methodId);
        }
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(
            (method) => method.id !== methodId
          ),
        }));
      },
      
      setDefaultPaymentMethod: async (methodId) => {
        if (USE_FIREBASE && get().user) {
          await UsersService.setDefaultPaymentMethod(get().user!.id, methodId);
        }
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