import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import UpcomingTrainCard from "./UpcomingTrainCard";
import { UpcomingTrain } from "@/types";

interface ContinuousScrollingTrainsProps {
  trains: UpcomingTrain[];
  onTrainPress: (trainId: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = 280;
const CARD_MARGIN = 12;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

export default function ContinuousScrollingTrains({
  trains,
  onTrainPress,
}: ContinuousScrollingTrainsProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Duplicate trains to create seamless loop
  const duplicatedTrains = [...trains, ...trains, ...trains];
  const totalWidth = duplicatedTrains.length * TOTAL_CARD_WIDTH;

  useEffect(() => {
    if (trains.length === 0) return;

    const startAnimation = () => {
      // Reset to start position
      scrollX.setValue(0);
      
      // Animate to the end of the first set of trains
      animationRef.current = Animated.timing(scrollX, {
        toValue: -trains.length * TOTAL_CARD_WIDTH,
        duration: trains.length * 4000, // 4 seconds per train
        useNativeDriver: true,
      });

      animationRef.current.start(({ finished }) => {
        if (finished) {
          // Restart the animation for continuous loop
          startAnimation();
        }
      });
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [trains, scrollX]);

  if (trains.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scrollContainer,
          {
            transform: [{ translateX: scrollX }],
            width: totalWidth,
          },
        ]}
      >
        {duplicatedTrains.map((train, index) => (
          <View key={`${train.id}-${index}`} style={styles.cardContainer}>
            <UpcomingTrainCard
              train={train}
              onPress={() => onTrainPress(train.id)}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: "hidden",
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContainer: {
    marginRight: CARD_MARGIN,
  },
});
