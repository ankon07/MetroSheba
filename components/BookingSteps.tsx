import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import { Check } from "lucide-react-native";

interface BookingStepsProps {
  currentStep: number;
  steps: string[];
}

export default function BookingSteps({
  currentStep,
  steps,
}: BookingStepsProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.completedConnector,
                ]}
              />
            )}
            <View
              style={[
                styles.stepCircle,
                isCompleted && styles.completedStepCircle,
                isCurrent && styles.currentStepCircle,
              ]}
            >
              {isCompleted ? (
                <Check size={16} color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isCurrent && styles.currentStepNumber,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E1E1E1",
    alignItems: "center",
    justifyContent: "center",
  },
  completedStepCircle: {
    backgroundColor: Colors.accent,
  },
  currentStepCircle: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  currentStepNumber: {
    color: "#fff",
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: "#E1E1E1",
    marginHorizontal: 8,
  },
  completedConnector: {
    backgroundColor: Colors.accent,
  },
});