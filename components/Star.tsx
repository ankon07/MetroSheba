import React from 'react';
import { View } from 'react-native';
import { Star as StarIcon } from 'lucide-react-native';

interface StarProps {
  size?: number;
  color?: string;
}

const Star: React.FC<StarProps> = ({ size = 24, color = '#000' }) => {
  return <StarIcon size={size} color={color} />;
};

export default Star;