import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/colors';

interface PinDotsProps {
  pinLength: number;
  maxLength?: number;
}

export default function PinDots({ pinLength, maxLength = 5 }: PinDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxLength }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index < pinLength ? styles.filledDot : styles.emptyDot
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  emptyDot: {
    borderColor: '#ddd',
    backgroundColor: 'transparent',
  },
  filledDot: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
});
