import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { Link, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';

const Page = () => {
  const { getBoards } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [])
  );

  const loadBoards = async () => {
    console.log('loading Boards');
    const data = await getBoards!();
    console.log('data', data);
    setBoards(data);
  };

  const ListItem = ({ item }: { item: Board }) => (
    <Link
      href={`/(authenticated)/board/${item.id}?bg=${encodeURIComponent(
        item.background
      )}`}
      key={item.id}
      style={styles.listItem}
      asChild
    >
      <TouchableOpacity>
        <View
          style={[styles.colorBlock, { backgroundColor: item.background }]}
        />
        <View style={[]}>
          <Text style={{ fontSize: 16 }}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={boards}
        contentContainerStyle={!!boards.length && styles.list}
        renderItem={ListItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadBoards} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  list: {
    borderColor: Colors.grey,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginStart: 50,
  },
  colorBlock: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});

export default Page;
