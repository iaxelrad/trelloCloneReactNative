import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { Link, Stack, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import DropdownPlus from '@/components/DropdownPlus';

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
    const data = await getBoards!();
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
        <Text style={{ fontSize: 16 }}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => <DropdownPlus />,
        }}
      />
      <FlatList
        data={boards}
        contentContainerStyle={boards.length > 0 && styles.list}
        keyExtractor={item => item.id}
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
    borderTopWidth: StyleSheet.hairlineWidth,
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
