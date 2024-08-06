import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Task } from '@/types/enums';
import { useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { Ionicons } from '@expo/vector-icons';

const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const router = useRouter();
  const { getFileFromPath } = useSupabase();
  const [imagePath, setImagePath] = useState<string>();

  if (item.image_url) {
    getFileFromPath!(item.image_url).then(path => {
      if (path) {
        setImagePath(path);
      }
    });
  }

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
          <>
            {imagePath && (
              <Image
                source={{ uri: imagePath }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }}
              />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1 }}>{item.title}</Text>
              {item.assigned_to && (
                <Ionicons
                  name="person-circle-outline"
                  size={16}
                  color="black"
                />
              )}
            </View>
          </>
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
