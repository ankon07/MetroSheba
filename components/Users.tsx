import React from 'react';
import { View } from 'react-native';
import { Users as UsersIcon } from 'lucide-react-native';

interface UsersProps {
  size?: number;
  color?: string;
}

const Users: React.FC<UsersProps> = ({ size = 24, color = '#000' }) => {
  return <UsersIcon size={size} color={color} />;
};

export default Users;