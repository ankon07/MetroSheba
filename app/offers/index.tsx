import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import SpecialOfferCard from "@/components/SpecialOfferCard";
import Colors from "@/constants/colors";

// Metro Rail special offers and promotions
const allOffers = [
  {
    id: "offer1",
    title: "MRT Pass Discount",
    description: "Get 10% off on all journeys with MRT Pass",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "10% Off",
  },
  {
    id: "offer2",
    title: "Student Special",
    description: "50% discount for students with valid ID",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "50% Off",
  },
  {
    id: "offer3",
    title: "Weekend Explorer",
    description: "Unlimited rides on weekends",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "৳150",
  },
  {
    id: "offer4",
    title: "Senior Citizen Benefit",
    description: "Free travel for citizens above 65",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "Free",
  },
  {
    id: "offer5",
    title: "Group Travel Discount",
    description: "15% off for groups of 10 or more",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "15% Off",
  },
  {
    id: "offer6",
    title: "Monthly Pass Special",
    description: "Save ৳500 on monthly unlimited pass",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "৳500 Off",
  },
  {
    id: "offer7",
    title: "Early Bird Special",
    description: "20% off for journeys before 8 AM",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "20% Off",
  },
  {
    id: "offer8",
    title: "Eco-Friendly Commuter",
    description: "Carbon offset program participation",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    discount: "Green+",
  },
];

export default function OffersScreen() {
  const router = useRouter();

  const handleOfferPress = (offerId: string) => {
    router.push({
      pathname: "/offers/details",
      params: { id: offerId }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Metro Offers & Benefits" }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Metro Rail Offers</Text>
        <Text style={styles.subtitle}>Special discounts and benefits for commuters</Text>
      </View>
      
      <FlatList
        data={allOffers}
        renderItem={({ item }) => (
          <View style={styles.offerItem}>
            <SpecialOfferCard
              title={item.title}
              description={item.description}
              image={item.image}
              discount={item.discount}
              onPress={() => handleOfferPress(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.offersList}
        numColumns={1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  offersList: {
    padding: 16,
  },
  offerItem: {
    marginBottom: 16,
  },
});