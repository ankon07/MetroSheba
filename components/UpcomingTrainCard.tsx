import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Clock, Train, Users, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { UpcomingTrain } from "@/types";

interface UpcomingTrainCardProps {
  train: UpcomingTrain;
  onPress: () => void;
}

export default function UpcomingTrainCard({ train, onPress }: UpcomingTrainCardProps) {
  const getStatusColor = () => {
    switch (train.status) {
      case "on-time":
        return Colors.success;
      case "delayed":
        return Colors.warning;
      case "cancelled":
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const getCrowdLevelColor = () => {
    switch (train.crowdLevel) {
      case "low":
        return Colors.success;
      case "medium":
        return Colors.warning;
      case "high":
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const getCrowdLevelText = () => {
    switch (train.crowdLevel) {
      case "low":
        return "Light";
      case "medium":
        return "Moderate";
      case "high":
        return "Crowded";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.trainInfo}>
          <Train size={20} color={Colors.primary} />
          <Text style={styles.trainNumber}>{train.trainNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {train.status === "delayed" && train.delay ? `+${train.delay}m` : train.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.stationName} numberOfLines={1}>{train.from.name}</Text>
        <View style={styles.arrow}>
          <View style={styles.arrowLine} />
          <View style={styles.arrowHead} />
        </View>
        <Text style={styles.stationName} numberOfLines={1}>{train.to.name}</Text>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeInfo}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.timeText}>{train.departureTime}</Text>
        </View>
        <Text style={styles.platform}>{train.platform}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.crowdInfo}>
          <Users size={16} color={getCrowdLevelColor()} />
          <Text style={[styles.crowdText, { color: getCrowdLevelColor() }]}>
            {getCrowdLevelText()}
          </Text>
        </View>
        {train.status === "delayed" && (
          <View style={styles.delayInfo}>
            <AlertCircle size={16} color={Colors.warning} />
            <Text style={styles.delayText}>Delayed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 280,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trainInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  trainNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.light,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stationName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  arrow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  arrowLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.primary,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
    borderTopWidth: 4,
    borderTopColor: "transparent",
    borderBottomWidth: 4,
    borderBottomColor: "transparent",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  platform: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  crowdInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  crowdText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  delayInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  delayText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.warning,
    marginLeft: 4,
  },
});