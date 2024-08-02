import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { TaskList } from '@/types/enums';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export interface ListViewProps {
  taskList: TaskList;
}

const ListView = ({ taskList }: ListViewProps) => {
  const [listName, setListName] = useState(taskList.title);
  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.listTitle}>{listName}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={22}
              color={Colors.grey}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3EFFC',
    borderRadius: 4,
    padding: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  listTitle: {
    paddingVertical: 8,
    fontWeight: '500',
  },
});

export default ListView;
