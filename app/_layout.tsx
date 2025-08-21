import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { initializeUser } from "@/store/userStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineBanner from "@/components/OfflineBanner";
import { useOfflineHandler } from "@/hooks/useOfflineHandler";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initialize mock user for demo
      initializeUser();
      // Seed Firebase once so the app shows real data
      (async () => {
        try {
          const { USE_FIREBASE } = await import('@/config/featureFlags');
          if (USE_FIREBASE) {
            const { seedIfEmpty } = await import('@/services/devSeed');
            await seedIfEmpty();
          }
        } catch (e) {
          console.log('Seed skipped', e);
        }
      })();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { showOfflineMessage } = useOfflineHandler();

  return (
    <>
      <StatusBar style="dark" />
      <OfflineBanner visible={showOfflineMessage} />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="search/location-select" 
          options={{ 
            title: "Select Location",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="search/passenger-select" 
          options={{ 
            title: "Select Passengers",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="search/class-select" 
          options={{ 
            title: "Select Class",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="search/date-select" 
          options={{ 
            title: "Select Date",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="search/results" 
          options={{ 
            title: "Search Results",
          }} 
        />
        <Stack.Screen 
          name="booking/index" 
          options={{ 
            title: "Complete Booking",
          }} 
        />
        <Stack.Screen 
          name="booking/payment" 
          options={{ 
            title: "Payment",
          }} 
        />
        <Stack.Screen 
          name="booking/confirmation" 
          options={{ 
            title: "Booking Confirmation",
            headerBackVisible: false,
          }} 
        />
        <Stack.Screen 
          name="trips/details" 
          options={{ 
            title: "Trip Details",
          }} 
        />
        <Stack.Screen 
          name="offers/index" 
          options={{ 
            title: "Special Offers",
          }} 
        />
        <Stack.Screen 
          name="offers/details" 
          options={{ 
            title: "Offer Details",
          }} 
        />
        <Stack.Screen 
          name="destinations/index" 
          options={{ 
            title: "Destinations",
          }} 
        />
        <Stack.Screen 
          name="destinations/details" 
          options={{ 
            title: "Destination Details",
          }} 
        />
        <Stack.Screen 
          name="profile/edit" 
          options={{ 
            title: "Edit Profile",
          }} 
        />
        <Stack.Screen 
          name="profile/payment-methods" 
          options={{ 
            title: "Payment Methods",
          }} 
        />
        <Stack.Screen 
          name="profile/add-payment-method" 
          options={{ 
            title: "Add Payment Method",
          }} 
        />
        <Stack.Screen 
          name="profile/loyalty" 
          options={{ 
            title: "Loyalty Program",
          }} 
        />
        <Stack.Screen 
          name="legal/terms" 
          options={{ 
            title: "Terms of Service",
          }} 
        />
        <Stack.Screen 
          name="legal/privacy" 
          options={{ 
            title: "Privacy Policy",
          }} 
        />
        <Stack.Screen 
          name="help/index" 
          options={{ 
            title: "Help & Support",
          }} 
        />
        <Stack.Screen 
          name="help/contact" 
          options={{ 
            title: "Contact Support",
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            title: "Login",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            title: "Register",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="auth/pin-login" 
          options={{ 
            title: "PIN Login",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="welcome" 
          options={{ 
            title: "Welcome",
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}
