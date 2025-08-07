import React from 'react';
import { View } from 'react-native';
import { Check as CheckIcon } from 'lucide-react-native';

interface CheckProps {
  size?: number;
  color?: string;
}

const Check: React.FC<CheckProps> = ({ size = 24, color = '#000' }) => {
  return <CheckIcon size={size} color={color} />;
};

export default Check;