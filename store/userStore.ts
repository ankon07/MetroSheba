import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, PaymentMethod, Trip, User } from "@/types";
import { mockPaymentMethods, mockUser } from "@/mocks/user";
import { USE_FIREBASE } from "@/config/featureFlags";
import * as UsersService from "@/services/usersService";
import BiometricService from "@/services/biometricService";
import { locationService, UserLocation } from "@/services/locationService";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  trips: Trip[];
  paymentMethods: PaymentMethod[];
  settings: AppSettings;
  userLocation: UserLocation | null;
  locationPermissionGranted: boolean;
  login: (userData: User) => Promise<void>;
  loginWithBiometric: () => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, status: Trip["status"]) => void;
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  enableBiometricAuth: () => Promise<boolean>;
  disableBiometricAuth: () => Promise<boolean>;
  isBiometricEnabled: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  updateUserLocation: () => Promise<void>;
  clearUserLocation: () => void;
}

const initialSettings: AppSettings = {
  pushNotifications: true,
  emailNotifications: true,
  priceAlerts: false,
  travelTips: true,
  marketingCommunications: false,
  darkMode: false,
  fontSize: "medium",
  language: "en",
  preferredPayment: "cash",
  accessibilityMode: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      trips: [],
      paymentMethods: [],
      settings: initialSettings,
      userLocation: null,
      locationPermissionGranted: false,
      
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

      loginWithBiometric: async () => {
        try {
          const isEnabled = await BiometricService.isBiometricEnabled();
          if (!isEnabled) {
            return false;
          }

          const result = await BiometricService.authenticate('Use Face ID to sign in quickly');
          if (result.success) {
            const userId = await BiometricService.getBiometricUserId();
            if (userId) {
              // For demo purposes, create a mock user with the stored ID
              const userData = {
                id: userId,
                firstName: 'User',
                lastName: 'Name',
                email: 'user@example.com',
                phone: '+8801315206061',
                nationality: 'Bangladeshi',
                trips: 0,
                countries: 1,
                miles: 0,
                memberSince: new Date().toISOString().split('T')[0],
                membershipLevel: 'Standard' as const,
              };

              if (USE_FIREBASE) {
                await UsersService.loginOrBootstrap(userData);
                const methods = await UsersService.getUserPaymentMethods(userData.id);
                set({ user: userData, isLoggedIn: true, paymentMethods: methods });
              } else {
                set({ 
                  user: userData, 
                  isLoggedIn: true,
                  paymentMethods: mockPaymentMethods,
                });
              }
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error('Biometric login error:', error);
          return false;
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

      enableBiometricAuth: async () => {
        const user = get().user;
        if (!user) return false;
        
        try {
          const isAvailable = await BiometricService.isAvailable();
          if (!isAvailable) return false;

          // Simply enable biometric auth without requiring authentication
          // The face enrollment process handles the security verification
          return await BiometricService.enableBiometricAuth(user.id);
        } catch (error) {
          console.error('Error enabling biometric auth:', error);
          return false;
        }
      },

      disableBiometricAuth: async () => {
        try {
          return await BiometricService.disableBiometricAuth();
        } catch (error) {
          console.error('Error disabling biometric auth:', error);
          return false;
        }
      },

      isBiometricEnabled: async () => {
        try {
          return await BiometricService.isBiometricEnabled();
        } catch (error) {
          console.error('Error checking biometric status:', error);
          return false;
        }
      },

      requestLocationPermission: async () => {
        try {
          const hasPermission = await locationService.requestLocationPermission();
          set({ locationPermissionGranted: hasPermission });
          return hasPermission;
        } catch (error) {
          console.error('Error requesting location permission:', error);
          set({ locationPermissionGranted: false });
          return false;
        }
      },

      updateUserLocation: async () => {
        try {
          const location = await locationService.getCurrentLocation();
          set({ userLocation: location });
        } catch (error) {
          console.error('Error updating user location:', error);
          set({ userLocation: null });
        }
      },

      clearUserLocation: () => {
        set({ userLocation: null, locationPermissionGranted: false });
      },
    }),
    {
      name: "travel-ease-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Initialize user store without auto-login
export const initializeUser = () => {
  // Check if user was previously logged in from storage
  // The persist middleware will handle restoring the state
  // No automatic login - users must authenticate manually
  console.log('User store initialized - no auto-login');
};
