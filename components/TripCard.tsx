import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ChevronRight, Clock } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Trip } from "@/types";
import TransportationIcon from "./TransportationIcon";

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  showPrice?: boolean;
  compact?: boolean;
}

export default function TripCard({
  trip,
  onPress,
  showPrice = true,
  compact = false,
}: TripCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.transportationIcon}>
          <TransportationIcon type={trip.transportationType} size={20} />
        </View>
        
        <View style={styles.tripInfo}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{trip.departureTime}</Text>
            <View style={styles.durationContainer}>
              <View style={styles.line} />
              <View style={styles.durationBadge}>
                <Clock size={12} color={Colors.text.secondary} />
                <Text style={styles.duration}>{trip.duration}</Text>
              </View>
              <View style={styles.line} />
            </View>
            <Text style={styles.time}>{trip.arrivalTime}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={styles.location} numberOfLines={1}>
              {trip.from.city}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {trip.to.city}
            </Text>
          </View>
          
          {!compact && (
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>{trip.from.station}</Text>
              <Text style={styles.details}>{trip.to.station}</Text>
            </View>
          )}
          
          {!compact && (
            <View style={styles.companyContainer}>
              <Text style={styles.company}>{trip.company}</Text>
              <View style={styles.classBadge}>
                <Text style={styles.classText}>{trip.class}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.rightContent}>
        {showPrice && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>৳{trip.price}</Text>
            <Text style={styles.priceDetails}>per person</Text>
          </View>
        )}
        <ChevronRight size={20} color={Colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactContainer: {
    padding: 12,
  },
  leftContent: {
    flexDirection: "row",
    flex: 1,
  },
  transportationIcon: {
    marginRight: 12,
    alignSelf: "center",
  },
  tripInfo: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  durationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 4,
  },
  duration: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.text.primary,
    maxWidth: "45%",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  details: {
    fontSize: 12,
    color: Colors.text.secondary,
    maxWidth: "45%",
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  company: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  classBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  classText: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  rightContent: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  priceContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  priceDetails: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
});
