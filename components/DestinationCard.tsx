import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import TransportationIcon from "./TransportationIcon";
import { TransportationType } from "@/types";

interface DestinationCardProps {
  from: string;
  to: string;
  price: number;
  image: string;
  transportationType: TransportationType;
  onPress: () => void;
}

export default function DestinationCard({
  from,
  to,
  price,
  image,
  transportationType,
  onPress,
}: DestinationCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{from} to {to}</Text>
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.transportationContainer}>
                <TransportationIcon 
                  type={transportationType} 
                  size={16} 
                  color="#fff" 
                />
              </View>
              <Text style={styles.price}>৳{price}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 12,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  content: {
    justifyContent: "space-between",
  },
  routeContainer: {
    marginBottom: 8,
  },
  routeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transportationContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    padding: 4,
  },
  price: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
