import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { initializeUser } from "@/store/userStore";

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
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
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
      </Stack>
    </>
  );
}