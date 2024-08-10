import {
  TouchableOpacity,
  Image,
  ListRenderItemInfo,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { User } from '@/types/enums';
import { Colors } from '@/constants/Colors';

interface UserListItemProps {
  element: ListRenderItemInfo<User>;
  onPress: (user: User) => void;
}

const UserListItem = ({ element: { item }, onPress }: UserListItemProps) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}
  >
    <Image
      source={{ uri: item.avatar_url }}
      style={{ width: 30, height: 30, borderRadius: 40 }}
    />
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'semibold' }}>
        {item.first_name}
      </Text>
      <Text style={{ color: Colors.grey }}>{item.email}</Text>
    </View>
  </TouchableOpacity>
);

export default UserListItem;
