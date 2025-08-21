import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Delete } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface PinKeypadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export default function PinKeypad({ onNumberPress, onBackspace, onClear }: PinKeypadProps) {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  const renderButton = (item: string, index: number) => {
    if (item === 'clear') {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.keypadButton, styles.actionButton]}
          onPress={onClear}
        >
          <X size={24} color="#666" />
        </TouchableOpacity>
      );
    }

    if (item === 'backspace') {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.keypadButton, styles.actionButton]}
          onPress={onBackspace}
        >
          <Delete size={24} color="#666" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.keypadButton}
        onPress={() => onNumberPress(item)}
      >
        <Text style={styles.keypadButtonText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {numbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((item, index) => renderButton(item, index))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keypadButton: {
    width: (width - 80) / 3,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    backgroundColor: '#e0e0e0',
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
});
