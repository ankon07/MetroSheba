import React from "react";
import { StyleSheet, View } from "react-native";
import { Plane, Train, Bus, Car, Ship } from "lucide-react-native";
import Colors from "@/constants/colors";
import { TransportationType } from "@/types";

interface TransportationIconProps {
  type: TransportationType;
  size?: number;
  color?: string;
  containerStyle?: object;
}

export default function TransportationIcon({
  type,
  size = 24,
  color,
  containerStyle,
}: TransportationIconProps) {
  const iconColor = color || Colors.transportationIcons[type];

  const renderIcon = () => {
    switch (type) {
      case "plane":
        return <Plane size={size} color={iconColor} />;
      case "train":
        return <Train size={size} color={iconColor} />;
      case "bus":
        return <Bus size={size} color={iconColor} />;
      case "car":
        return <Car size={size} color={iconColor} />;
      case "ferry":
        return <Ship size={size} color={iconColor} />;
      default:
        return <Train size={size} color={iconColor} />;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});