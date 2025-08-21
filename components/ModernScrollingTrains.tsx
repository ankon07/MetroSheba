import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { MotiView, useAnimationState } from "moti";
import { Easing } from "react-native-reanimated";
import UpcomingTrainCard from "./UpcomingTrainCard";
import { UpcomingTrain } from "@/types";

interface ModernScrollingTrainsProps {
  trains: UpcomingTrain[];
  onTrainPress: (trainId: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = 280;
const CARD_MARGIN = 12;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

export default function ModernScrollingTrains({
  trains,
  onTrainPress,
}: ModernScrollingTrainsProps) {
  const animationState = useAnimationState({
    from: {
      translateX: 0,
    },
    to: {
      translateX: -trains.length * TOTAL_CARD_WIDTH,
    },
  });

  // Create extended array for seamless looping
  const extendedTrains = [...trains, ...trains, ...trains];

  useEffect(() => {
    if (trains.length === 0) return;

    const startAnimation = () => {
      // Reset to start position
      animationState.transitionTo("from");
      
      // Start the continuous scroll animation
      setTimeout(() => {
        animationState.transitionTo("to");
      }, 100);
    };

    startAnimation();

    // Set up interval for continuous animation
    const interval = setInterval(() => {
      startAnimation();
    }, trains.length * 4000 + 1000); // Duration + small buffer

    return () => {
      clearInterval(interval);
    };
  }, [trains, animationState]);

  if (trains.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MotiView
        state={animationState}
        transition={{
          type: "timing",
          duration: trains.length * 4000,
          // Using easeOut for smooth, responsive feel as recommended by Motion.dev
          easing: Easing.out(Easing.quad),
        }}
        style={[
          styles.scrollContainer,
          {
            width: extendedTrains.length * TOTAL_CARD_WIDTH,
          },
        ]}
      >
        {extendedTrains.map((train, index) => (
          <MotiView
            key={`${train.id}-${index}`}
            style={styles.cardContainer}
            from={{
              opacity: 0,
              scale: 0.8,
              translateY: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateY: 0,
            }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 150,
              mass: 1,
              // Stagger the entrance animations
              delay: (index % trains.length) * 100,
            }}
          >
            <UpcomingTrainCard
              train={train}
              onPress={() => onTrainPress(train.id)}
            />
          </MotiView>
        ))}
      </MotiView>
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
