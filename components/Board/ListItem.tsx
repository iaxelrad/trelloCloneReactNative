import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Task } from '@/types/enums';
import { useRouter } from 'expo-router';

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const router = useRouter();

  const openLink = () => {
    router.push(`/board/card/${item.id}`);
  };

  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        onPress={openLink}
        disabled={isActive}
        style={[styles.rowItem, { opacity: isActive ? 0.5 : 1 }]}
      >
        {!item.image_url ? (
          <View>
            <Text>{item.title}</Text>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  rowItem: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});
