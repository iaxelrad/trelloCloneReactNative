import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { Colors } from '@/constants/Colors';
import { Board, User } from '@/types/enums';
import { Ionicons } from '@expo/vector-icons';
import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBoardInfo, updateBoard, deleteBoard, getBoardMember } =
    useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();
  const [member, setMember] = useState<User[]>([]);

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    if (!id) return;

    const data = await getBoardInfo!(id);
    setBoard(data);

    const member = await getBoardMember!(id);
    setMember(member);
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
        <View>
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
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <Ionicons name="person-outline" size={18} color={Colors.fontDark} />
          <Text
            style={{ color: Colors.fontDark, fontSize: 16, fontWeight: 'bold' }}
          >
            Members
          </Text>
        </View>

        <FlatList
          data={member}
          keyExtractor={item => item.id}
          style={{ marginVertical: 12 }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={item => (
            <UserListItem element={item} onPress={() => {}} />
          )}
        />

        <Link href={`/(authenticated)/board/invite?id=${id}`} asChild>
          <TouchableOpacity style={styles.fullBtn}>
            <Text style={{ fontSize: 16, color: Colors.fontLight }}>
              Invite...
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text>Close Board</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  fullBtn: {
    backgroundColor: Colors.primary,
    padding: 8,
    marginLeft: 32,
    marginRight: 16,
    marginTop: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default Page;
