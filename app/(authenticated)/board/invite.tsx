import { View, FlatList } from 'react-native';
import { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { User } from '@/types/enums';
import { useHeaderHeight } from '@react-navigation/elements';
import { DefaultTheme } from '@react-navigation/native';
import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();

  const onSearchUser = async () => {
    const data = await findUsers!(search);
    setUserList(data);
  };

  const onAddUser = async (user: User) => {
    await addUserToBoard!(id!, user.id);
    router.dismiss();
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
            autoCapitalize: 'none',
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

export default Page;
