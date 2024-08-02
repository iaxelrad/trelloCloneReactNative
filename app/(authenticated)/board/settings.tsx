import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { Colors } from '@/constants/Colors';
import { Board } from '@/types/enums';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBoardInfo, updateBoard, deleteBoard } = useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    const data = await getBoardInfo!(id!);
    setBoard(data);
  };

  const onUpdateBoard = async () => {
    const updated = await updateBoard!(board!);
    setBoard(updated);
  };

  const onDelete = async () => {
    await deleteBoard!(id!);
    router.dismissAll();
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Board name</Text>
        <TextInput
          value={board?.title}
          onChangeText={text => setBoard({ ...board!, title: text })}
          style={styles.input}
          returnKeyType="done"
          enterKeyHint="done"
          onEndEditing={onUpdateBoard}
        />
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text>Close board</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  label: {
    color: Colors.grey,
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: Colors.fontDark,
  },
  deleteBtn: {
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
});
