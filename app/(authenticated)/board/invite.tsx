import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { User } from '@/types/enums';
import { useHeaderHeight } from '@react-navigation/elements';
import { DefaultTheme } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();

  const onSearchUser = async () => {
    const users = await findUsers!(search);
    setUserList(users);
  };

  const onAddUser = async (user: User) => {
    await addUserToBoard!(id!, user.id);
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerSearchBarOptions: {
            inputType: 'email',
            placeholder: 'Invite by name, username or email',
            autoFocus: true,
            cancelButtonText: 'Done',
            onChangeText: e => setSearch(e.nativeEvent.text),
            onCancelButtonPress: onSearchUser,
          },
        }}
      />
      <FlatList
        data={userList}
        keyExtractor={item => item.id}
        style={{ marginTop: 60 + headerHeight }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={item => <UserListItem element={item} onPress={onAddUser} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Page;
