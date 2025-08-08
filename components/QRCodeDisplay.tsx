import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QrCode } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  showValue?: boolean;
}

export default function QRCodeDisplay({ 
  value, 
  size = 120, 
  showValue = false 
}: QRCodeDisplayProps) {
  // Create a more realistic QR-like pattern based on the actual data
  const generateQRPattern = (data: string) => {
    // Create a hash from the data to generate a unique pattern
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;
    
    // Generate a 15x15 grid pattern
    const gridSize = 15;
    const pattern = [];
    
    for (let i = 0; i < gridSize; i++) {
      let row = '';
      for (let j = 0; j < gridSize; j++) {
        // Create finder patterns (corner squares)
        if ((i < 7 && j < 7) || (i < 7 && j >= gridSize - 7) || (i >= gridSize - 7 && j < 7)) {
          if ((i === 0 || i === 6 || j === 0 || j === 6) && 
              !((i >= 2 && i <= 4) && (j >= 2 && j <= 4))) {
            row += '█';
          } else if ((i >= 2 && i <= 4) && (j >= 2 && j <= 4)) {
            row += '█';
          } else {
            row += ' ';
          }
        } else {
          // Generate data pattern based on hash and position
          const cellValue = (seed + i * gridSize + j) % 3;
          row += cellValue === 0 ? '█' : ' ';
        }
      }
      pattern.push(row);
    }
    
    return pattern;
  };

  const qrPattern = generateQRPattern(value);

  return (
    <View style={styles.container}>
      <View style={[styles.qrContainer, { width: size, height: size }]}>
        <View style={styles.qrCode}>
          {qrPattern.map((row, index) => (
            <Text key={index} style={styles.qrRow}>
              {row}
            </Text>
          ))}
        </View>
      </View>
      
      {showValue && (
        <Text style={styles.valueText}>{value}</Text>
      )}
      
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketId}>Ticket ID: {value}</Text>
        <Text style={styles.instructionText}>Scan at Station Gates</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  qrContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCode: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrRow: {
    fontSize: 6,
    lineHeight: 7,
    fontFamily: 'monospace',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  ticketInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  ticketId: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});